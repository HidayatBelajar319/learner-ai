import { Hono } from 'hono';
import { Env } from '@/types';
import { successResponse, errorResponse, generateId, now, calculateLevel } from '@/api/utils/helpers';
import { verifyToken, extractToken } from '@/lib/auth/jwt';
import { chat, ProviderName, PROVIDERS } from '@/lib/ai/providers';
import { awardAchievement, bumpStreak, checkXpAchievements, checkStreakAchievements } from '@/api/utils/achievements';
import { generateSubjectTemplate } from './templates';

const evaluation = new Hono<{ Bindings: Env }>();

async function requireAuth(request: Request, jwtSecret: string) {
  const token = extractToken(request);
  if (!token) return null;
  return verifyToken(token, jwtSecret);
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

evaluation.post('/quizzes/generate', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { subject: string; topic: string; level: string; count?: number; provider?: ProviderName };
  try {
    body = await c.req.json();
  } catch {
    return errorResponse('Format request tidak valid');
  }

  const { subject, topic, level, count = 5 } = body;
  if (!subject || !topic || !level) {
    return errorResponse('subject, topic, dan level wajib diisi', 400);
  }

  const quizId = generateId();

  let questions: Question[] | null = null;
  let source: 'ai' | 'template' = 'template';

  const aiErrors: string[] = [];

  const userKeys = await c.env.LEARNER_DB
    .prepare('SELECT provider, key_value, model, base_url FROM api_keys WHERE user_id = ? AND is_active = 1 ORDER BY updated_at DESC')
    .bind(payload.sub)
    .all<{ provider: string; key_value: string; model: string | null; base_url: string | null }>();

  const candidates: Array<{ provider: ProviderName; apiKey: string; model?: string; baseUrl?: string; ai?: unknown }> = [];

  for (const k of userKeys.results) {
    candidates.push({ provider: k.provider as ProviderName, apiKey: k.key_value, model: k.model ?? undefined, baseUrl: k.base_url ?? undefined });
  }

  const envKey = c.env.MISTRAL_API_KEY;
  if (envKey) candidates.push({ provider: 'mistral', apiKey: envKey });

  const workersCand = candidates.find(c => c.provider === 'workersai');
  if (workersCand && c.env.AI) {
    workersCand.ai = c.env.AI;
  } else if (c.env.AI) {
    candidates.push({ provider: 'workersai', apiKey: '', ai: c.env.AI });
  }

  for (const cand of candidates) {
    try {
      const qs = await generateQuestionsWithProvider(cand, subject, topic, level, count);
      if (qs && qs.length > 0) {
        questions = qs;
        source = 'ai';
        break;
      }
    } catch (err: any) {
      const label = PROVIDERS.find(p => p.name === cand.provider)?.label ?? cand.provider;
      aiErrors.push(`${label}: ${err.message ?? 'gagal'}`);
    }
  }

  if (!questions || questions.length === 0) {
    questions = generateSubjectTemplate(subject, topic, count);
  }

  await c.env.LEARNER_DB
    .prepare('INSERT INTO quizzes (id, title, subject, topic, level, questions, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(quizId, `Quiz ${topic}`, subject, topic, level, JSON.stringify(questions), now(), now())
    .run();

  return successResponse('Quiz berhasil dibuat', {
    id: quizId,
    subject,
    topic,
    level,
    source,
    ai_errors: aiErrors.length > 0 ? aiErrors : undefined,
    questions,
  });
});

evaluation.get('/quizzes/:id', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const quiz = await c.env.LEARNER_DB
    .prepare('SELECT * FROM quizzes WHERE id = ?')
    .bind(c.req.param('id'))
    .first<any>();

  if (!quiz) return errorResponse('Quiz tidak ditemukan', 404);

  return successResponse('Data quiz', {
    id: quiz.id,
    title: quiz.title,
    subject: quiz.subject,
    topic: quiz.topic,
    level: quiz.level,
    questions: JSON.parse(quiz.questions),
  });
});

