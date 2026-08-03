import { Hono } from 'hono';
import { Env } from '@/types';
import { successResponse, errorResponse, generateId, now } from '@/api/utils/helpers';
import { verifyToken, extractToken } from '@/lib/auth/jwt';
import { chat, PROVIDERS, ProviderName, ChatMessage } from '@/lib/ai/providers';
import { getTool, toolSchemas, ToolContext } from '@/lib/ai/tools';
import { pickBestModel, rankModels, AiTask } from '@/lib/ai/auto-pick';

const ai = new Hono<{ Bindings: Env }>();

async function requireAuth(request: Request, jwtSecret: string) {
  const token = extractToken(request);
  if (!token) return null;
  return verifyToken(token, jwtSecret);
}

const SYSTEM_PROMPT = `Kamu adalah AI tutor dari platform Learner AI. Kamu bisa menggunakan tools untuk:
- Melihat daftar mata pelajaran, topik, dan materi pembelajaran
- Melihat statistik dan riwayat belajar user
- Membuat rencana belajar
- Membantu menyiapkan soal quiz

Gunakan tools dulu jika butuh data nyata dari platform, jangan menebak. Jawab dengan bahasa Indonesia yang ramah dan jelas.`;

ai.post('/chat', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: {
    messages: ChatMessage[];
    provider?: ProviderName | 'auto';
    model?: string;
    use_tools?: boolean;
  };
  try {
    body = await c.req.json();
  } catch {
    return errorResponse('Format request tidak valid');
  }

  const { messages, provider = 'openrouter', model, use_tools = true } = body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return errorResponse('messages wajib diisi', 400);
  }

  const userKeys = await c.env.LEARNER_DB
    .prepare('SELECT provider, key_value, model, base_url FROM api_keys WHERE user_id = ? AND is_active = 1 ORDER BY updated_at DESC')
    .bind(payload.sub)
    .all<{ provider: string; key_value: string; model: string | null; base_url: string | null }>();

  // Auto Pick Model: pilih provider+model terbaik otomatis bila diminta 'auto'
  let resolvedProvider = provider;
  let resolvedModel = model;
  let pickInfo: { provider: ProviderName; model: string; score: number; reasons: string[] } | null = null;

  const availableForPick: Array<{ provider: ProviderName; model: string }> = [];
  for (const k of userKeys.results) {
    availableForPick.push({ provider: k.provider as ProviderName, model: k.model || PROVIDERS.find((p) => p.name === k.provider)?.defaultModel || '' });
  }
  if (c.env.MISTRAL_API_KEY) availableForPick.push({ provider: 'mistral', model: 'mistral-small-latest' });
  if (c.env.AI) availableForPick.push({ provider: 'workersai', model: '@cf/openai/gpt-oss-20b' });

  if (provider === 'auto') {
    pickInfo = pickBestModel(availableForPick.filter((a) => a.model), 'chat');
    resolvedProvider = pickInfo.provider;
    resolvedModel = pickInfo.model;
  }

  const ctx: ToolContext = { env: c.env, userId: payload.sub, email: payload.email };
  const workingMessages: ChatMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }, ...messages];

  const hasAny = userKeys.results.length > 0 || Boolean(c.env.MISTRAL_API_KEY) || Boolean(c.env.AI);
  if (!hasAny) {
    return errorResponse('API key AI tidak ditemukan. Tambahkan key di Pengaturan atau pakai Workers AI bawaan.', 400);
  }

  // Model eksplisit hanya dipakai untuk provider hasil auto-pick (agar tidak bocor ke key lain)
  const modelFor = (p: ProviderName) => (pickInfo ? (p === resolvedProvider ? resolvedModel : undefined) : resolvedModel || model || undefined);

  const candidates: Array<{ provider: ProviderName; apiKey: string; model?: string; baseUrl?: string; ai?: unknown }> = [];
  const ordered = [...userKeys.results].sort((a, b) =>
    (b.provider === resolvedProvider ? 1 : 0) - (a.provider === resolvedProvider ? 1 : 0),
  );
  for (const k of ordered) {
    const p = k.provider as ProviderName;
    candidates.push({ provider: p, apiKey: k.key_value, model: modelFor(p) || k.model || undefined, baseUrl: k.base_url || undefined });
  }
  if (c.env.MISTRAL_API_KEY && !candidates.some(c => c.provider === 'mistral')) {
    candidates.push({ provider: 'mistral', apiKey: c.env.MISTRAL_API_KEY, model: modelFor('mistral') || undefined });
  }
  const workersCand = candidates.find(c => c.provider === 'workersai');
  if (workersCand && c.env.AI) {
    workersCand.ai = c.env.AI;
    if (modelFor('workersai') && !workersCand.model) workersCand.model = modelFor('workersai');
  } else if (c.env.AI) {
    candidates.push({ provider: 'workersai', apiKey: '', ai: c.env.AI, model: modelFor('workersai') || undefined });
  }

  const errors: string[] = [];

    for (const cand of candidates) {
    try {
      const result = await chatWithToolLoop(cand, [...workingMessages], use_tools, ctx);
      return successResponse('Respon AI berhasil', {
        content: result.content,
        model: result.model,
        provider: cand.provider,
        usage: result.usage,
        tools_used: result.tools_used,
        ...(pickInfo ? { auto_pick: { provider: pickInfo.provider, model: pickInfo.model, score: pickInfo.score, reasons: pickInfo.reasons } } : {}),
      });
    } catch (err: any) {
      const label = PROVIDERS.find(p => p.name === cand.provider)?.label ?? cand.provider;
      errors.push(`${label}: ${err.message ?? 'gagal'}`);
    }
  }

  return errorResponse(`Semua provider AI gagal. Periksa API key & model di Pengaturan. ${errors.join(' | ')}`, 500);
});

