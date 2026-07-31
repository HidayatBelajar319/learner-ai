import { Hono } from 'hono';
import { Env } from '@/types';
import { successResponse, errorResponse } from '@/api/utils/helpers';
import { extractToken, verifyToken } from '@/lib/auth/jwt';

const admin = new Hono<{ Bindings: Env }>();

async function requireAdmin(request: Request, env: Env) {
  const token = extractToken(request);
  if (!token) return null;
  const payload = await verifyToken(token, env.JWT_SECRET);
  if (!payload) return null;
  const adminEmails = (env.ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase());
  if (!adminEmails.includes(payload.email.toLowerCase())) return null;
  return payload;
}

/**
 * GET /api/admin/stats
 * Statistik platform untuk admin
 */
admin.get('/stats', async (c) => {
  const payload = await requireAdmin(c.req.raw, c.env);
  if (!payload) return errorResponse('Unauthorized', 401);

  const db = c.env.LEARNER_DB;

  const [users, sessions, quizzes, cards, certs, activeToday, contents] = await Promise.all([
    db.prepare('SELECT COUNT(*) as c FROM users').first<{ c: number }>(),
    db.prepare('SELECT COUNT(*) as c FROM learning_sessions').first<{ c: number }>(),
    db.prepare('SELECT COUNT(*) as c FROM quizzes').first<{ c: number }>(),
    db.prepare('SELECT COUNT(*) as c FROM flashcards').first<{ c: number }>(),
    db.prepare('SELECT COUNT(*) as c FROM certificates').first<{ c: number }>(),
    db.prepare(`SELECT COUNT(*) as c FROM learning_history WHERE date(completed_at) = date('now')`).first<{ c: number }>(),
    db.prepare('SELECT COUNT(*) as c FROM content').first<{ c: number }>(),
  ]);

  return successResponse('Statistik platform', {
    total_users: users?.c ?? 0,
    total_sessions: sessions?.c ?? 0,
    total_quizzes: quizzes?.c ?? 0,
    total_cards: cards?.c ?? 0,
    total_certs: certs?.c ?? 0,
    active_today: activeToday?.c ?? 0,
    total_content: contents?.c ?? 0,
  });
});

/**
 * GET /api/admin/users
 * Daftar user untuk manajemen
 */
admin.get('/users', async (c) => {
  const payload = await requireAdmin(c.req.raw, c.env);
  if (!payload) return errorResponse('Unauthorized', 401);

  const users = await c.env.LEARNER_DB
    .prepare(
      `SELECT u.id, u.email, u.username, u.full_name, u.role, u.is_active, u.inactive_reason, u.created_at, x.total_xp
       FROM users u LEFT JOIN user_xp x ON x.user_id = u.id
       ORDER BY u.created_at DESC LIMIT 100`,
    )
    .all();

  return successResponse('Daftar user', users.results);
});

/**
 * POST /api/admin/users/:id/toggle
 * Aktif/nonaktifkan user dengan alasan
 */
admin.post('/users/:id/toggle', async (c) => {
  const payload = await requireAdmin(c.req.raw, c.env);
  if (!payload) return errorResponse('Unauthorized', 401);

  const id = c.req.param('id');
  if (id === payload.sub) return errorResponse('Tidak bisa menonaktifkan akun sendiri', 400);

  let body: { reason?: string };
  try { body = await c.req.json(); } catch { body = {}; }

  const user = await c.env.LEARNER_DB
    .prepare('SELECT is_active FROM users WHERE id = ?')
    .bind(id)
    .first<{ is_active: number }>();
  if (!user) return errorResponse('User tidak ditemukan', 404);

  const disabling = user.is_active === 1;
  const reason = (body.reason ?? '').trim();

  if (disabling && reason.length < 3) {
    return errorResponse('Alasan nonaktifkan wajib diisi (minimal 3 karakter)', 400);
  }

  if (disabling) {
    await c.env.LEARNER_DB
      .prepare('UPDATE users SET is_active = 0, inactive_reason = ? WHERE id = ?')
      .bind(reason, id)
      .run();
  } else {
    await c.env.LEARNER_DB
      .prepare('UPDATE users SET is_active = 1, inactive_reason = NULL WHERE id = ?')
      .bind(id)
      .run();
    await c.env.LEARNER_SESSION.delete(`acct-notice:${id}`);
  }

  return successResponse(disabling ? 'User dinonaktifkan' : 'User diaktifkan', { is_active: disabling ? 0 : 1 });
});

/**
 * POST /api/admin/users/:id/delete
 * Hapus akun user beserta semua datanya, dengan alasan
 */
admin.post('/users/:id/delete', async (c) => {
  const payload = await requireAdmin(c.req.raw, c.env);
  if (!payload) return errorResponse('Unauthorized', 401);

  const id = c.req.param('id');
  if (id === payload.sub) return errorResponse('Tidak bisa menghapus akun sendiri', 400);

  let body: { reason?: string };
  try { body = await c.req.json(); } catch { body = {}; }

  const reason = (body.reason ?? '').trim();
  if (reason.length < 3) {
    return errorResponse('Alasan hapus wajib diisi (minimal 3 karakter)', 400);
  }

  const user = await c.env.LEARNER_DB
    .prepare('SELECT email FROM users WHERE id = ?')
    .bind(id)
    .first<{ email: string }>();
  if (!user) return errorResponse('User tidak ditemukan', 404);

  await c.env.LEARNER_DB
    .prepare('INSERT INTO user_deletions (id, user_id, email, reason, deleted_by, deleted_at) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), id, user.email, reason, payload.email, new Date().toISOString())
    .run();

  await c.env.LEARNER_DB.batch([
    c.env.LEARNER_DB.prepare('DELETE FROM user_xp WHERE user_id = ?').bind(id),
    c.env.LEARNER_DB.prepare('DELETE FROM user_streaks WHERE user_id = ?').bind(id),
    c.env.LEARNER_DB.prepare('DELETE FROM user_2fa WHERE user_id = ?').bind(id),
    c.env.LEARNER_DB.prepare('DELETE FROM learning_history WHERE user_id = ?').bind(id),
    c.env.LEARNER_DB.prepare('DELETE FROM learning_sessions WHERE user_id = ?').bind(id),
    c.env.LEARNER_DB.prepare('DELETE FROM user_progress WHERE user_id = ?').bind(id),
    c.env.LEARNER_DB.prepare('DELETE FROM achievements WHERE user_id = ?').bind(id),
    c.env.LEARNER_DB.prepare('DELETE FROM badges WHERE user_id = ?').bind(id),
    c.env.LEARNER_DB.prepare('DELETE FROM certificates WHERE user_id = ?').bind(id),
    c.env.LEARNER_DB.prepare('DELETE FROM flashcard_decks WHERE user_id = ?').bind(id),
    c.env.LEARNER_DB.prepare('DELETE FROM flashcards WHERE user_id = ?').bind(id),
    c.env.LEARNER_DB.prepare('DELETE FROM api_keys WHERE user_id = ?').bind(id),
    c.env.LEARNER_DB.prepare('DELETE FROM users WHERE id = ?').bind(id),
  ]);

  await c.env.LEARNER_SESSION.delete(`acct-notice:${id}`);

  return successResponse('Akun berhasil dihapus');
});

export default admin;