evaluation.post('/quizzes/:id/submit', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { answers: number[] };
  try {
    body = await c.req.json();
  } catch {
    return errorResponse('Format request tidak valid');
  }

  const quiz = await c.env.LEARNER_DB
    .prepare('SELECT * FROM quizzes WHERE id = ?')
    .bind(c.req.param('id'))
    .first<any>();

  if (!quiz) return errorResponse('Quiz tidak ditemukan', 404);

  const attempted = await c.env.LEARNER_DB
    .prepare("SELECT id FROM learning_history WHERE user_id = ? AND content_id = ? AND activity_type = 'quiz'")
    .bind(payload.sub, quiz.id)
    .first();

  if (attempted) return errorResponse('Quiz sudah pernah dikerjakan', 409);

  const questions = JSON.parse(quiz.questions);
  const { answers } = body;

  if (!answers || !Array.isArray(answers)) {
    return errorResponse('answers wajib diisi (array)', 400);
  }

  let correct = 0;
  const results = questions.map((q: any, i: number) => {
    const userAnswer = answers[i];
    const isCorrect = userAnswer === q.correct;
    if (isCorrect) correct++;
    return {
      question_id: i,
      question: q.question,
      correct: q.correct,
      correct_answer: q.options[q.correct],
      explanation: q.explanation ?? null,
      user_answer: userAnswer,
      is_correct: isCorrect,
    };
  });

  const total = questions.length;
  const score = Math.round((correct / total) * 100);

  const historyId = generateId();
  await c.env.LEARNER_DB
    .prepare('INSERT INTO learning_history (id, user_id, activity_type, content_id, score, duration, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(historyId, payload.sub, 'quiz', quiz.id, score, 0, now())
    .run();

  const xpGained = score >= 80 ? 50 : score >= 50 ? 30 : 10;

  const currentXp = await c.env.LEARNER_DB
    .prepare('SELECT total_xp FROM user_xp WHERE user_id = ?')
    .bind(payload.sub)
    .first<{ total_xp: number }>();

  const newXp = (currentXp?.total_xp ?? 0) + xpGained;
  const newLevel = calculateLevel(newXp);

  await c.env.LEARNER_DB
    .prepare('UPDATE user_xp SET total_xp = ?, level = ?, last_updated = ? WHERE user_id = ?')
    .bind(newXp, newLevel, now(), payload.sub)
    .run();

  const streak = await bumpStreak(c.env.LEARNER_DB, payload.sub);
  await checkStreakAchievements(c.env.LEARNER_DB, payload.sub, streak.current);
  await checkXpAchievements(c.env.LEARNER_DB, payload.sub, newXp);

  await awardAchievement(c.env.LEARNER_DB, payload.sub, 'first_quiz');

  const quizCount = await c.env.LEARNER_DB
    .prepare("SELECT COUNT(*) as count FROM learning_history WHERE user_id = ? AND activity_type = 'quiz'")
    .bind(payload.sub)
    .first<{ count: number }>();

  if ((quizCount?.count ?? 0) >= 10) {
    await awardAchievement(c.env.LEARNER_DB, payload.sub, 'quiz_10');
  }

  return successResponse('Quiz selesai', {
    score,
    correct,
    total,
    xp_gained: xpGained,
    results,
  });
});

interface ProviderCandidate {
  provider: ProviderName;
  apiKey: string;
  model?: string;
  baseUrl?: string;
  ai?: unknown;
}

