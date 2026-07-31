import { Hono } from 'hono';
import { Env } from '@/types';
import { successResponse, errorResponse, generateId, now, sanitizeString } from '@/api/utils/helpers';
import { verifyToken, extractToken } from '@/lib/auth/jwt';
import { chat, PROVIDERS, ProviderName } from '@/lib/ai/providers';

const visual = new Hono<{ Bindings: Env }>();

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

async function callAi(candidates: Candidate[], prompt: string, temperature = 0.7): Promise<{ content: string; provider: string; model: string }> {
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
        max_tokens: 4096,
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

function extractMermaid(text: string): string | null {
  const fence = text.match(/```mermaid\s*([\s\S]*?)```/i);
  if (fence) {
    const code = fence[1].trim();
    if (code) return code;
  }
  const trimmed = text.trim();
  if (/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|stateDiagram-v2|erDiagram|gantt|pie|mindmap|journey|gitGraph|C4Context)\b/i.test(trimmed)) {
    return trimmed;
  }
  return null;
}

const MIND_MAP_TYPES = ['mindmap', 'flowchart', 'sequence', 'class', 'state', 'er', 'gantt', 'pie', 'journey', 'git'] as const;
type DiagramType = typeof MIND_MAP_TYPES[number];

const DIAGRAM_INSTRUCTIONS: Record<DiagramType, string> = {
  mindmap: 'Gunakan sintaks "mindmap" mermaid (root di tengah, cabang dengan indentasi).',
  flowchart: 'Gunakan sintaks "flowchart TD" atau "flowchart LR" dengan node kotak/lingkaran dan label singkat.',
  sequence: 'Gunakan sintaks "sequenceDiagram" dengan aktor dan pesan yang jelas.',
  class: 'Gunakan sintaks "classDiagram" dengan kelas, atribut, dan relasi (-->, -->|...|).',
  state: 'Gunakan sintaks "stateDiagram-v2" dengan state dan transisi.',
  er: 'Gunakan sintaks "erDiagram" dengan entitas dan relasi.',
  gantt: 'Gunakan sintaks "gantt" dengan section dan tugas berdurasi.',
  pie: 'Gunakan sintaks "pie" dengan label dan persentase.',
  journey: 'Gunakan sintaks "journey" dengan title dan section.',
  git: 'Gunakan sintaks "gitGraph" dengan commit dan branch.',
};

/**
 * POST /api/visual/mind-maps/generate
 * Generate mind map dari topik menggunakan AI
 */
visual.post('/mind-maps/generate', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { topic?: string; level?: string };
  try {
    body = await c.req.json();
  } catch {
    return errorResponse('Format request tidak valid');
  }

  const topic = sanitizeString(body.topic);
  const level = sanitizeString(body.level);
  if (!topic) return errorResponse('Topik wajib diisi', 400);

  const prompt = `Buat mind map pembelajaran untuk topik: "${topic}"${level ? ` (level: ${level})` : ''}.

Struktur output HANYA JSON valid, tanpa teks lain, tanpa markdown, dengan format:
{"title":"judul singkat","nodes":[{"label":"cabang 1","children":[{"label":"sub-cabang","children":[]}]}]}

PERSYARATAN:
- Maksimal 3 tingkat kedalaman (cabang utama -> sub-cabang -> detail).
- 3 sampai 6 cabang utama.
- Setiap label singkat (maksimal 5 kata), berbahasa Indonesia.
- Isi sesuai topik pembelajaran, relevan untuk pelajar.`;

  try {
    const candidates = await getCandidates(c.env, payload.sub);
    const res = await callAi(candidates, prompt);
    const parsed = extractJson(res.content);
    const obj = (parsed && typeof parsed === 'object' ? parsed : {}) as Record<string, any>;
    const title = sanitizeString(obj.title) || topic;
    const nodes = Array.isArray(obj.nodes) ? obj.nodes : [];
    if (nodes.length === 0) return errorResponse('AI tidak menghasilkan mind map yang valid. Coba lagi.', 422);

    return successResponse('Mind map berhasil dibuat', {
      title,
      topic,
      nodes,
      source: 'ai',
      provider: res.provider,
      model: res.model,
    });
  } catch (err: any) {
    return errorResponse(err.message || 'Gagal membuat mind map', 500);
  }
});

/**
 * POST /api/visual/diagrams/generate
 * Generate diagram mermaid dari deskripsi menggunakan AI
 */