/* ============================================================
 * Unified AI Assistant: gabungkan Chat AI, Creative AI, dan AI UI
 * dalam satu endpoint. Body: { messages, mode?, context? }
 *   mode: 'auto' | 'chat' | 'design' | 'ui'  (default 'auto')
 * Respon: { content, provider, model, mode, design?, ui_patch? }
 * ============================================================ */

const ASSISTANT_DESIGN_TEMPLATE = `Kamu adalah AI designer di Learner AI (konsep seperti Canva, implementasi orisinal). Buat desain dari permintaan pengguna.
Keluarkan HANYA satu objek JSON valid tanpa teks lain, tanpa markdown, dengan format:
{"content":"penjelasan ramah singkat dalam Bahasa Indonesia tentang desain yang dibuat","design":{"title":"judul desain","width":1200,"height":800,"background":"#ffffff","elements":[{...}]}}

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
- Desain utuh, lengkap, dan profesional sesuai permintaan.
- Gunakan koordinat (x,y) piksel dalam kanvas width×height (default 1200×800).
- Maksimal 80 elemen. Semua teks berbahasa Indonesia kecuali diminta lain.
- Untuk sertifikat: elemen teks "Sertifikat" besar di atas, nama penerima, dan garis tanda tangan.
- "content" adalah jawaban ramah untuk pengguna (bukan bagian desain).`;

const ASSISTANT_UI_TEMPLATE = `Kamu adalah AI UI Editor di Learner AI. Bantu pengguna mengubah tampilan aplikasi (warna aksen, sidebar, font, halaman kustom) berdasarkan permintaan.
Keluarkan HANYA satu objek JSON valid tanpa teks lain, tanpa markdown, dengan format:
{"content":"penjelasan ramah singkat dalam Bahasa Indonesia","ui_patch":{"summary":"ringkasan perubahan","changes":[{"key":"accent","label":"Warna aksen","value":"#4F46E5"},{"key":"sidebar_bg","label":"Warna latar sidebar","value":"#ffffff"},{"key":"sidebar_text","label":"Warna teks sidebar","value":"#374151"},{"key":"font","label":"Font aplikasi","value":"Inter"}],"new_pages":[{"title":"Judul halaman","icon":"📄","content":"isi halaman dalam Markdown (Bahasa Indonesia)"}]}}

Aturan:
- Kunci (key) yang didukung untuk changes: accent, sidebar_bg, sidebar_text, font, radius.
- Hanya sertakan key yang diminta. value HEX (#rrggbb) untuk warna, nama font, atau angka px untuk radius.
- Warna aksen dan sidebar harus selaras dan kontras teks sidebar baik.
- Untuk "tambahkan menu/halaman" buat entri new_pages (maksimal 3). Halaman kustom otomatis jadi menu sidebar.
- Jika permintaan tidak berhubungan dengan UI: beri summary sopan dan kosongkan changes/new_pages.
- "content" adalah jawaban ramah untuk pengguna.`;

