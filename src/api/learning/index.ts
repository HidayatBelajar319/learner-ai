import { Hono } from 'hono';
import { Env } from '@/types';
import { successResponse, errorResponse, generateId, now, calculateLevel } from '@/api/utils/helpers';
import { verifyToken, extractToken } from '@/lib/auth/jwt';
import { awardAchievement, bumpStreak, checkXpAchievements, checkStreakAchievements } from '@/api/utils/achievements';

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

  const streak = await bumpStreak(c.env.LEARNER_DB, payload.sub);
  await checkStreakAchievements(c.env.LEARNER_DB, payload.sub, streak.current);
  await awardAchievement(c.env.LEARNER_DB, payload.sub, 'first_lesson');

  const xpRow = await c.env.LEARNER_DB
    .prepare('SELECT total_xp FROM user_xp WHERE user_id = ?')
    .bind(payload.sub)
    .first<{ total_xp: number }>();
  await checkXpAchievements(c.env.LEARNER_DB, payload.sub, xpRow?.total_xp ?? 0);

  return successResponse('Aktivitas dicatat', { id: historyId, xp_gained: xpGained });
});

/**
 * GET /api/learning/history
 * Riwayat aktivitas belajar (terbaru)
 */
learning.get('/history', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const limit = Math.min(Math.max(Number(c.req.query('limit')) || 20, 1), 100);

  const history = await c.env.LEARNER_DB
    .prepare('SELECT * FROM learning_history WHERE user_id = ? ORDER BY completed_at DESC LIMIT ?')
    .bind(payload.sub, limit)
    .all();

  return successResponse('Riwayat belajar', history.results);
});

/**
 * GET /api/learning/achievements
 * Pencapaian (badge) user
 */
learning.get('/achievements', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const achievements = await c.env.LEARNER_DB
    .prepare('SELECT * FROM achievements WHERE user_id = ? ORDER BY earned_at DESC')
    .bind(payload.sub)
    .all();

  return successResponse('Pencapaian', achievements.results);
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
 * GET /api/learning/flashcards/decks
 * Mendapatkan daftar deck flashcard user
 */
learning.get('/flashcards/decks', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const decks = await c.env.LEARNER_DB
    .prepare('SELECT * FROM flashcard_decks WHERE user_id = ? ORDER BY updated_at DESC')
    .bind(payload.sub)
    .all();

  return successResponse('Daftar deck flashcard', decks.results);
});

/**
 * POST /api/learning/flashcards/decks
 * Buat deck flashcard baru
 */
learning.post('/flashcards/decks', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { title: string; subject: string; description?: string };
  try { body = await c.req.json(); } catch { return errorResponse('Format tidak valid'); }

  const { title, subject, description } = body;
  if (!title || !subject) return errorResponse('title dan subject wajib diisi', 400);

  const deckId = generateId();
  const createdAt = now();

  await c.env.LEARNER_DB
    .prepare('INSERT INTO flashcard_decks (id, user_id, title, subject, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(deckId, payload.sub, title, subject, description ?? '', createdAt, createdAt)
    .run();

  return successResponse('Deck flashcard dibuat', { id: deckId, title, subject });
});

/**
 * GET /api/learning/flashcards/decks/:deckId
 * Mendapatkan kartu dalam deck
 */
learning.get('/flashcards/decks/:deckId', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const deck = await c.env.LEARNER_DB
    .prepare('SELECT * FROM flashcard_decks WHERE id = ? AND user_id = ?')
    .bind(c.req.param('deckId'), payload.sub)
    .first<any>();

  if (!deck) return errorResponse('Deck tidak ditemukan', 404);

  const cards = await c.env.LEARNER_DB
    .prepare('SELECT * FROM flashcards WHERE user_id = ? AND subject = ? ORDER BY created_at ASC')
    .bind(payload.sub, deck.subject)
    .all();

  return successResponse('Kartu flashcard', { deck, cards: cards.results });
});