async function generateQuestionsWithProvider(
  cand: ProviderCandidate,
  subject: string,
  topic: string,
  level: string,
  count: number,
): Promise<Question[] | null> {
  const apiKey = cand.apiKey;
  if (!apiKey && !cand.baseUrl && !cand.ai) return null;

  const prompt = `Buatkan ${count} soal pilihan ganda tentang "${topic}" (mata pelajaran ${subject}) untuk level ${level}.

PERSYARATAN:
- Setiap soal harus punya 4 pilihan jawaban (A, B, C, D), hanya 1 benar
- Soal harus asli, spesifik, dan sesuai kurikulum ${level}
- Soal harus SESUAI mata pelajaran ${subject}: jangan campur dengan pelajaran lain
- Variasikan: definisi, contoh soal hitung (jika relevan), analisis singkat, penerapan konsep
- Tingkat kesulitan sesuai level ${level}
- Sertakan penjelasan singkat jawaban benar

Keluarkan HANYA JSON array, tanpa teks lain, format:
[{"question":"...", "options":["A","B","C","D"], "correct":0, "explanation":"..."}]
correct adalah index jawaban benar (0-3).`;

  const result = await chat(cand.provider, apiKey, {
    messages: [{ role: 'user', content: prompt }],
    model: cand.model,
    temperature: 0.8,
    max_tokens: 4096,
  }, { baseUrl: cand.baseUrl, ai: cand.ai });

  const json = extractJson(result.content);
  if (!json || !Array.isArray(json)) return null;

  return json
    .slice(0, count)
    .map((q: any, i: number) => ({
      id: i,
      question: String(q.question || '').trim(),
      options: Array.isArray(q.options) && q.options.length === 4 ? q.options.map(String) : ['A', 'B', 'C', 'D'],
      correct: Number(q.correct) >= 0 && Number(q.correct) < 4 ? Number(q.correct) : 0,
      explanation: String(q.explanation || '').trim() || undefined,
    }))
    .filter((q: Question) => q.question.length > 0);
}

function extractJson(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

/* ============================================================
 * CUSTOM QUIZ (quiz buatan pengguna)
 * Tipe soal: multiple_choice, true_false, checkbox, fill_blank,
 *            short_answer, matching, essay
 * ============================================================ */

const QUIZ_QUESTION_TYPES = ['multiple_choice', 'true_false', 'checkbox', 'fill_blank', 'short_answer', 'matching', 'essay'] as const;
const MAX_QUIZ_QUESTIONS = 50;

function validateQuizQuestions(questions: unknown): { valid: boolean; error?: string } {
  if (!Array.isArray(questions) || questions.length === 0) {
    return { valid: false, error: 'questions wajib berisi minimal 1 soal' };
  }
  if (questions.length > MAX_QUIZ_QUESTIONS) {
    return { valid: false, error: `Maksimal ${MAX_QUIZ_QUESTIONS} soal per quiz` };
  }
  for (const q of questions) {
    const obj = q as Record<string, any>;
    if (!obj || !obj.prompt || !String(obj.prompt).trim()) {
      return { valid: false, error: 'Setiap soal wajib memiliki prompt' };
    }
    if (!QUIZ_QUESTION_TYPES.includes(obj.type)) {
      return { valid: false, error: `Tipe soal '${obj.type}' tidak didukung` };
    }
  }
  return { valid: true };
}

/**
 * POST /api/evaluation/custom-quizzes
 * Simpan custom quiz baru
 */
evaluation.post('/custom-quizzes', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { title?: string; subject?: string; description?: string; questions?: unknown; timer_minutes?: number };
  try { body = await c.req.json(); } catch { return errorResponse('Format request tidak valid'); }

  const title = String(body.title ?? '').trim();
  if (!title) return errorResponse('title wajib diisi', 400);

  const check = validateQuizQuestions(body.questions);
  if (!check.valid) return errorResponse(check.error ?? 'questions tidak valid', 400);

  const id = generateId();
  const createdAt = now();

  await c.env.LEARNER_DB
    .prepare('INSERT INTO custom_quizzes (id, user_id, title, subject, description, questions, timer_minutes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, payload.sub, title, String(body.subject ?? '').trim(), String(body.description ?? '').trim(), JSON.stringify(body.questions), Math.max(0, Math.min(Number(body.timer_minutes) || 0, 180)), createdAt, createdAt)
    .run();

  return successResponse('Quiz berhasil dibuat', { id });
});

/**
 * GET /api/evaluation/custom-quizzes
 * Daftar custom quiz milik user (tanpa jawaban, kecuali owner)
 */
evaluation.get('/custom-quizzes', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const q = (c.req.query('q') ?? '').trim();
  const subject = (c.req.query('subject') ?? '').trim();

  let sql = 'SELECT id, title, subject, description, timer_minutes, created_at, updated_at FROM custom_quizzes WHERE user_id = ?';
  const params: string[] = [payload.sub];
  if (subject) {
    sql += ' AND subject = ?';
    params.push(subject);
  }
  if (q) {
    sql += ' AND title LIKE ?';
    params.push(`%${q}%`);
  }
  sql += ' ORDER BY updated_at DESC';

  const rows = await c.env.LEARNER_DB.prepare(sql).bind(...params).all();
  return successResponse('Daftar custom quiz', rows.results);
});

