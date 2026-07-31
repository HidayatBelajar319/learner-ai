import { Hono } from 'hono';
import { Env } from '@/types';
import { successResponse, errorResponse, generateId, now } from '@/api/utils/helpers';
import { verifyToken, extractToken } from '@/lib/auth/jwt';

const social = new Hono<{ Bindings: Env }>();

async function requireAuth(request: Request, jwtSecret: string) {
  const token = extractToken(request);
  if (!token) return null;
  return verifyToken(token, jwtSecret);
}

interface PublicUser {
  id: string;
  username: string;
  full_name: string;
  avatar: string | null;
  total_xp: number;
  level: number;
  current_streak: number;
}

async function getUserPublic(db: D1Database, userId: string): Promise<PublicUser | null> {
  const row = await db
    .prepare(
      `SELECT u.id, u.username, u.full_name, u.profile,
        COALESCE(x.total_xp, 0) as total_xp, COALESCE(x.level, 1) as level,
        COALESCE(s.current_streak, 0) as current_streak
       FROM users u
       LEFT JOIN user_xp x ON x.user_id = u.id
       LEFT JOIN user_streaks s ON s.user_id = u.id
       WHERE u.id = ?`,
    )
    .bind(userId)
    .first<any>();

  if (!row) return null;

  let profile: { avatar?: string } = {};
  try { profile = JSON.parse(row.profile || '{}'); } catch { profile = {}; }

  return {
    id: row.id,
    username: row.username,
    full_name: row.full_name,
    avatar: profile.avatar ?? null,
    total_xp: row.total_xp ?? 0,
    level: row.level ?? 1,
    current_streak: row.current_streak ?? 0,
  };
}

async function getRelationship(db: D1Database, a: string, b: string) {
  return db
    .prepare(
      `SELECT * FROM friendships
       WHERE (requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?)
       LIMIT 1`,
    )
    .bind(a, b, b, a)
    .first<any>();
}

function relStatus(fs: any, me: string): 'none' | 'pending_out' | 'pending_in' | 'friends' {
  if (!fs) return 'none';
  if (fs.status === 'accepted') return 'friends';
  return fs.requester_id === me ? 'pending_out' : 'pending_in';
}

/**
 * GET /api/social/overview
 * Ringkasan sosial (badge: permintaan masuk & chat belum dibaca)
 */
social.get('/overview', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const friends = await c.env.LEARNER_DB
    .prepare("SELECT COUNT(*) as count FROM friendships WHERE status = 'accepted' AND (requester_id = ? OR addressee_id = ?)")
    .bind(payload.sub, payload.sub)
    .first<{ count: number }>();

  const pending = await c.env.LEARNER_DB
    .prepare("SELECT COUNT(*) as count FROM friendships WHERE status = 'pending' AND addressee_id = ?")
    .bind(payload.sub)
    .first<{ count: number }>();

  const unread = await c.env.LEARNER_DB
    .prepare('SELECT COUNT(*) as count FROM messages WHERE recipient_id = ? AND read_at IS NULL')
    .bind(payload.sub)
    .first<{ count: number }>();

  return successResponse('Ringkasan sosial', {
    friends_count: friends?.count ?? 0,
    pending_requests: pending?.count ?? 0,
    unread_count: unread?.count ?? 0,
  });
});

/**
 * GET /api/social/search?q=...
 * Cari user untuk ditambahkan sebagai teman
 */
social.get('/search', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const q = String(c.req.query('q') || '').trim();
  if (!q) return successResponse('Hasil pencarian', []);

  const like = `%${q}%`;
  const rows = await c.env.LEARNER_DB
    .prepare(
      `SELECT id, username, full_name, profile FROM users
       WHERE id != ? AND is_active = 1 AND (username LIKE ? OR full_name LIKE ? OR email LIKE ?)
       ORDER BY full_name ASC LIMIT 10`,
    )
    .bind(payload.sub, like, like, like)
    .all<{ id: string; username: string; full_name: string; profile: string }>();

  const results: Array<PublicUser & { status: string }> = [];
  for (const r of rows.results) {
    const user = await getUserPublic(c.env.LEARNER_DB, r.id);
    if (!user) continue;
    const fs = await getRelationship(c.env.LEARNER_DB, payload.sub, r.id);
    results.push({ ...user, status: relStatus(fs, payload.sub) });
  }

  return successResponse('Hasil pencarian', results);
});