function detectAssistantMode(lastMessage: string | undefined): 'chat' | 'design' | 'ui' {
  const t = (lastMessage || '').toLowerCase();
  const designWords = ['desain', 'poster', 'banner', 'sertifikat', 'logo', 'undangan', 'infografis', 'cover', 'buat desain', 'design', 'gambar', 'ilustrasi'];
  const uiWords = ['ubah warna', 'ganti warna', 'warna aksen', 'warna sidebar', 'ganti font', 'ubah font', 'sidebar', 'tema', 'ubah tampilan', 'menu baru', 'tambah menu', 'halaman baru', 'ui editor', 'ubah ui', 'mode gelap', 'mode terang', 'radius'];
  if (uiWords.some((w) => t.includes(w))) return 'ui';
  if (designWords.some((w) => t.includes(w))) return 'design';
  return 'chat';
}

function extractAssistantJson(text: string): unknown | null {
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

async function getAssistantCandidates(env: Env, userId: string): Promise<Array<{ provider: ProviderName; apiKey: string; model?: string; baseUrl?: string; ai?: unknown }>> {
  const rows = await env.LEARNER_DB
    .prepare('SELECT provider, key_value, model, base_url FROM api_keys WHERE user_id = ? AND is_active = 1 ORDER BY updated_at DESC')
    .bind(userId)
    .all<{ provider: string; key_value: string; model: string | null; base_url: string | null }>();

  const candidates: Array<{ provider: ProviderName; apiKey: string; model?: string; baseUrl?: string; ai?: unknown }> = rows.results.map((k) => ({
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

ai.post('/assistant', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: {
    messages?: Array<{ role: string; content: string }>;
    mode?: 'auto' | 'chat' | 'design' | 'ui';
    context?: { settings?: Record<string, any>; pages?: Array<{ title?: string }>; design?: any };
  };
  try { body = await c.req.json(); } catch { return errorResponse('Format request tidak valid'); }

  const messages = body.messages;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return errorResponse('messages wajib diisi', 400);
  }

  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content;
  const requestedMode = body.mode && body.mode !== 'auto' ? body.mode : null;
  const mode = requestedMode || detectAssistantMode(lastUser);

  const candidates = await getAssistantCandidates(c.env, payload.sub);
  if (candidates.length === 0) {
    return errorResponse('API key AI tidak ditemukan. Tambahkan key di Pengaturan.', 400);
  }

  const ctx: ToolContext = { env: c.env, userId: payload.sub, email: payload.email };
  const errors: string[] = [];

  for (const cand of candidates) {
    try {
      if (mode === 'design') {
        const current = body.context?.design && typeof body.context.design === 'object' ? JSON.stringify(body.context.design).slice(0, 4000) : null;
        const prompt = `${ASSISTANT_DESIGN_TEMPLATE}

${current ? `Desain saat ini (JSON): ${current}\nPermintaan pengguna (remix/edit): "${lastUser}"` : `Permintaan pengguna: "${lastUser}"`}
Jawab dengan JSON valid sesuai format di atas.`;
        const res = await chat(cand.provider, cand.apiKey, {
          messages: [{ role: 'user', content: prompt }],
          model: cand.model,
          temperature: 0.8,
          max_tokens: 8192,
        }, { baseUrl: cand.baseUrl, ai: cand.ai });

        const parsed = extractAssistantJson(res.content);
        const obj = (parsed && typeof parsed === 'object' ? parsed : {}) as Record<string, any>;
        const design = obj.design && typeof obj.design === 'object' ? obj.design : null;
        const elements = Array.isArray(design?.elements) ? design.elements.slice(0, 80) : [];
        if (design && elements.length > 0) {
          return successResponse('Desain berhasil dibuat', {
            content: String(obj.content || 'Berikut desain untuk kamu.'),
            design: {
              title: String(design.title || (lastUser || 'Tanpa judul')).slice(0, 120),
              width: Number(design.width) || 1200,
              height: Number(design.height) || 800,
              background: typeof design.background === 'string' ? design.background : '#ffffff',
              elements,
            },
            provider: cand.provider,
            model: res.model,
            mode,
          });
        }
        throw new Error('AI tidak menghasilkan desain yang valid.');
      }

      if (mode === 'ui') {
        const settings = body.context?.settings || {};
        const pages = Array.isArray(body.context?.pages) ? body.context.pages.map((p) => String(p.title || '')).filter(Boolean) : [];
        const prompt = `${ASSISTANT_UI_TEMPLATE}

Konteks UI saat ini:
${JSON.stringify({ ...settings, pages }, null, 2).slice(0, 4000)}

Permintaan pengguna: "${lastUser}"
Jawab dengan JSON valid sesuai format di atas.`;
        const res = await chat(cand.provider, cand.apiKey, {
          messages: [{ role: 'user', content: prompt }],
          model: cand.model,
          temperature: 0.6,
          max_tokens: 4096,
        }, { baseUrl: cand.baseUrl, ai: cand.ai });

        const parsed = extractAssistantJson(res.content);
        const obj = (parsed && typeof parsed === 'object' ? parsed : {}) as Record<string, any>;
        const patch = obj.ui_patch && typeof obj.ui_patch === 'object' ? obj.ui_patch : null;
        const changes = Array.isArray(patch?.changes) ? patch.changes.slice(0, 8) : [];
        const newPages = Array.isArray(patch?.new_pages) ? patch.new_pages.slice(0, 3).map((p: any, i: number) => ({
          title: String(p?.title || `Halaman ${i + 1}`).slice(0, 120),
          icon: String(p?.icon || '📄').slice(0, 8),
          content: String(p?.content || '').slice(0, 20000),
        })) : [];
        return successResponse('Usulan perubahan UI', {
          content: String(obj.content || 'Berikut usulan perubahan UI.'),
          ui_patch: {
            summary: String(patch?.summary || (changes.length || newPages.length ? 'Berikut usulan perubahan UI.' : 'Tidak ada perubahan yang diperlukan.')).slice(0, 500),
            changes,
            new_pages: newPages,
          },
          provider: cand.provider,
          model: res.model,
          mode,
        });
      }

      // mode chat: tool loop seperti /api/ai/chat
      const workingMessages: ChatMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }, ...messages.map((m) => ({
        role: (m.role === 'assistant' || m.role === 'user' ? m.role : 'user'),
        content: m.content,
      })) as ChatMessage[]];
      const result = await chatWithToolLoop(cand, workingMessages, true, ctx);
      return successResponse('Respon AI berhasil', {
        content: result.content,
        model: result.model,
        provider: cand.provider,
        usage: result.usage,
        tools_used: result.tools_used,
        mode,
      });
    } catch (err: any) {
      const label = PROVIDERS.find((p) => p.name === cand.provider)?.label ?? cand.provider;
      errors.push(`${label}: ${err.message ?? 'gagal'}`);
    }
  }

  return errorResponse(`Semua provider AI gagal. Periksa API key & model di Pengaturan. ${errors.join(' | ')}`, 500);
});

async function chatWithToolLoop(
  cand: { provider: ProviderName; apiKey: string; model?: string; baseUrl?: string; ai?: unknown },
  workingMessages: ChatMessage[],
  useTools: boolean,
  ctx: ToolContext,
) {
  const toolLogs: unknown[] = [];
  const model = cand.model;
  const baseUrl = cand.baseUrl;

  let result = await chat(cand.provider, cand.apiKey, {
    messages: workingMessages,
    model,
    tools: useTools ? toolSchemas() : undefined,
    tool_choice: useTools ? 'auto' : undefined,
  }, { baseUrl, ai: cand.ai });

  let iterations = 0;

  while (result.tool_calls && result.tool_calls.length > 0 && iterations < 5) {
    for (const toolCall of result.tool_calls) {
      const tool = getTool(toolCall.name);
      let output: unknown;
      if (!tool) {
        output = { error: `Tool '${toolCall.name}' tidak dikenal` };
      } else {
        let args: Record<string, any> = {};
        try {
          args = JSON.parse(toolCall.arguments || '{}');
        } catch {
          args = {};
        }
        try {
          output = await tool.execute(args, ctx);
        } catch (err: any) {
          output = { error: err.message || 'Tool error' };
        }
      }
      toolLogs.push({ name: toolCall.name, args: JSON.parse(toolCall.arguments || '{}'), output });
      workingMessages.push({
        role: 'assistant',
        content: '',
        tool_calls: [{
          id: toolCall.id,
          type: 'function',
          function: { name: toolCall.name, arguments: toolCall.arguments },
        }],
      } as any);
      workingMessages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(output),
      } as any);
    }

    result = await chat(cand.provider, cand.apiKey, {
      messages: workingMessages,
      model,
      tools: useTools ? toolSchemas() : undefined,
      tool_choice: useTools ? 'auto' : undefined,
    }, { baseUrl, ai: cand.ai });
    iterations++;
  }

  return {
    content: result.content,
    model: result.model,
    usage: result.usage,
    tools_used: toolLogs.length > 0 ? toolLogs : undefined,
  };
}