/**
 * GET /api/evaluation/custom-quizzes/:id
 * Detail custom quiz (jawaban hanya untuk pemilik)
 */
evaluation.get('/custom-quizzes/:id', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const row = await c.env.LEARNER_DB
    .prepare('SELECT * FROM custom_quizzes WHERE id = ? AND user_id = ?')
    .bind(c.req.param('id'), payload.sub)
    .first<any>();

  if (!row) return errorResponse('Quiz tidak ditemukan', 404);

  return successResponse('Detail custom quiz', {
    id: row.id,
    title: row.title,
    subject: row.subject,
    description: row.description,
    questions: JSON.parse(row.questions),
    timer_minutes: row.timer_minutes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  });
});

/**
 * PUT /api/evaluation/custom-quizzes/:id
 * Update custom quiz
 */
evaluation.put('/custom-quizzes/:id', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { title?: string; subject?: string; description?: string; questions?: unknown; timer_minutes?: number };
  try { body = await c.req.json(); } catch { return errorResponse('Format request tidak valid'); }

  const existing = await c.env.LEARNER_DB
    .prepare('SELECT id FROM custom_quizzes WHERE id = ? AND user_id = ?')
    .bind(c.req.param('id'), payload.sub)
    .first<any>();
  if (!existing) return errorResponse('Quiz tidak ditemukan', 404);

  const title = body.title !== undefined ? String(body.title).trim() : undefined;
  if (title === '') return errorResponse('title tidak boleh kosong', 400);
  if (body.questions !== undefined) {
    const check = validateQuizQuestions(body.questions);
    if (!check.valid) return errorResponse(check.error ?? 'questions tidak valid', 400);
  }

  const current = await c.env.LEARNER_DB
    .prepare('SELECT * FROM custom_quizzes WHERE id = ? AND user_id = ?')
    .bind(c.req.param('id'), payload.sub)
    .first<any>();

  const nextTitle = title ?? current.title;
  const nextSubject = body.subject !== undefined ? String(body.subject).trim() : current.subject;
  const nextDesc = body.description !== undefined ? String(body.description).trim() : current.description;
  const nextQuestions = body.questions !== undefined ? JSON.stringify(body.questions) : current.questions;
  const nextTimer = body.timer_minutes !== undefined ? Math.max(0, Math.min(Number(body.timer_minutes) || 0, 180)) : current.timer_minutes;

  await c.env.LEARNER_DB
    .prepare('UPDATE custom_quizzes SET title = ?, subject = ?, description = ?, questions = ?, timer_minutes = ?, updated_at = ? WHERE id = ? AND user_id = ?')
    .bind(nextTitle, nextSubject, nextDesc, nextQuestions, nextTimer, now(), existing.id, payload.sub)
    .run();

  return successResponse('Quiz diperbarui');
});

/**
 * DELETE /api/evaluation/custom-quizzes/:id
 * Hapus custom quiz
 */
evaluation.delete('/custom-quizzes/:id', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  await c.env.LEARNER_DB
    .prepare('DELETE FROM custom_quizzes WHERE id = ? AND user_id = ?')
    .bind(c.req.param('id'), payload.sub)
    .run();

  return successResponse('Quiz dihapus');
});

/**
 * POST /api/evaluation/custom-quizzes/:id/submit
 * Kerjakan custom quiz dan hitung skor otomatis.
 * Body: { answers: Array<{ question_index: number; value: any }> }
 */
