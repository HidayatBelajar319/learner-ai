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
      `SELECT u.id, u.email, u.username, u.full_name, u.role, u.is_active, u.created_at, x.total_xp
       FROM users u LEFT JOIN user_xp x ON x.user_id = u.id
       ORDER BY u.created_at DESC LIMIT 100`,
    )
    .all();

  return successResponse('Daftar user', users.results);
});

/**
 * POST /api/admin/users/:id/toggle
 * Aktif/nonaktifkan user
 */
admin.post('/users/:id/toggle', async (c) => {
  const payload = await requireAdmin(c.req.raw, c.env);
  if (!payload) return errorResponse('Unauthorized', 401);

  const id = c.req.param('id');
  if (id === payload.sub) return errorResponse('Tidak bisa menonaktifkan akun sendiri', 400);

  const user = await c.env.LEARNER_DB
    .prepare('SELECT is_active FROM users WHERE id = ?')
    .bind(id)
    .first<{ is_active: number }>();
  if (!user) return errorResponse('User tidak ditemukan', 404);

  const newState = user.is_active === 1 ? 0 : 1;
  await c.env.LEARNER_DB
    .prepare('UPDATE users SET is_active = ? WHERE id = ?')
    .bind(newState, id)
    .run();

  return successResponse(newState === 1 ? 'User diaktifkan' : 'User dinonaktifkan', { is_active: newState });
});

export default admin;
