import { Hono } from 'hono';
import { Env } from '@/types';
import { successResponse, errorResponse, generateId, now, sanitizeString } from '@/api/utils/helpers';
import { verifyToken, extractToken } from '@/lib/auth/jwt';
import { chat, PROVIDERS, ProviderName } from '@/lib/ai/providers';

const creatives = new Hono<{ Bindings: Env }>();

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

/**
 * Mendapatkan kandidat provider AI untuk user (BYOK dulu, lalu MISTRAL env, lalu Workers AI)
 */
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

async function callAi(candidates: Candidate[], prompt: string, temperature = 0.7, maxTokens = 4096): Promise<{ content: string; provider: string; model: string }> {
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

const MAX_ELEMENTS = 80;

const DESIGN_TEMPLATE = `Kamu adalah AI designer di Learner AI. Buat desain dari deskripsi pengguna.
Keluarkan HANYA JSON valid tanpa teks lain, tanpa markdown, dengan format:
{"title":"judul desain","width":1200,"height":800,"background":"#ffffff","elements":[{...}]}

Format elemen (semua wajib memiliki id unik berupa string):
1. Text: {"id":"t1","type":"text","text":"...","x":80,"y":90,"width":400,"height":60,"fontSize":32,"fontFamily":"Arial","color":"#111827","bold":false,"italic":false,"align":"center","rotation":0}
2. Shape: {"id":"s1","type":"shape","shape":"rect|circle|line|triangle|rounded","x":...,"y":...,"width":...,"height":...,"color":"#4F46E5","fill":true,"borderRadius":8}
3. Sticker: {"id":"st1","type":"sticker","emoji":"🎉","x":...,"y":...,"fontSize":64}
4. Icon: {"id":"i1","type":"icon","icon":"⭐","x":...,"y":...,"fontSize":48,"color":"#F59E0B"}
5. Image: {"id":"img1","type":"image","src":"data-url-atau-url","x":...,"y":...,"width":...,"height":...,"borderRadius":0}
6. QR: {"id":"q1","type":"qr","value":"https://learner.hidayat3911.workers.dev","x":...,"y":...,"size":120,"color":"#000000"}
7. Barcode: {"id":"b1","type":"barcode","value":"LEARNER-AI-2026","x":...,"y":...,"width":300,"height":80}
8. Table: {"id":"tab1","type":"table","rows":3,"cols":2,"headers":["Kolom 1","Kolom 2"],"cells":[["a","b"],["c","d"]],"x":...,"y":...,"width":400,"height":150,"color":"#374151"}
9. Chart: {"id":"c1","type":"chart","chart":"bar|line|pie","labels":["A","B","C"],"data":[10,25,15],"x":...,"y":...,"width":320,"height":220,"color":"#4F46E5"}

PERSYARATAN:
- Desain harus utuh, lengkap, dan profesional sesuai permintaan pengguna.
- Gunakan koordinat (x,y) piksel dalam kanvas width×height (default 1200×800).
- Judul besar, teks pendukung, dan elemen dekoratif yang relevan.
- Maksimal ${MAX_ELEMENTS} elemen.
- Semua teks berbahasa Indonesia kecuali diminta lain.
- Untuk sertifikat: tambahkan elemen teks "Sertifikat" besar di atas, nama penerima, dan garis tanda tangan.`;

/**
 * POST /api/creatives/designs/generate
 * Buat desain dari prompt menggunakan AI
 * Body: { prompt, width?, height?, category? }
 */
creatives.post('/designs/generate', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { prompt?: string; width?: number; height?: number; category?: string };
  try { body = await c.req.json(); } catch { return errorResponse('Format request tidak valid'); }

  const prompt = sanitizeString(body.prompt);
  if (!prompt) return errorResponse('Prompt wajib diisi', 400);

  const category = sanitizeString(body.category) || 'design';
  const width = Math.min(Math.max(Number(body.width) || 1200, 400), 2400);
  const height = Math.min(Math.max(Number(body.height) || 800, 300), 1600);

  const fullPrompt = `${DESIGN_TEMPLATE}

Deskripsi pengguna: "${prompt}"
Kategori desain: ${category}
Ukuran kanvas: ${width}x${height} piksel (gunakan nilai ini untuk width/height pada JSON).`;

  try {
    const candidates = await getCandidates(c.env, payload.sub);
    const res = await callAi(candidates, fullPrompt, 0.8, 8192);
    const parsed = extractJson(res.content);
    const obj = (parsed && typeof parsed === 'object' ? parsed : {}) as Record<string, any>;

    const elements = Array.isArray(obj.elements) ? obj.elements.slice(0, MAX_ELEMENTS) : [];
    if (elements.length === 0) return errorResponse('AI tidak menghasilkan desain yang valid. Coba lagi.', 422);

    return successResponse('Desain berhasil dibuat', {
      title: sanitizeString(obj.title) || prompt.slice(0, 60),
      width: Number(obj.width) || width,
      height: Number(obj.height) || height,
      background: typeof obj.background === 'string' ? obj.background : '#ffffff',
      elements,
      provider: res.provider,
      model: res.model,
    });
  } catch (err: any) {
    return errorResponse(err.message || 'Gagal membuat desain', 500);
  }
});

