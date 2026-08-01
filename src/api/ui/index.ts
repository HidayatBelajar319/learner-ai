import { Hono } from 'hono';
import { Env } from '@/types';
import { successResponse, errorResponse, generateId, now, sanitizeString } from '@/api/utils/helpers';
import { verifyToken, extractToken } from '@/lib/auth/jwt';
import { chat, PROVIDERS, ProviderName } from '@/lib/ai/providers';

const ui = new Hono<{ Bindings: Env }>();

async function requireAuth(request: Request, jwtSecret: string) {
  const token = extractToken(request);
  if (!token) return null;
  return verifyToken(token, jwtSecret);
}

interface Candidate {
  provider: ProviderName;
  apiKey: string;
  model?: string;
  baseUrl?: string;
  ai?: unknown;
}

async function getCandidates(env: Env, userId: string): Promise<Candidate[]> {
  const rows = await env.LEARNER_DB
    .prepare('SELECT provider, key_value, model, base_url FROM api_keys WHERE user_id = ? AND is_active = 1 ORDER BY updated_at DESC')
    .bind(userId)
    .all<{ provider: string; key_value: string; model: string | null; base_url: string | null }>();

  const candidates: Candidate[] = rows.results.map((k) => ({
    provider: k.provider as ProviderName,
    apiKey: k.key_value,
    model: k.model ?? undefined,
    baseUrl: k.base_url ?? undefined,
  }));

  if (env.MISTRAL_API_KEY && !candidates.some((c) => c.provider === 'mistral')) {
    candidates.push({ provider: 'mistral', apiKey: env.MISTRAL_API_KEY });
  }

  const workersCand = candidates.find((c) => c.provider === 'workersai');
  if (workersCand && env.AI) {
    workersCand.ai = env.AI;
  } else if (env.AI) {
    candidates.push({ provider: 'workersai', apiKey: '', ai: env.AI });
  }

  return candidates;
}

async function callAi(candidates: Candidate[], prompt: string, temperature = 0.6, maxTokens = 4096): Promise<{ content: string; provider: string; model: string }> {
  if (candidates.length === 0) {
    throw new Error('API key AI tidak ditemukan. Tambahkan key di Pengaturan.');
  }
  const errors: string[] = [];
  for (const cand of candidates) {
    try {
      const result = await chat(cand.provider, cand.apiKey, {
        messages: [{ role: 'user', content: prompt }],
        model: cand.model,
        temperature,
        max_tokens: maxTokens,
      }, { baseUrl: cand.baseUrl, ai: cand.ai });
      if (result.content && result.content.trim()) {
        return { content: result.content, provider: cand.provider, model: result.model };
      }
    } catch (err: any) {
      const label = PROVIDERS.find((p) => p.name === cand.provider)?.label ?? cand.provider;
      errors.push(`${label}: ${err.message ?? 'gagal'}`);
    }
  }
  throw new Error(`Semua provider AI gagal. ${errors.join(' | ')}`);
}

