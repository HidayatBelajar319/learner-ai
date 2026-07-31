import { Hono } from 'hono';
import { Env } from '@/types';
import { successResponse, errorResponse } from '@/api/utils/helpers';
import { verifyToken, extractToken } from '@/lib/auth/jwt';

const content = new Hono<{ Bindings: Env }>();

/**
 * GET /api/content/subjects
 * Mendapatkan daftar semua mata pelajaran
 */
content.get('/subjects', async (c) => {
  const baseSubjects = [
    {
      id: 'mathematics',
      name: 'Matematika',
      icon: '📐',
      description: 'Aljabar, Geometri, Kalkulus, Statistika',
      levels: ['SD', 'SMP', 'SMA'],
    },
    {
      id: 'bahasa-indonesia',
      name: 'Bahasa Indonesia',
      icon: '📝',
      description: 'Tata Bahasa, Menulis, Membaca, Sastra',
      levels: ['SD', 'SMP', 'SMA'],
    },
    {
      id: 'bahasa-inggris',
      name: 'Bahasa Inggris',
      icon: '🇬🇧',
      description: 'Grammar, Vocabulary, Reading, Speaking',
      levels: ['SD', 'SMP', 'SMA'],
    },
    {
      id: 'ipa',
      name: 'IPA',
      icon: '🔬',
      description: 'Fisika, Kimia, Biologi',
      levels: ['SD', 'SMP', 'SMA'],
    },
    {
      id: 'ips',
      name: 'IPS',
      icon: '🌍',
      description: 'Sejarah, Geografi, Ekonomi, Sosiologi',
      levels: ['SD', 'SMP', 'SMA'],
    },
    {
      id: 'pemrograman',
      name: 'Pemrograman',
      icon: '💻',
      description: 'Python, JavaScript, Java, C++, dan lainnya',
      levels: ['Pemula', 'Menengah', 'Mahir'],
    },
    {
      id: 'bahasa-asing',
      name: 'Bahasa Asing',
      icon: '🌐',
      description: 'Arab, Mandarin, Jepang, Korea, Prancis, dan lainnya',
      levels: ['Pemula', 'Menengah', 'Mahir'],
    },
    {
      id: 'keterampilan',
      name: 'Keterampilan',
      icon: '🎯',
      description: 'Bisnis, Desain, Produktivitas, dan lainnya',
      levels: ['Pemula', 'Menengah', 'Mahir'],
    },
  ];

  const rows = await c.env.LEARNER_DB
    .prepare('SELECT subject, COUNT(*) as c FROM content GROUP BY subject')
    .all<{ subject: string; c: number }>();

  const counts: Record<string, number> = {};
  rows.results.forEach((r) => {
    counts[r.subject] = r.c;
  });

  const subjects = baseSubjects.map((s) => ({
    ...s,
    topics_count: counts[s.id] ?? 0,
  }));

  return successResponse('Daftar mata pelajaran berhasil diambil', subjects);
});

/**
 * GET /api/content/subjects/:subjectId/topics
 * Mendapatkan daftar topik dari mata pelajaran tertentu
 */
content.get('/subjects/:subjectId/topics', async (c) => {
  const subjectId = c.req.param('subjectId');
  const level = c.req.query('level');

  let query = 'SELECT id, title, subject, topic, level, type, format, metadata FROM content WHERE subject = ?';
  const params: string[] = [subjectId];

  if (level) {
    query += ' AND level = ?';
    params.push(level);
  }

  query += ' ORDER BY level, title';

  const results = await c.env.LEARNER_DB
    .prepare(query)
    .bind(...params)
    .all();

  return successResponse('Daftar topik berhasil diambil', results.results);
});

/**
 * GET /api/content/:contentId
 * Mendapatkan konten detail berdasarkan ID
 */
content.get('/:contentId', async (c) => {
  const contentId = c.req.param('contentId');

  const item = await c.env.LEARNER_DB
    .prepare('SELECT * FROM content WHERE id = ?')
    .bind(contentId)
    .first();

  if (!item) {
    return errorResponse('Konten tidak ditemukan', 404);
  }

  return successResponse('Konten berhasil diambil', item);
});

/**
 * GET /api/content/search
 * Mencari konten berdasarkan keyword
 */
content.get('/search', async (c) => {
  const query = c.req.query('q');
  const subject = c.req.query('subject');
  const level = c.req.query('level');

  if (!query) {
    return errorResponse('Parameter pencarian (q) wajib diisi', 400);
  }

  const keyword = `%${query}%`;
  let sql = 'SELECT id, title, subject, topic, level, type, format, metadata FROM content WHERE (title LIKE ? OR topic LIKE ?)';
  const params: string[] = [keyword, keyword];

  if (subject) {
    sql += ' AND subject = ?';
    params.push(subject);
  }

  if (level) {
    sql += ' AND level = ?';
    params.push(level);
  }

  sql += ' LIMIT 20';

  const results = await c.env.LEARNER_DB
    .prepare(sql)
    .bind(...params)
    .all();

  return successResponse('Hasil pencarian', results.results);
});

/**
 * GET /api/content/learning/progress
 * Mendapatkan progress belajar user (butuh auth)
 */
content.get('/learning/progress', async (c) => {
  const token = extractToken(c.req.raw);
  if (!token) {
    return errorResponse('Token tidak ditemukan', 401);
  }

  const payload = await verifyToken(token, c.env.JWT_SECRET);
  if (!payload) {
    return errorResponse('Token tidak valid', 401);
  }

  const progress = await c.env.LEARNER_DB
    .prepare(
      `SELECT up.*, c.title, c.subject, c.topic, c.level
       FROM user_progress up
       JOIN content c ON c.id = up.content_id
       WHERE up.user_id = ?
       ORDER BY up.last_accessed DESC
       LIMIT 10`,
    )
    .bind(payload.sub)
    .all();

  return successResponse('Progress belajar berhasil diambil', progress.results);
});

export default content;
