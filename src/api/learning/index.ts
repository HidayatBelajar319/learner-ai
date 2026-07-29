import { Hono } from 'hono';
import { Env } from '@/types';
import { successResponse, errorResponse, generateId, now, calculateLevel } from '@/api/utils/helpers';
import { verifyToken, extractToken } from '@/lib/auth/jwt';

const learning = new Hono<{ Bindings: Env }>();

/**
 * Middleware: cek auth
 */
async function requireAuth(request: Request, jwtSecret: string) {
  const token = extractToken(request);
  if (!token) return null;
  return verifyToken(token, jwtSecret);
}

/**
 * POST /api/learning/sessions
 * Mulai sesi belajar baru
 */
learning.post('/sessions', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { subject: string; topic: string; level: string };
  try {
    body = await c.req.json();
  } catch {
    return errorResponse('Format request tidak valid');
  }

  const { subject, topic, level } = body;
  if (!subject || !topic || !level) {
    return errorResponse('subject, topic, dan level wajib diisi', 400);
  }

  const sessionId = generateId();
  const createdAt = now();

  await c.env.LEARNER_DB
    .prepare(
      `INSERT INTO learning_sessions (id, user_id, subject, topic, level, status, progress, started_at)
       VALUES (?, ?, ?, ?, ?, 'active', 0, ?)`,
    )
    .bind(sessionId, payload.sub, subject, topic, level, createdAt)
    .run();

  return successResponse('Sesi belajar dimulai', {
    id: sessionId,
    user_id: payload.sub,
    subject,
    topic,
    level,
    status: 'active',
    progress: 0,
    started_at: createdAt,
  });
});

/**
 * GET /api/learning/sessions
 * Mendapatkan daftar sesi belajar user
 */
learning.get('/sessions', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const sessions = await c.env.LEARNER_DB
    .prepare(
      `SELECT * FROM learning_sessions WHERE user_id = ? ORDER BY started_at DESC LIMIT 20`,
    )
    .bind(payload.sub)
    .all();

  return successResponse('Daftar sesi belajar', sessions.results);
});

/**
 * PUT /api/learning/sessions/:sessionId/progress
 * Update progress sesi belajar
 */
learning.put('/sessions/:sessionId/progress', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const sessionId = c.req.param('sessionId');
  let body: { progress: number; status?: string };
  try {
    body = await c.req.json();
  } catch {
    return errorResponse('Format request tidak valid');
  }

  const { progress, status } = body;
  if (progress === undefined) {
    return errorResponse('progress wajib diisi', 400);
  }

  const session = await c.env.LEARNER_DB
    .prepare('SELECT id FROM learning_sessions WHERE id = ? AND user_id = ?')
    .bind(sessionId, payload.sub)
    .first();

  if (!session) return errorResponse('Sesi tidak ditemukan', 404);

  const newStatus = status ?? (progress >= 100 ? 'completed' : 'active');
  const endedAt = newStatus === 'completed' ? now() : null;

  await c.env.LEARNER_DB
    .prepare(
      `UPDATE learning_sessions SET progress = ?, status = ?, ended_at = ? WHERE id = ?`,
    )
    .bind(progress, newStatus, endedAt, sessionId)
    .run();

  if (newStatus === 'completed') {
    const xpGained = 30;
    await addXp(c.env.LEARNER_DB, payload.sub, xpGained);
  }

  return successResponse('Progress diperbarui', { progress, status: newStatus });
});

/**
 * POST /api/learning/history
 * Catat aktivitas belajar
 */
learning.post('/history', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: {
    session_id?: string;
    activity_type: string;
    content_id?: string;
    duration?: number;
    score?: number;
  };
  try {
    body = await c.req.json();
  } catch {
    return errorResponse('Format request tidak valid');
  }

  const { session_id, activity_type, content_id, duration, score } = body;
  if (!activity_type) return errorResponse('activity_type wajib diisi', 400);

  const historyId = generateId();
  const completedAt = now();

  await c.env.LEARNER_DB
    .prepare(
      `INSERT INTO learning_history (id, user_id, session_id, activity_type, content_id, duration, score, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      historyId,
      payload.sub,
      session_id ?? null,
      activity_type,
      content_id ?? null,
      duration ?? 0,
      score ?? null,
      completedAt,
    )
    .run();

  let xpGained = 0;
  if (activity_type === 'material') xpGained = 10;
  else if (activity_type === 'exercise') xpGained = 10;
  else if (activity_type === 'quiz') xpGained = score ? Math.floor(score / 10) * 5 : 20;
  else if (activity_type === 'login') xpGained = 5;

  if (xpGained > 0) {
    await addXp(c.env.LEARNER_DB, payload.sub, xpGained);
  }

  return successResponse('Aktivitas dicatat', { id: historyId, xp_gained: xpGained });
});

/**
 * GET /api/learning/stats
 * Statistik belajar user
 */
learning.get('/stats', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const xp = await c.env.LEARNER_DB
    .prepare('SELECT total_xp, level FROM user_xp WHERE user_id = ?')
    .bind(payload.sub)
    .first<{ total_xp: number; level: number }>();

  const streak = await c.env.LEARNER_DB
    .prepare('SELECT current_streak, longest_streak FROM user_streaks WHERE user_id = ?')
    .bind(payload.sub)
    .first<{ current_streak: number; longest_streak: number }>();

  const totalSessions = await c.env.LEARNER_DB
    .prepare('SELECT COUNT(*) as count FROM learning_sessions WHERE user_id = ?')
    .bind(payload.sub)
    .first<{ count: number }>();

  const completedSessions = await c.env.LEARNER_DB
    .prepare(`SELECT COUNT(*) as count FROM learning_sessions WHERE user_id = ? AND status = 'completed'`)
    .bind(payload.sub)
    .first<{ count: number }>();

  const totalDuration = await c.env.LEARNER_DB
    .prepare('SELECT SUM(duration) as total FROM learning_history WHERE user_id = ?')
    .bind(payload.sub)
    .first<{ total: number }>();

  return successResponse('Statistik belajar', {
    xp: { total_xp: xp?.total_xp ?? 0, level: xp?.level ?? 1 },
    streak: { current: streak?.current_streak ?? 0, longest: streak?.longest_streak ?? 0 },
    sessions: {
      total: totalSessions?.count ?? 0,
      completed: completedSessions?.count ?? 0,
    },
    total_duration_seconds: totalDuration?.total ?? 0,
  });
});

/**
 * Helper: tambah XP ke user
 */
async function addXp(db: D1Database, userId: string, xp: number): Promise<void> {
  const current = await db
    .prepare('SELECT total_xp FROM user_xp WHERE user_id = ?')
    .bind(userId)
    .first<{ total_xp: number }>();

  const newXp = (current?.total_xp ?? 0) + xp;
  const newLevel = calculateLevel(newXp);

  await db
    .prepare('UPDATE user_xp SET total_xp = ?, level = ?, last_updated = ? WHERE user_id = ?')
    .bind(newXp, newLevel, now(), userId)
    .run();
}

export default learning;