evaluation.post('/custom-quizzes/:id/submit', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { answers?: Array<{ question_index: number; value: any }> };
  try { body = await c.req.json(); } catch { return errorResponse('Format request tidak valid'); }

  const row = await c.env.LEARNER_DB
    .prepare('SELECT * FROM custom_quizzes WHERE id = ? AND user_id = ?')
    .bind(c.req.param('id'), payload.sub)
    .first<any>();

  if (!row) return errorResponse('Quiz tidak ditemukan', 404);

  const questions = JSON.parse(row.questions);
  const answers = Array.isArray(body.answers) ? body.answers : [];

  const answerMap: Record<number, any> = {};
  for (const a of answers) {
    answerMap[a.question_index] = a.value;
  }

  let earned = 0;
  let total = 0;
  const results = questions.map((q: any, i: number) => {
    const points = Math.max(1, Number(q.points) || 1);
    total += points;
    const userValue = answerMap[i];
    let isCorrect = false;
    let correctValue: any = null;

    switch (q.type) {
      case 'multiple_choice': {
        correctValue = q.correct ?? -1;
        isCorrect = userValue === q.correct;
        break;
      }
      case 'true_false': {
        correctValue = q.correct;
        isCorrect = String(userValue) === String(q.correct);
        break;
      }
      case 'checkbox': {
        correctValue = Array.isArray(q.correct) ? q.correct : [];
        const u = Array.isArray(userValue) ? userValue.map(Number).sort() : [];
        const c = correctValue.map(Number).sort();
        isCorrect = u.length === c.length && u.every((v: number, idx: number) => v === c[idx]);
        break;
      }
      case 'fill_blank':
      case 'short_answer': {
        correctValue = Array.isArray(q.answers) ? q.answers : [String(q.answers ?? '')];
        const norm = (s: string) => String(s ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
        isCorrect = correctValue.some((a: string) => norm(a) === norm(userValue));
        break;
      }
      case 'matching': {
        correctValue = q.pairs && Array.isArray(q.pairs) ? q.pairs : [];
        const u = userValue && typeof userValue === 'object' ? userValue : {};
        if (Array.isArray(q.pairs) && q.pairs.length > 0) {
          isCorrect = q.pairs.every((p: any, idx: number) => String(u[idx]) === String(p.rightIndex ?? p.right));
        }
        break;
      }
      case 'essay': {
        // Essay dinilai manual oleh guru/pembuat; otomatis dianggap dikerjakan bila ada isi
        correctValue = null;
        isCorrect = String(userValue ?? '').trim().length > 0;
        break;
      }
      default: {
        isCorrect = false;
      }
    }

    if (isCorrect) earned += points;

    return {
      question_index: i,
      type: q.type,
      prompt: q.prompt,
      is_correct: isCorrect,
      user_answer: userValue,
      correct_answer: correctValue,
      explanation: q.explanation ?? null,
      points,
    };
  });

  const score = Math.round((earned / total) * 100);
  const xpGained = score >= 80 ? 50 : score >= 50 ? 30 : 10;

  // Catat ke riwayat + XP
  const currentXp = await c.env.LEARNER_DB
    .prepare('SELECT total_xp FROM user_xp WHERE user_id = ?')
    .bind(payload.sub)
    .first<{ total_xp: number }>();
  const newXp = (currentXp?.total_xp ?? 0) + xpGained;
  const newLevel = calculateLevel(newXp);

  await c.env.LEARNER_DB
    .prepare('UPDATE user_xp SET total_xp = ?, level = ?, last_updated = ? WHERE user_id = ?')
    .bind(newXp, newLevel, now(), payload.sub)
    .run();

  await c.env.LEARNER_DB
    .prepare('INSERT INTO learning_history (id, user_id, activity_type, content_id, score, duration, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(generateId(), payload.sub, 'quiz', `cq_${row.id}`, score, 0, now())
    .run();

  const streak = await bumpStreak(c.env.LEARNER_DB, payload.sub);
  await checkStreakAchievements(c.env.LEARNER_DB, payload.sub, streak.current);
  await checkXpAchievements(c.env.LEARNER_DB, payload.sub, newXp);
  await awardAchievement(c.env.LEARNER_DB, payload.sub, 'first_quiz');

  return successResponse('Quiz selesai', {
    score,
    earned,
    total,
    xp_gained: xpGained,
    results,
  });
});

export default evaluation;