/**
 * POST /api/creatives/designs/remix
 * Edit / ubah desain berdasarkan prompt (AI)
 * Body: { prompt, design, width, height }
 */
creatives.post('/designs/remix', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { prompt?: string; design?: any; width?: number; height?: number };
  try { body = await c.req.json(); } catch { return errorResponse('Format request tidak valid'); }

  const prompt = sanitizeString(body.prompt);
  if (!prompt) return errorResponse('Prompt wajib diisi', 400);

  const current = body.design && typeof body.design === 'object' ? body.design : {};
  const width = Math.min(Math.max(Number(body.width) || 1200, 400), 2400);
  const height = Math.min(Math.max(Number(body.height) || 800, 300), 1600);

  const fullPrompt = `${DESIGN_TEMPLATE}

Desain saat ini (JSON): ${JSON.stringify(current).slice(0, 6000)}

Perintah perubahan: "${prompt}"
Ukuran kanvas: ${width}x${height} piksel.
Keluarkan JSON desain TERBARU (bisa berupa hasil edit dari desain saat ini) dengan format yang sama seperti template.`;

  try {
    const candidates = await getCandidates(c.env, payload.sub);
    const res = await callAi(candidates, fullPrompt, 0.7, 8192);
    const parsed = extractJson(res.content);
    const obj = (parsed && typeof parsed === 'object' ? parsed : {}) as Record<string, any>;

    const elements = Array.isArray(obj.elements) ? obj.elements.slice(0, MAX_ELEMENTS) : [];
    if (elements.length === 0) return errorResponse('AI tidak menghasilkan desain yang valid. Coba lagi.', 422);

    return successResponse('Desain diperbarui', {
      title: sanitizeString(obj.title) || 'Tanpa judul',
      width: Number(obj.width) || width,
      height: Number(obj.height) || height,
      background: typeof obj.background === 'string' ? obj.background : '#ffffff',
      elements,
      provider: res.provider,
      model: res.model,
    });
  } catch (err: any) {
    return errorResponse(err.message || 'Gagal mengedit desain', 500);
  }
});

/**
 * GET /api/creatives/designs
 * Daftar desain user (search q, filter category)
 */
creatives.get('/designs', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const q = sanitizeString(c.req.query('q'));
  const category = sanitizeString(c.req.query('category'));

  let sql = 'SELECT id, title, category, type, width, height, created_at, updated_at FROM creative_designs WHERE user_id = ?';
  const params: string[] = [payload.sub];
  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  if (q) {
    sql += ' AND title LIKE ?';
    params.push(`%${q}%`);
  }
  sql += ' ORDER BY updated_at DESC';

  const rows = await c.env.LEARNER_DB.prepare(sql).bind(...params).all();
  return successResponse('Daftar desain', rows.results);
});

/**
 * GET /api/creatives/designs/:id
 * Detail desain
 */
creatives.get('/designs/:id', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const row = await c.env.LEARNER_DB
    .prepare('SELECT * FROM creative_designs WHERE id = ? AND user_id = ?')
    .bind(c.req.param('id'), payload.sub)
    .first<any>();

  if (!row) return errorResponse('Desain tidak ditemukan', 404);

  return successResponse('Detail desain', {
    id: row.id,
    title: row.title,
    category: row.category,
    type: row.type,
    width: row.width,
    height: row.height,
    design: JSON.parse(row.design),
    created_at: row.created_at,
    updated_at: row.updated_at,
  });
});

/**
 * POST /api/creatives/designs
 * Simpan desain baru
 */