/**
 * GET /api/social/friends
 * Daftar teman (status accepted) + info pesan terakhir & belum dibaca
 */
social.get('/friends', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const rows = await c.env.LEARNER_DB
    .prepare(
      `SELECT f.id as friendship_id, f.requester_id, f.addressee_id, f.created_at,
        CASE WHEN f.requester_id = ? THEN f.addressee_id ELSE f.requester_id END as friend_id
       FROM friendships f
       WHERE f.status = 'accepted' AND (f.requester_id = ? OR f.addressee_id = ?)
       ORDER BY f.created_at DESC`,
    )
    .bind(payload.sub, payload.sub, payload.sub)
    .all<{ friendship_id: string; friend_id: string; created_at: string }>();

  const friends: Array<PublicUser & { friendship_id: string; last_message: string | null; unread_count: number }> = [];
  for (const r of rows.results) {
    const user = await getUserPublic(c.env.LEARNER_DB, r.friend_id);
    if (!user) continue;

    const lastMsg = await c.env.LEARNER_DB
      .prepare(
        `SELECT content FROM messages
         WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)
         ORDER BY created_at DESC LIMIT 1`,
      )
      .bind(r.friend_id, payload.sub, payload.sub, r.friend_id)
      .first<{ content: string }>();

    const unread = await c.env.LEARNER_DB
      .prepare('SELECT COUNT(*) as count FROM messages WHERE sender_id = ? AND recipient_id = ? AND read_at IS NULL')
      .bind(r.friend_id, payload.sub)
      .first<{ count: number }>();

    friends.push({
      ...user,
      friendship_id: r.friendship_id,
      last_message: lastMsg?.content ?? null,
      unread_count: unread?.count ?? 0,
    });
  }

  return successResponse('Daftar teman', friends);
});

/**
 * GET /api/social/requests
 * Permintaan masuk & keluar
 */
social.get('/requests', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const incomingRows = await c.env.LEARNER_DB
    .prepare(
      `SELECT id, requester_id, created_at FROM friendships
       WHERE addressee_id = ? AND status = 'pending' ORDER BY created_at DESC`,
    )
    .bind(payload.sub)
    .all<{ id: string; requester_id: string; created_at: string }>();

  const outgoingRows = await c.env.LEARNER_DB
    .prepare(
      `SELECT id, addressee_id, created_at FROM friendships
       WHERE requester_id = ? AND status = 'pending' ORDER BY created_at DESC`,
    )
    .bind(payload.sub)
    .all<{ id: string; addressee_id: string; created_at: string }>();

  const incoming = [];
  for (const r of incomingRows.results) {
    const user = await getUserPublic(c.env.LEARNER_DB, r.requester_id);
    if (user) incoming.push({ id: r.id, user, created_at: r.created_at });
  }

  const outgoing = [];
  for (const r of outgoingRows.results) {
    const user = await getUserPublic(c.env.LEARNER_DB, r.addressee_id);
    if (user) outgoing.push({ id: r.id, user, created_at: r.created_at });
  }

  return successResponse('Permintaan pertemanan', { incoming, outgoing });
});

/**
 * POST /api/social/requests
 * Kirim permintaan pertemanan
 */