function extractJson(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
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

const DEFAULT_SETTINGS = {
  accent: '#4F46E5',
  sidebar_bg: '#ffffff',
  sidebar_text: '#374151',
  font: 'Inter',
  radius: 12,
};

async function getSettings(db: D1Database, userId: string): Promise<Record<string, any>> {
  const row = await db
    .prepare('SELECT settings FROM user_ui_settings WHERE user_id = ?')
    .bind(userId)
    .first<{ settings: string }>();
  try {
    return { ...DEFAULT_SETTINGS, ...(row ? JSON.parse(row.settings) : {}) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * GET /api/ui/settings
 * Ambil pengaturan UI user (warna aksen, sidebar, font).
 */
ui.get('/settings', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);
  const settings = await getSettings(c.env.LEARNER_DB, payload.sub);
  return successResponse('Pengaturan UI', settings);
});

/**
 * PUT /api/ui/settings
 * Simpan pengaturan UI user.
 * Body: { accent?, sidebar_bg?, sidebar_text?, font?, radius? }
 */
ui.put('/settings', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: Record<string, any>;
  try { body = await c.req.json(); } catch { return errorResponse('Format request tidak valid'); }

  const current = await getSettings(c.env.LEARNER_DB, payload.sub);
  const hexOk = (v: any) => typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v.trim());

  const next: Record<string, any> = { ...current };
  if (hexOk(body.accent)) next.accent = body.accent.trim();
  if (hexOk(body.sidebar_bg)) next.sidebar_bg = body.sidebar_bg.trim();
  if (typeof body.sidebar_text === 'string' && body.sidebar_text.trim()) next.sidebar_text = body.sidebar_text.trim();
  if (typeof body.font === 'string' && body.font.trim().length <= 60) next.font = body.font.trim();
  if (body.radius != null) next.radius = Math.min(Math.max(Number(body.radius) || 12, 4), 24);

  await c.env.LEARNER_DB
    .prepare('INSERT INTO user_ui_settings (user_id, settings, updated_at) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET settings = excluded.settings, updated_at = excluded.updated_at')
    .bind(payload.sub, JSON.stringify(next), now())
    .run();

  return successResponse('Pengaturan UI disimpan', next);
});

/**
 * POST /api/ui/design
 * AI UI Editor: menghasilkan usulan perubahan UI yang bisa ditinjau sebelum diterapkan.
 * Body: { prompt, current? }
 */
ui.post('/design', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { prompt?: string; current?: Record<string, any> };
  try { body = await c.req.json(); } catch { return errorResponse('Format request tidak valid'); }

  const prompt = sanitizeString(body.prompt);
  if (!prompt) return errorResponse('Prompt wajib diisi', 400);

  const current = body.current && typeof body.current === 'object' ? body.current : {};
  const pages = Array.isArray(current.pages) ? current.pages.map((p: any) => sanitizeString(p?.title)).filter(Boolean) : [];

  const system = `Kamu adalah AI UI Editor di Learner AI. Kamu membantu pengguna mengubah tampilan aplikasi web ini
(menu sidebar, warna aksen, warna sidebar, font, halaman kustom) berdasarkan permintaan pengguna.

Aturan:
- Keluarkan HANYA satu objek JSON valid tanpa teks lain, tanpa markdown, dengan format:
{"summary":"ringkasan singkat perubahan (Bahasa Indonesia)","changes":[{"key":"accent","label":"Warna aksen","value":"#4F46E5"},{"key":"sidebar_bg","label":"Warna latar sidebar","value":"#ffffff"},{"key":"sidebar_text","label":"Warna teks sidebar","value":"#374151"},{"key":"font","label":"Font aplikasi","value":"Inter"}],"new_pages":[{"title":"Judul halaman","icon":"📄","content":"isi halaman dalam Markdown (Bahasa Indonesia)"}]}

Kunci (key) yang didukung untuk changes: accent, sidebar_bg, sidebar_text, font, radius.
- Hanya sertakan key yang diminta/diubah pengguna. value harus nilai HEX (#rrggbb) untuk warna, atau nama font, atau angka px untuk radius.
- Warna aksen dan sidebar harus selaras (komplementer/analog). Pastikan kontras teks sidebar terhadap latar baik.
- Untuk "tambahkan menu baru" atau "tambahkan halaman", buat entri di new_pages (maksimal 3). Halaman kustom otomatis menjadi item menu sidebar.
- Untuk menghapus menu/halaman: kembalikan new_pages kosong dan jelaskan di summary (halaman kustom dihapus dari daftar di Pengaturan UI).
- Jika permintaan tidak berhubungan dengan UI, tetap berikan summary yang sopan dan kosongkan changes/new_pages.`;

  const fullPrompt = `${system}

Konteks UI saat ini:
${JSON.stringify({ ...DEFAULT_SETTINGS, ...current, pages }, null, 2).slice(0, 4000)}

Permintaan pengguna: "${prompt}"
Jawab dengan JSON valid sesuai format di atas.`;

  try {
    const candidates = await getCandidates(c.env, payload.sub);
    const res = await callAi(candidates, fullPrompt, 0.6, 4096);
    const parsed = extractJson(res.content);
    const obj = (parsed && typeof parsed === 'object' ? parsed : {}) as Record<string, any>;

    const changes = Array.isArray(obj.changes) ? obj.changes.slice(0, 8) : [];
    const newPages = Array.isArray(obj.new_pages) ? obj.new_pages.slice(0, 3).map((p: any, i: number) => ({
      title: sanitizeString(p?.title) || `Halaman ${i + 1}`,
      icon: String(p?.icon || '📄').slice(0, 8),
      content: String(p?.content || '').slice(0, 20000),
    })) : [];

    if (changes.length === 0 && newPages.length === 0) {
      return successResponse('AI tidak menemukan perubahan UI', {
        summary: sanitizeString(obj.summary) || 'Tidak ada perubahan yang diperlukan.',
        changes: [],
        new_pages: [],
        provider: res.provider,
        model: res.model,
      });
    }

    return successResponse('Usulan perubahan UI', {
      summary: sanitizeString(obj.summary) || 'Berikut usulan perubahan UI.',
      changes,
      new_pages: newPages,
      provider: res.provider,
      model: res.model,
    });
  } catch (err: any) {
    return errorResponse(err.message || 'Gagal membuat usulan UI', 500);
  }
});