ai.get('/providers', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  return successResponse('Daftar provider AI', PROVIDERS);
});

/**
 * POST /api/ai/auto-pick
 * Auto Pick Model: pilih model terbaik otomatis untuk sebuah tugas
 * Body: { task: 'general'|'chat'|'coding'|'reasoning'|'creative'|'vision'|'image'|'fast', prefer?: 'speed'|'cost' }
 */
ai.post('/auto-pick', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { task?: AiTask; prefer?: 'speed' | 'cost' };
  try { body = await c.req.json(); } catch { return errorResponse('Format request tidak valid'); }

  const task: AiTask = body.task || 'general';

  const userKeys = await c.env.LEARNER_DB
    .prepare('SELECT provider, key_value, model, base_url FROM api_keys WHERE user_id = ? AND is_active = 1 ORDER BY updated_at DESC')
    .bind(payload.sub)
    .all<{ provider: string; key_value: string; model: string | null; base_url: string | null }>();

  const available: Array<{ provider: ProviderName; model: string }> = [];
  for (const k of userKeys.results) {
    const config = PROVIDERS.find((p) => p.name === k.provider);
    const m = k.model || config?.defaultModel;
    if (m) available.push({ provider: k.provider as ProviderName, model: m });
  }
  if (c.env.MISTRAL_API_KEY) available.push({ provider: 'mistral', model: 'mistral-small-latest' });
  if (c.env.AI) available.push({ provider: 'workersai', model: '@cf/openai/gpt-oss-20b' });
  if (c.env.AI) available.push({ provider: 'workersai', model: '@cf/openai/gpt-oss-120b' });
  if (c.env.AI) available.push({ provider: 'workersai', model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast' });
  if (c.env.AI) available.push({ provider: 'workersai', model: '@cf/zai-org/glm-4.7-flash' });

  if (available.length === 0) {
    return errorResponse('Tidak ada provider AI tersedia. Tambahkan API key atau aktifkan Workers AI.', 400);
  }

  const best = pickBestModel(available, task, body.prefer ? { prefer: body.prefer } : undefined);
  const ranking = rankModels(available, task).slice(0, 10);

  return successResponse('Model terbaik', {
    best: { provider: best.provider, model: best.model, score: best.score, reasons: best.reasons },
    ranking,
    available_count: available.length,
  });
});

ai.get('/keys', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const keys = await c.env.LEARNER_DB
    .prepare('SELECT id, provider, model, base_url, is_active, created_at FROM api_keys WHERE user_id = ?')
    .bind(payload.sub)
    .all();

  return successResponse('Daftar API key', keys.results);
});