social.post('/requests', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { addressee_id?: string };
  try {
    body = await c.req.json();
  } catch {
    return errorResponse('Format request tidak valid');
  }

  const addresseeId = String(body.addressee_id || '').trim();
  if (!addresseeId) return errorResponse('addressee_id wajib diisi', 400);
  if (addresseeId === payload.sub) return errorResponse('Tidak bisa berteman dengan diri sendiri', 400);

  const target = await c.env.LEARNER_DB
    .prepare('SELECT id FROM users WHERE id = ? AND is_active = 1')
    .bind(addresseeId)
    .first();

  if (!target) return errorResponse('Pengguna tidak ditemukan', 404);

  const existing = await getRelationship(c.env.LEARNER_DB, payload.sub, addresseeId);
  if (existing) {
    const status = relStatus(existing, payload.sub);
    if (status === 'friends') return errorResponse('Kamu sudah berteman dengan pengguna ini', 400);
    if (status === 'pending_out') return errorResponse('Permintaan pertemanan sudah dikirim', 400);
    if (status === 'pending_in') {
      await c.env.LEARNER_DB
        .prepare("UPDATE friendships SET status = 'accepted', responded_at = ? WHERE id = ?")
        .bind(now(), existing.id)
        .run();
      return successResponse('Permintaan diterima. Kalian sekarang berteman!');
    }
  }

  await c.env.LEARNER_DB
    .prepare("INSERT INTO friendships (id, requester_id, addressee_id, status, created_at) VALUES (?, ?, ?, 'pending', ?)")
    .bind(generateId(), payload.sub, addresseeId, now())
    .run();

  return successResponse('Permintaan pertemanan terkirim');
});

/**
 * POST /api/social/requests/:id/accept
 * Terima permintaan pertemanan
 */
social.post('/requests/:id/accept', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const fs = await c.env.LEARNER_DB
    .prepare("SELECT * FROM friendships WHERE id = ? AND addressee_id = ? AND status = 'pending'")
    .bind(c.req.param('id'), payload.sub)
    .first<any>();

  if (!fs) return errorResponse('Permintaan tidak ditemukan', 404);

  await c.env.LEARNER_DB
    .prepare("UPDATE friendships SET status = 'accepted', responded_at = ? WHERE id = ?")
    .bind(now(), fs.id)
    .run();

  return successResponse('Permintaan diterima. Kalian sekarang berteman!');
});

/**
 * POST /api/social/requests/:id/reject
 * Tolak permintaan pertemanan
 */
social.post('/requests/:id/reject', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const fs = await c.env.LEARNER_DB
    .prepare("SELECT * FROM friendships WHERE id = ? AND addressee_id = ? AND status = 'pending'")
    .bind(c.req.param('id'), payload.sub)
    .first<any>();

  if (!fs) return errorResponse('Permintaan tidak ditemukan', 404);

  await c.env.LEARNER_DB.prepare('DELETE FROM friendships WHERE id = ?').bind(fs.id).run();

  return successResponse('Permintaan ditolak');
});

/**
 * DELETE /api/social/requests/:id
 * Batalkan permintaan yang dikirim
 */
social.delete('/requests/:id', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const fs = await c.env.LEARNER_DB
    .prepare("SELECT * FROM friendships WHERE id = ? AND requester_id = ? AND status = 'pending'")
    .bind(c.req.param('id'), payload.sub)
    .first<any>();

  if (!fs) return errorResponse('Permintaan tidak ditemukan', 404);

  await c.env.LEARNER_DB.prepare('DELETE FROM friendships WHERE id = ?').bind(fs.id).run();

  return successResponse('Permintaan dibatalkan');
});

/**
 * DELETE /api/social/friends/:friendId
 * Hapus teman
 */
social.delete('/friends/:friendId', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const friendId = c.req.param('friendId');

  const fs = await c.env.LEARNER_DB
    .prepare(
      `SELECT id FROM friendships
       WHERE status = 'accepted' AND ((requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?)) LIMIT 1`,
    )
    .bind(payload.sub, friendId, friendId, payload.sub)
    .first<any>();

  if (!fs) return errorResponse('Teman tidak ditemukan', 404);

  await c.env.LEARNER_DB.prepare('DELETE FROM friendships WHERE id = ?').bind(fs.id).run();

  return successResponse('Teman dihapus');
});

/**
 * GET /api/social/messages/:friendId
 * Riwayat chat dengan teman (tandai sudah dibaca)
 */
