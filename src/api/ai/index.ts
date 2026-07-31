import { Hono } from 'hono';
import { Env } from '@/types';
import { successResponse, errorResponse, generateId, now } from '@/api/utils/helpers';
import { verifyToken, extractToken } from '@/lib/auth/jwt';
import { chat, PROVIDERS, ProviderName, ChatMessage } from '@/lib/ai/providers';
import { getTool, toolSchemas, ToolContext } from '@/lib/ai/tools';

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
    provider?: ProviderName;
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

  const requested = userKeys.results.find(k => k.provider === provider) ?? userKeys.results[0];
  if (!requested && !c.env.MISTRAL_API_KEY && !c.env.AI) {
    return errorResponse('API key AI tidak ditemukan. Tambahkan key di Pengaturan atau pakai Workers AI bawaan.', 400);
  }

  const ctx: ToolContext = { env: c.env, userId: payload.sub, email: payload.email };
  const workingMessages: ChatMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }, ...messages];

  const candidates: Array<{ provider: ProviderName; apiKey: string; model?: string; baseUrl?: string; ai?: unknown }> = [];
  const ordered = requested ? [requested, ...userKeys.results.filter(k => k.provider !== requested.provider)] : userKeys.results;
  for (const k of ordered) {
    candidates.push({ provider: k.provider as ProviderName, apiKey: k.key_value, model: model || k.model || undefined, baseUrl: k.base_url || undefined });
  }
  if (c.env.MISTRAL_API_KEY && !candidates.some(c => c.provider === 'mistral')) {
    candidates.push({ provider: 'mistral', apiKey: c.env.MISTRAL_API_KEY, model: model || undefined });
  }
  const workersCand = candidates.find(c => c.provider === 'workersai');
  if (workersCand && c.env.AI) {
    workersCand.ai = c.env.AI;
    if (model && !workersCand.model) workersCand.model = model;
  } else if (c.env.AI) {
    candidates.push({ provider: 'workersai', apiKey: '', ai: c.env.AI, model: model || undefined });
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
      });
    } catch (err: any) {
      const label = PROVIDERS.find(p => p.name === cand.provider)?.label ?? cand.provider;
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