/**
 * POST /api/ai/keys/test
 * Uji koneksi API key ke provider
 */
ai.post('/keys/test', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { provider: ProviderName; key?: string; baseUrl?: string; model?: string };
  try {
    body = await c.req.json();
  } catch {
    return errorResponse('Format request tidak valid');
  }

  const { provider, key, baseUrl, model } = body;
  const providerConfig = PROVIDERS.find(p => p.name === provider);
  if (!providerConfig) return errorResponse('Provider tidak dikenal', 400);

  const stored = await c.env.LEARNER_DB
    .prepare('SELECT key_value, model, base_url FROM api_keys WHERE user_id = ? AND provider = ?')
    .bind(payload.sub, provider)
    .first<{ key_value: string; model: string | null; base_url: string | null }>();

  const apiKey = key || stored?.key_value || '';
  if (!apiKey && !providerConfig.customBaseUrl && providerConfig.requiresKey) {
    return errorResponse('API key belum diisi', 400);
  }

  const cleanBaseUrl = (baseUrl || stored?.base_url || providerConfig.baseUrl).replace(/\/+$/, '');
  const testModel = model || stored?.model || providerConfig.defaultModel;

  const started = Date.now();
  try {
    const result = await chat(provider, apiKey, {
      messages: [{ role: 'user', content: 'Balas satu kata: OK' }],
      model: testModel,
      max_tokens: 10,
    }, { baseUrl: cleanBaseUrl, ai: c.env.AI });

    return successResponse('Koneksi berhasil', {
      provider,
      model: result.model || testModel,
      latency_ms: Date.now() - started,
    });
  } catch (err: any) {
    return errorResponse(`Koneksi gagal: ${err.message ?? 'Unknown error'}`, 400);
  }
});