creatives.post('/designs', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { title?: string; category?: string; type?: string; design?: any; width?: number; height?: number };
  try { body = await c.req.json(); } catch { return errorResponse('Format request tidak valid'); }

  const title = sanitizeString(body.title);
  const design = body.design;
  if (!title || !design || typeof design !== 'object') return errorResponse('title dan design wajib diisi', 400);

  const id = generateId();
  const createdAt = now();
  const width = Math.min(Math.max(Number(body.width) || 1200, 400), 2400);
  const height = Math.min(Math.max(Number(body.height) || 800, 300), 1600);

  await c.env.LEARNER_DB
    .prepare('INSERT INTO creative_designs (id, user_id, title, category, type, design, width, height, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, payload.sub, title, sanitizeString(body.category) || 'design', sanitizeString(body.type) || 'design', JSON.stringify(design), width, height, createdAt, createdAt)
    .run();

  return successResponse('Desain disimpan', { id });
});

/**
 * PUT /api/creatives/designs/:id
 * Update desain
 */
creatives.put('/designs/:id', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { title?: string; category?: string; type?: string; design?: any; width?: number; height?: number };
  try { body = await c.req.json(); } catch { return errorResponse('Format request tidak valid'); }

  const existing = await c.env.LEARNER_DB
    .prepare('SELECT * FROM creative_designs WHERE id = ? AND user_id = ?')
    .bind(c.req.param('id'), payload.sub)
    .first<any>();
  if (!existing) return errorResponse('Desain tidak ditemukan', 404);

  const title = sanitizeString(body.title) || existing.title;
  const design = body.design ?? JSON.parse(existing.design);
  const width = Number(body.width) || existing.width;
  const height = Number(body.height) || existing.height;

  await c.env.LEARNER_DB
    .prepare('UPDATE creative_designs SET title = ?, category = ?, type = ?, design = ?, width = ?, height = ?, updated_at = ? WHERE id = ? AND user_id = ?')
    .bind(title, sanitizeString(body.category) || existing.category, sanitizeString(body.type) || existing.type, JSON.stringify(design), width, height, now(), existing.id, payload.sub)
    .run();

  return successResponse('Desain diperbarui', { id: existing.id });
});

/**
 * DELETE /api/creatives/designs/:id
 * Hapus desain
 */
creatives.delete('/designs/:id', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  await c.env.LEARNER_DB
    .prepare('DELETE FROM creative_designs WHERE id = ? AND user_id = ?')
    .bind(c.req.param('id'), payload.sub)
    .run();

  return successResponse('Desain dihapus');
});

/**
 * POST /api/creatives/assets
 * Upload asset (data URL base64). Body: { kind, name, data }
 * kind: logo | image | svg | background | font | audio | video
 */
creatives.post('/assets', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { kind?: string; name?: string; data?: string };
  try { body = await c.req.json(); } catch { return errorResponse('Format request tidak valid'); }

  const kind = sanitizeString(body.kind) || 'image';
  const name = sanitizeString(body.name) || 'asset';
  const data = String(body.data ?? '').trim();

  const allowedKinds = ['logo', 'image', 'svg', 'background', 'font', 'audio', 'video'];
  if (!allowedKinds.includes(kind)) return errorResponse('kind tidak didukung', 400);

  if (!/^data:/.test(data)) return errorResponse('data harus berupa data URL (data:...)', 400);

  const size = new Blob([data]).size;
  if (size > 5 * 1024 * 1024) return errorResponse('Ukuran file maksimal 5 MB', 400);

  const id = generateId();
  await c.env.LEARNER_DB
    .prepare('INSERT INTO creative_assets (id, user_id, kind, name, data, size, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(id, payload.sub, kind, name, data, size, now())
    .run();

  return successResponse('Asset diunggah', { id, kind, name, size });
});

/**
 * GET /api/creatives/assets
 * Daftar asset user (filter kind)
 */
creatives.get('/assets', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const kind = sanitizeString(c.req.query('kind'));

  let sql = 'SELECT id, kind, name, size, created_at FROM creative_assets WHERE user_id = ?';
  const params: string[] = [payload.sub];
  if (kind) {
    sql += ' AND kind = ?';
    params.push(kind);
  }
  sql += ' ORDER BY created_at DESC';

  const rows = await c.env.LEARNER_DB.prepare(sql).bind(...params).all();
  return successResponse('Daftar asset', rows.results);
});

/**
 * GET /api/creatives/assets/:id/data
 * Ambil data asset (untuk dipakai di canvas)
 */
creatives.get('/assets/:id/data', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const row = await c.env.LEARNER_DB
    .prepare('SELECT data, kind, name FROM creative_assets WHERE id = ? AND user_id = ?')
    .bind(c.req.param('id'), payload.sub)
    .first<any>();

  if (!row) return errorResponse('Asset tidak ditemukan', 404);

  return successResponse('Data asset', { id: c.req.param('id'), kind: row.kind, name: row.name, data: row.data });
});