/* ============ Halaman kustom ============ */

/**
 * GET /api/ui/pages
 * Daftar halaman kustom user (digunakan sebagai item menu sidebar).
 */
ui.get('/pages', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const rows = await c.env.LEARNER_DB
    .prepare('SELECT id, title, icon, created_at, updated_at FROM ui_custom_pages WHERE user_id = ? ORDER BY created_at ASC')
    .bind(payload.sub)
    .all();

  return successResponse('Daftar halaman kustom', rows.results);
});

/**
 * POST /api/ui/pages
 * Simpan halaman kustom baru.
 * Body: { title, icon?, content? }
 */
ui.post('/pages', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { title?: string; icon?: string; content?: string };
  try { body = await c.req.json(); } catch { return errorResponse('Format request tidak valid'); }

  const title = sanitizeString(body.title);
  if (!title) return errorResponse('Judul wajib diisi', 400);

  const id = generateId();
  const createdAt = now();

  await c.env.LEARNER_DB
    .prepare('INSERT INTO ui_custom_pages (id, user_id, title, icon, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(id, payload.sub, title, String(body.icon || '📄').slice(0, 8), String(body.content || '').slice(0, 20000), createdAt, createdAt)
    .run();

  return successResponse('Halaman kustom dibuat', { id, title });
});

/**
 * GET /api/ui/pages/:id
 * Detail halaman kustom (untuk dirender).
 */
ui.get('/pages/:id', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const row = await c.env.LEARNER_DB
    .prepare('SELECT id, title, icon, content, created_at, updated_at FROM ui_custom_pages WHERE id = ? AND user_id = ?')
    .bind(c.req.param('id'), payload.sub)
    .first<any>();

  if (!row) return errorResponse('Halaman tidak ditemukan', 404);

  return successResponse('Detail halaman kustom', row);
});

/**
 * DELETE /api/ui/pages/:id
 * Hapus halaman kustom (menu di sidebar ikut hilang).
 */
ui.delete('/pages/:id', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  await c.env.LEARNER_DB
    .prepare('DELETE FROM ui_custom_pages WHERE id = ? AND user_id = ?')
    .bind(c.req.param('id'), payload.sub)
    .run();

  return successResponse('Halaman kustom dihapus');
});

export default ui;