/**
 * GET /api/ai/models
 * Ambil daftar model dari provider (OpenAI-compatible /models)
 */
ai.post('/models', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { provider: ProviderName; key?: string; baseUrl?: string };
  try {
    body = await c.req.json();
  } catch {
    return errorResponse('Format request tidak valid');
  }

  const { provider, key, baseUrl } = body;
  const providerConfig = PROVIDERS.find(p => p.name === provider);
  if (!providerConfig) return errorResponse('Provider tidak dikenal', 400);

  const stored = await c.env.LEARNER_DB
    .prepare('SELECT key_value, base_url FROM api_keys WHERE user_id = ? AND provider = ?')
    .bind(payload.sub, provider)
    .first<{ key_value: string; base_url: string | null }>();

  const apiKey = key || stored?.key_value || '';
  const cleanBaseUrl = (baseUrl || stored?.base_url || providerConfig.baseUrl).replace(/\/+$/, '');

  if (provider === 'google' || provider === 'anthropic' || provider === 'workersai') {
    return successResponse('Daftar model', {
      models: providerConfig.models,
      listable: false,
    });
  }

  try {
    const res = await fetch(`${cleanBaseUrl}/models`, {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
    });

    if (!res.ok) {
      const err = await res.text();
      return errorResponse(`Gagal mengambil model (${res.status}): ${err.slice(0, 300)}`, 400);
    }

    const data: any = await res.json();
    const ids = Array.isArray(data?.data)
      ? data.data.map((m: any) => m.id).filter(Boolean).sort()
      : [];

    return successResponse('Daftar model', { models: ids, listable: true });
  } catch (err: any) {
    return errorResponse(`Gagal mengambil model: ${err.message ?? 'Unknown error'}`, 400);
  }
});

ai.post('/keys', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { provider: ProviderName; key: string; model?: string; baseUrl?: string };
  try {
    body = await c.req.json();
  } catch {
    return errorResponse('Format request tidak valid');
  }

  const { provider, key, model, baseUrl } = body;
  if (!provider || !key) {
    return errorResponse('provider dan key wajib diisi', 400);
  }

  const providerExists = PROVIDERS.find(p => p.name === provider);
  if (!providerExists) {
    return errorResponse('Provider tidak dikenal', 400);
  }

  const cleanBaseUrl = baseUrl?.trim() ? baseUrl.trim().replace(/\/+$/, '') : null;
  if (cleanBaseUrl && !/^https?:\/\//i.test(cleanBaseUrl)) {
    return errorResponse('baseUrl harus diawali http:// atau https://', 400);
  }

  const existing = await c.env.LEARNER_DB
    .prepare('SELECT id FROM api_keys WHERE user_id = ? AND provider = ?')
    .bind(payload.sub, provider)
    .first();

  if (existing) {
    await c.env.LEARNER_DB
      .prepare('UPDATE api_keys SET key_value = ?, model = ?, base_url = ?, updated_at = ? WHERE user_id = ? AND provider = ?')
      .bind(key, model || null, cleanBaseUrl, now(), payload.sub, provider)
      .run();

    return successResponse('API key diperbarui');
  }

  await c.env.LEARNER_DB
    .prepare('INSERT INTO api_keys (id, user_id, provider, key_value, model, base_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(generateId(), payload.sub, provider, key, model || null, cleanBaseUrl, now(), now())
    .run();

  return successResponse('API key disimpan');
});

ai.delete('/keys/:provider', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const provider = c.req.param('provider');

  await c.env.LEARNER_DB
    .prepare('DELETE FROM api_keys WHERE user_id = ? AND provider = ?')
    .bind(payload.sub, provider)
    .run();

  return successResponse('API key dihapus');
});

export default ai;