/**
 * DELETE /api/creatives/assets/:id
 * Hapus asset
 */
creatives.delete('/assets/:id', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  await c.env.LEARNER_DB
    .prepare('DELETE FROM creative_assets WHERE id = ? AND user_id = ?')
    .bind(c.req.param('id'), payload.sub)
    .run();

  return successResponse('Asset dihapus');
});

/**
 * POST /api/creatives/chat
 * Chat AI untuk desain (bisa menghasilkan tindakan desain).
 * Body: { messages, design?, mode?: 'creatives' | 'chatting', uiContext? }
 * - mode 'creatives' (default): chat khusus desain.
 * - mode 'chatting': chat umum + AI UI Editor (menghasilkan blok ```ui-patch``` bila diminta).
 */
creatives.post('/chat', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { messages?: Array<{ role: string; content: string }>; design?: any; mode?: string; uiContext?: any };
  try { body = await c.req.json(); } catch { return errorResponse('Format request tidak valid'); }

  const messages = body.messages;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return errorResponse('messages wajib diisi', 400);
  }

  const mode = body.mode === 'chatting' ? 'chatting' : 'creatives';

  const designContext = body.design && typeof body.design === 'object'
    ? `Desain saat ini: ${JSON.stringify(body.design).slice(0, 4000)}`
    : 'Belum ada desain.';

  const system = mode === 'chatting'
    ? `Kamu adalah asisten AI cerdas di Learner AI. Bantu pengguna belajar, membuat desain, maupun mengubah tampilan aplikasi.
Kamu juga berperan sebagai AI UI Editor: jika pengguna meminta mengubah UI aplikasi (warna aksen, warna sidebar, font, menambahkan halaman/menu, dll),
jawab dengan teks ramah lalu lampirkan blok JSON di akhir jawaban dengan format:
\`\`\`ui-patch
{"summary":"ringkasan singkat","changes":[{"key":"accent","label":"Warna aksen","value":"#4F46E5"},{"key":"sidebar_bg","label":"Warna latar sidebar","value":"#ffffff"},{"key":"sidebar_text","label":"Warna teks sidebar","value":"#374151"},{"key":"font","label":"Font aplikasi","value":"Inter"}],"new_pages":[{"title":"Judul halaman","icon":"📄","content":"isi dalam Markdown Bahasa Indonesia"}]}
\`\`\`
Kunci yang didukung: accent, sidebar_bg, sidebar_text, font, radius. Warna dalam HEX (#rrggbb).
Jika tidak ada permintaan perubahan UI, jangan sertakan blok ui-patch.
${designContext}
Balas dalam bahasa Indonesia yang ramah dan singkat.`
    : `Kamu adalah asisten AI desainer di Learner AI (konsep seperti Canva, implementasi orisinal).
Bantu pengguna membuat atau mengedit desain. Kamu bisa menjawab pertanyaan desain, memberi saran warna/font/layout,
atau menyarankan elemen. Jika diminta menghasilkan desain, minta pengguna membuka tab "AI Design" dan memberi prompt,
atau berikan deskripsi desain yang bisa dipakai di sana.
${designContext}
Balas dalam bahasa Indonesia yang ramah dan singkat.`;

  try {
    const candidates = await getCandidates(c.env, payload.sub);
    const fullMessages = [{ role: 'system', content: system }, ...messages.map((m) => ({ role: (m.role === 'assistant' || m.role === 'user' ? m.role : 'user'), content: m.content }))];
    const errors: string[] = [];
    for (const cand of candidates) {
      try {
        const result = await chat(cand.provider, cand.apiKey, {
          messages: fullMessages as any,
          model: cand.model,
          temperature: 0.7,
          max_tokens: 2048,
        }, { baseUrl: cand.baseUrl, ai: cand.ai });
        return successResponse('Respon AI', {
          content: result.content,
          provider: cand.provider,
          model: result.model,
        });
      } catch (err: any) {
        const label = PROVIDERS.find((p) => p.name === cand.provider)?.label ?? cand.provider;
        errors.push(`${label}: ${err.message ?? 'gagal'}`);
      }
    }
    return errorResponse(`Semua provider AI gagal. ${errors.join(' | ')}`, 500);
  } catch (err: any) {
    return errorResponse(err.message || 'Gagal memproses chat', 500);
  }
});

export default creatives;