/**
 * POST /api/learning/flashcards
 * Tambah kartu flashcard baru
 */
learning.post('/flashcards', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { front: string; back: string; subject: string; topic: string; tags?: string; difficulty?: number };
  try { body = await c.req.json(); } catch { return errorResponse('Format tidak valid'); }

  const { front, back, subject, topic, tags, difficulty } = body;
  if (!front || !back || !subject || !topic) return errorResponse('front, back, subject, topic wajib diisi', 400);

  const cardId = generateId();
  const createdAt = now();

  await c.env.LEARNER_DB
    .prepare('INSERT INTO flashcards (id, user_id, subject, topic, front, back, tags, difficulty, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(cardId, payload.sub, subject, topic, front, back, tags ?? '', difficulty ?? 1, createdAt, createdAt)
    .run();

  const cardCount = await c.env.LEARNER_DB
    .prepare('SELECT COUNT(*) as count FROM flashcards WHERE user_id = ?')
    .bind(payload.sub)
    .first<{ count: number }>();

  if ((cardCount?.count ?? 0) >= 10) {
    await awardAchievement(c.env.LEARNER_DB, payload.sub, 'flashcard_10');
  }

  return successResponse('Kartu flashcard ditambahkan', { id: cardId });
});

/**
 * DELETE /api/learning/flashcards/:id
 * Hapus kartu flashcard
 */
learning.delete('/flashcards/:id', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  await c.env.LEARNER_DB
    .prepare('DELETE FROM flashcards WHERE id = ? AND user_id = ?')
    .bind(c.req.param('id'), payload.sub)
    .run();

  return successResponse('Kartu dihapus');
});

/**
 * GET /api/learning/certificates
 * Mendapatkan sertifikat user
 */
learning.get('/certificates', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const certs = await c.env.LEARNER_DB
    .prepare('SELECT * FROM certificates WHERE user_id = ? ORDER BY issued_at DESC')
    .bind(payload.sub)
    .all();

  return successResponse('Sertifikat', certs.results);
});

/**
 * POST /api/learning/certificates/generate
 * Generate sertifikat (otomatis kalau user mencapai syarat)
 */
learning.post('/certificates/generate', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { type: string; title: string; subject?: string };
  try { body = await c.req.json(); } catch { return errorResponse('Format tidak valid'); }

  const { type, title, subject } = body;
  if (!type || !title) return errorResponse('type dan title wajib diisi', 400);

  const exists = await c.env.LEARNER_DB
    .prepare('SELECT id FROM certificates WHERE user_id = ? AND type = ? AND title = ?')
    .bind(payload.sub, type, title)
    .first();

  if (exists) return errorResponse('Sertifikat sudah ada', 409);

  const xp = await c.env.LEARNER_DB
    .prepare('SELECT total_xp, level FROM user_xp WHERE user_id = ?')
    .bind(payload.sub)
    .first<{ total_xp: number; level: number }>();

  const user = await c.env.LEARNER_DB
    .prepare('SELECT full_name FROM users WHERE id = ?')
    .bind(payload.sub)
    .first<{ full_name: string }>();

  const certId = generateId();
  const nowStr = now();
  const certData = JSON.stringify({
    id: certId,
    type,
    title,
    subject: subject ?? '',
    full_name: user?.full_name ?? 'Pengguna',
    level: xp?.level ?? 1,
    total_xp: xp?.total_xp ?? 0,
    issued_at: nowStr,
  });

  await c.env.LEARNER_DB
    .prepare('INSERT INTO certificates (id, user_id, type, title, data, issued_at) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(certId, payload.sub, type, title, certData, nowStr)
    .run();

  await awardAchievement(c.env.LEARNER_DB, payload.sub, 'first_certificate');

  return successResponse('Sertifikat dibuat', { id: certId, title, data: JSON.parse(certData) });
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