visual.post('/diagrams/generate', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { description?: string; type?: string; title?: string };
  try {
    body = await c.req.json();
  } catch {
    return errorResponse('Format request tidak valid');
  }

  const description = sanitizeString(body.description);
  if (!description) return errorResponse('Deskripsi wajib diisi', 400);

  const rawType = sanitizeString(body.type) || 'flowchart';
  const type: DiagramType = MIND_MAP_TYPES.includes(rawType as DiagramType) ? (rawType as DiagramType) : 'flowchart';
  const title = sanitizeString(body.title) || description.slice(0, 60);

  const prompt = `Buat diagram mermaid bertipe "${type}" untuk: "${description}".
${DIAGRAM_INSTRUCTIONS[type]}

Keluarkan HANYA kode mermaid di dalam fenced code block:
\`\`\`mermaid
<kode mermaid di sini>
\`\`\`
Tanpa teks atau penjelasan di luar block. Pastikan kode valid dan bisa dirender. Label menggunakan bahasa Indonesia.`;

  try {
    const candidates = await getCandidates(c.env, payload.sub);
    const res = await callAi(candidates, prompt, 0.6);
    const mermaid = extractMermaid(res.content);
    if (!mermaid) return errorResponse('AI tidak menghasilkan diagram yang valid. Coba lagi.', 422);

    return successResponse('Diagram berhasil dibuat', {
      title,
      type,
      mermaid,
      provider: res.provider,
      model: res.model,
    });
  } catch (err: any) {
    return errorResponse(err.message || 'Gagal membuat diagram', 500);
  }
});

/**
 * GET /api/visual/mind-maps
 * Daftar mind map milik user
 */
visual.get('/mind-maps', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const rows = await c.env.LEARNER_DB
    .prepare('SELECT id, title, topic, nodes, source, created_at FROM user_mind_maps WHERE user_id = ? ORDER BY created_at DESC')
    .bind(payload.sub)
    .all<{ id: string; title: string; topic: string | null; nodes: string; source: string; created_at: string }>();

  return successResponse('Daftar mind map', rows.results.map((r) => ({
    id: r.id,
    title: r.title,
    topic: r.topic,
    nodes: JSON.parse(r.nodes),
    source: r.source,
    created_at: r.created_at,
  })));
});

/**
 * POST /api/visual/mind-maps
 * Simpan mind map
 */
visual.post('/mind-maps', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { title?: string; topic?: string; nodes?: unknown; source?: string };
  try {
    body = await c.req.json();
  } catch {
    return errorResponse('Format request tidak valid');
  }

  const title = sanitizeString(body.title);
  const topic = sanitizeString(body.topic);
  const nodes = body.nodes;
  if (!title || !Array.isArray(nodes)) return errorResponse('title dan nodes wajib diisi', 400);

  await c.env.LEARNER_DB
    .prepare('INSERT INTO user_mind_maps (id, user_id, title, topic, nodes, source, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(generateId(), payload.sub, title, topic || null, JSON.stringify(nodes), sanitizeString(body.source) || 'ai', now())
    .run();

  return successResponse('Mind map disimpan');
});

/**
 * DELETE /api/visual/mind-maps/:id
 * Hapus mind map
 */
visual.delete('/mind-maps/:id', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const id = sanitizeString(c.req.param('id'));
  await c.env.LEARNER_DB
    .prepare('DELETE FROM user_mind_maps WHERE id = ? AND user_id = ?')
    .bind(id, payload.sub)
    .run();

  return successResponse('Mind map dihapus');
});

/**
 * GET /api/visual/diagrams
 * Daftar diagram milik user
 */
visual.get('/diagrams', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const rows = await c.env.LEARNER_DB
    .prepare('SELECT id, title, description, type, mermaid, created_at FROM user_diagrams WHERE user_id = ? ORDER BY created_at DESC')
    .bind(payload.sub)
    .all<{ id: string; title: string; description: string | null; type: string; mermaid: string; created_at: string }>();

  return successResponse('Daftar diagram', rows.results);
});

/**
 * POST /api/visual/diagrams
 * Simpan diagram
 */
visual.post('/diagrams', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { title?: string; description?: string; type?: string; mermaid?: string };
  try {
    body = await c.req.json();
  } catch {
    return errorResponse('Format request tidak valid');
  }

  const title = sanitizeString(body.title);
  const mermaid = sanitizeString(body.mermaid);
  const description = sanitizeString(body.description);
  const type = sanitizeString(body.type) || 'flowchart';
  if (!title || !mermaid) return errorResponse('title dan mermaid wajib diisi', 400);

  await c.env.LEARNER_DB
    .prepare('INSERT INTO user_diagrams (id, user_id, title, description, type, mermaid, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(generateId(), payload.sub, title, description || null, type, mermaid, now())
    .run();

  return successResponse('Diagram disimpan');
});

/**
 * DELETE /api/visual/diagrams/:id
 * Hapus diagram
 */
visual.delete('/diagrams/:id', async (c) => {
  const payload = await requireAuth(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const id = sanitizeString(c.req.param('id'));
  await c.env.LEARNER_DB
    .prepare('DELETE FROM user_diagrams WHERE id = ? AND user_id = ?')
    .bind(id, payload.sub)
    .run();

  return successResponse('Diagram dihapus');
});

export default visual;