social.get('/messages/:friendId', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const friendId = c.req.param('friendId');
  const limit = Math.min(Math.max(Number(c.req.query('limit')) || 100, 1), 200);

  const fs = await c.env.LEARNER_DB
    .prepare(
      `SELECT id FROM friendships
       WHERE status = 'accepted' AND ((requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?)) LIMIT 1`,
    )
    .bind(payload.sub, friendId, friendId, payload.sub)
    .first();

  if (!fs) return errorResponse('Kamu belum berteman dengan pengguna ini', 403);

  await c.env.LEARNER_DB
    .prepare("UPDATE messages SET read_at = ? WHERE sender_id = ? AND recipient_id = ? AND read_at IS NULL")
    .bind(now(), friendId, payload.sub)
    .run();

  const messages = await c.env.LEARNER_DB
    .prepare(
      `SELECT id, sender_id, recipient_id, content, created_at, read_at FROM messages
       WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)
       ORDER BY created_at DESC LIMIT ?`,
    )
    .bind(payload.sub, friendId, friendId, payload.sub, limit)
    .all();

  return successResponse('Riwayat chat', messages.results.reverse());
});

/**
 * POST /api/social/messages
 * Kirim pesan ke teman
 */
social.post('/messages', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { recipient_id?: string; content?: string };
  try {
    body = await c.req.json();
  } catch {
    return errorResponse('Format request tidak valid');
  }

  const recipientId = String(body.recipient_id || '').trim();
  const content = String(body.content || '').trim().slice(0, 1000);

  if (!recipientId) return errorResponse('recipient_id wajib diisi', 400);
  if (!content) return errorResponse('Pesan tidak boleh kosong', 400);

  const fs = await c.env.LEARNER_DB
    .prepare(
      `SELECT id FROM friendships
       WHERE status = 'accepted' AND ((requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?)) LIMIT 1`,
    )
    .bind(payload.sub, recipientId, recipientId, payload.sub)
    .first();

  if (!fs) return errorResponse('Kamu belum berteman dengan pengguna ini', 403);

  const messageId = generateId();
  const createdAt = now();

  await c.env.LEARNER_DB
    .prepare('INSERT INTO messages (id, sender_id, recipient_id, content, created_at) VALUES (?, ?, ?, ?, ?)')
    .bind(messageId, payload.sub, recipientId, content, createdAt)
    .run();

  return successResponse('Pesan terkirim', { id: messageId, sender_id: payload.sub, recipient_id: recipientId, content, created_at: createdAt });
});

/**
 * GET /api/social/leaderboard?limit=20
 * Peringkat pengguna berdasarkan XP
 */
social.get('/leaderboard', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const limit = Math.min(Math.max(Number(c.req.query('limit')) || 20, 5), 100);

  const rows = await c.env.LEARNER_DB
    .prepare(
      `SELECT u.id, u.username, u.full_name, u.profile,
        COALESCE(x.total_xp, 0) as total_xp, COALESCE(x.level, 1) as level,
        COALESCE(s.current_streak, 0) as current_streak
       FROM users u
       LEFT JOIN user_xp x ON x.user_id = u.id
       LEFT JOIN user_streaks s ON s.user_id = u.id
       WHERE u.is_active = 1 AND COALESCE(x.total_xp, 0) > 0
       ORDER BY x.total_xp DESC, u.created_at ASC
       LIMIT ?`,
    )
    .bind(limit)
    .all<any>();

  const entries = rows.results.map((r, i) => {
    let profile: { avatar?: string } = {};
    try { profile = JSON.parse(r.profile || '{}'); } catch { profile = {}; }
    return {
      rank: i + 1,
      id: r.id,
      username: r.username,
      full_name: r.full_name,
      avatar: profile.avatar ?? null,
      total_xp: r.total_xp ?? 0,
      level: r.level ?? 1,
      current_streak: r.current_streak ?? 0,
      is_me: r.id === payload.sub,
    };
  });

  return successResponse('Peringkat pengguna', entries);
});

export default social;
