/**
 * AI Auto Pick Model
 * Memilih model AI terbaik secara otomatis berdasarkan tugas (task),
 * kemampuan model (coding, reasoning, vision, image), kecepatan,
 * harga, dan context window. Cloudflare Workers AI diprioritaskan
 * karena gratis tanpa API key, namun seluruh provider BYOK didukung.
 */
import { ProviderName } from './providers';

export type AiTask = 'general' | 'chat' | 'coding' | 'reasoning' | 'creative' | 'vision' | 'image' | 'fast';

export interface ModelInfo {
  provider: ProviderName;
  model: string;
  label?: string;
  context?: number; // context window (tokens)
  speed?: number;   // 1-10, 10 = paling cepat
  cost?: number;    // 1-10, 10 = paling murah
  coding?: number;  // 0-1
  reasoning?: number; // 0-1
  vision?: boolean;
  image?: boolean;
}

export interface PickResult {
  provider: ProviderName;
  model: string;
  score: number;
  reasons: string[];
}

export const MODEL_CATALOG: ModelInfo[] = [
  // Cloudflare Workers AI (gratis, default)
  { provider: 'workersai', model: '@cf/openai/gpt-oss-20b', label: 'GPT-OSS 20B', context: 32000, speed: 7, cost: 10, coding: 0.75, reasoning: 0.6 },
  { provider: 'workersai', model: '@cf/openai/gpt-oss-120b', label: 'GPT-OSS 120B', context: 32000, speed: 5, cost: 10, coding: 0.85, reasoning: 0.8 },
  { provider: 'workersai', model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast', label: 'Llama 3.3 70B', context: 32000, speed: 7, cost: 10, coding: 0.7, reasoning: 0.65 },
  { provider: 'workersai', model: '@cf/qwen/qwen3-30b-a3b-fp8', label: 'Qwen3 30B', context: 32000, speed: 7, cost: 10, coding: 0.75, reasoning: 0.7 },
  { provider: 'workersai', model: '@cf/mistralai/mistral-small-3.1-24b-instruct', label: 'Mistral Small 3.1', context: 32000, speed: 7, cost: 10, coding: 0.6, reasoning: 0.55 },
  { provider: 'workersai', model: '@cf/zai-org/glm-4.7-flash', label: 'GLM 4.7 Flash', context: 32000, speed: 8, cost: 10, coding: 0.7, reasoning: 0.6 },
  { provider: 'workersai', model: '@cf/meta/llama-3.2-3b-instruct', label: 'Llama 3.2 3B', context: 8000, speed: 9, cost: 10, coding: 0.4, reasoning: 0.3 },

  // OpenAI
  { provider: 'openai', model: 'gpt-4o-mini', context: 128000, speed: 8, cost: 5, coding: 0.8, reasoning: 0.75, vision: true },
  { provider: 'openai', model: 'gpt-4o', context: 128000, speed: 6, cost: 2, coding: 0.9, reasoning: 0.85, vision: true },
  { provider: 'openai', model: 'gpt-3.5-turbo', context: 16384, speed: 9, cost: 6, coding: 0.6, reasoning: 0.5 },

  // OpenRouter
  { provider: 'openrouter', model: 'openai/gpt-4o-mini', context: 128000, speed: 8, cost: 5, coding: 0.8, reasoning: 0.75, vision: true },
  { provider: 'openrouter', model: 'openai/gpt-4o', context: 128000, speed: 6, cost: 2, coding: 0.9, reasoning: 0.85, vision: true },
  { provider: 'openrouter', model: 'anthropic/claude-3.5-sonnet', context: 200000, speed: 6, cost: 2, coding: 0.95, reasoning: 0.9, vision: true },
  { provider: 'openrouter', model: 'google/gemini-2.0-flash-001', context: 1000000, speed: 9, cost: 7, coding: 0.85, reasoning: 0.8, vision: true },
  { provider: 'openrouter', model: 'mistral/mistral-small-24b-instruct-2501', context: 128000, speed: 7, cost: 6, coding: 0.7, reasoning: 0.65 },

  // Mistral
  { provider: 'mistral', model: 'mistral-small-latest', context: 128000, speed: 7, cost: 6, coding: 0.65, reasoning: 0.6, vision: true },
  { provider: 'mistral', model: 'mistral-medium-latest', context: 128000, speed: 6, cost: 4, coding: 0.7, reasoning: 0.65 },
  { provider: 'mistral', model: 'mistral-large-latest', context: 128000, speed: 5, cost: 3, coding: 0.8, reasoning: 0.75, vision: true },

  // Anthropic
  { provider: 'anthropic', model: 'claude-3-haiku-20240307', context: 200000, speed: 9, cost: 5, coding: 0.7, reasoning: 0.6, vision: true },
  { provider: 'anthropic', model: 'claude-3.5-sonnet-20241022', context: 200000, speed: 6, cost: 2, coding: 0.95, reasoning: 0.9, vision: true },
  { provider: 'anthropic', model: 'claude-3-opus-20240229', context: 200000, speed: 3, cost: 1, coding: 0.9, reasoning: 0.95, vision: true },

  // Google Gemini
  { provider: 'google', model: 'gemini-2.0-flash-001', context: 1000000, speed: 9, cost: 7, coding: 0.85, reasoning: 0.8, vision: true },
  { provider: 'google', model: 'gemini-2.0-flash', context: 1000000, speed: 9, cost: 7, coding: 0.85, reasoning: 0.8, vision: true },
  { provider: 'google', model: 'gemini-1.5-pro-001', context: 2000000, speed: 5, cost: 3, coding: 0.9, reasoning: 0.9, vision: true },
  { provider: 'google', model: 'gemini-1.5-flash', context: 1000000, speed: 9, cost: 7, coding: 0.7, reasoning: 0.6, vision: true },

  // Groq (BYOK)
  { provider: 'groq', model: 'llama-3.3-70b-versatile', context: 128000, speed: 10, cost: 8, coding: 0.8, reasoning: 0.75 },
  { provider: 'groq', model: 'llama-3.1-8b-instant', context: 128000, speed: 10, cost: 8, coding: 0.5, reasoning: 0.4 },
  { provider: 'groq', model: 'qwen-2.5-32b', context: 131072, speed: 9, cost: 7, coding: 0.75, reasoning: 0.7 },

  // DeepSeek (BYOK)
  { provider: 'deepseek', model: 'deepseek-chat', context: 128000, speed: 7, cost: 9, coding: 0.85, reasoning: 0.8 },
  { provider: 'deepseek', model: 'deepseek-reasoner', context: 128000, speed: 5, cost: 7, coding: 0.9, reasoning: 0.95 },

  // OmniRoute lokal (gratis, fleksibel)
  { provider: 'omniroute', model: 'auto', label: 'OmniRoute Auto', context: 128000, speed: 8, cost: 10, coding: 0.8, reasoning: 0.75, vision: true },
];

/** Bobot tugas: prioritas atribut untuk tiap jenis tugas */
const TASK_WEIGHTS: Record<AiTask, { speed: number; cost: number; coding: number; reasoning: number; vision: number; image: number }> = {
  general: { speed: 1, cost: 2, coding: 1, reasoning: 1, vision: 0.5, image: 0 },
  chat: { speed: 2, cost: 3, coding: 0.5, reasoning: 0.5, vision: 0.2, image: 0 },
  coding: { speed: 1.5, cost: 1, coding: 4, reasoning: 2, vision: 0, image: 0 },
  reasoning: { speed: 0.5, cost: 1, coding: 1, reasoning: 4, vision: 0, image: 0 },
  creative: { speed: 1, cost: 2, coding: 1, reasoning: 2, vision: 0.5, image: 0.5 },
  vision: { speed: 1.5, cost: 1.5, coding: 0.5, reasoning: 1, vision: 5, image: 0 },
  image: { speed: 1, cost: 2, coding: 0, reasoning: 0.5, vision: 1, image: 5 },
  fast: { speed: 4, cost: 2, coding: 0.5, reasoning: 0.3, vision: 0.1, image: 0 },
};

/** Default metadata untuk model tak dikenal (kustom BYOK) */
function defaultInfo(provider: ProviderName, model: string): ModelInfo {
  return { provider, model, context: 128000, speed: 6, cost: 5, coding: 0.5, reasoning: 0.5, vision: true, image: false };
}

export function findModel(provider: ProviderName, model: string): ModelInfo {
  return MODEL_CATALOG.find((m) => m.provider === provider && m.model === model) ?? defaultInfo(provider, model);
}

/**
 * Pilih model terbaik dari daftar yang tersedia untuk sebuah tugas.
 * @param available daftar model yang tersedia (provider + model yang dipakai user)
 * @param task jenis tugas
 * @param opts preferensi (pilih paling cepat / paling murah)
 */
export function pickBestModel(available: Array<{ provider: ProviderName; model: string }>, task: AiTask, opts?: { prefer?: 'speed' | 'cost' }): PickResult {
  const w = { ...TASK_WEIGHTS[task] };
  if (opts?.prefer === 'speed') { w.speed *= 2; w.cost *= 0.5; }
  if (opts?.prefer === 'cost') { w.cost *= 2; w.speed *= 0.5; }

  const candidates = available.map((avail) => {
    const info = findModel(avail.provider, avail.model);
    if (task === 'vision' && !info.vision) return null;
    if (task === 'image' && !info.image) return null;

    const norm = (v: number | undefined, def: number) => (typeof v === 'number' ? v : def);
    const score =
      norm(info.speed, 5) * w.speed +
      norm(info.cost, 5) * w.cost +
      norm(info.coding, 0.5) * w.coding * 10 +
      norm(info.reasoning, 0.5) * w.reasoning * 10 +
      (info.vision ? 10 : 0) * w.vision +
      (info.image ? 10 : 0) * w.image;

    return { provider: avail.provider, model: avail.model, info, score };
  }).filter((c): c is NonNullable<typeof c> => c !== null);

  if (candidates.length === 0) {
    return {
      provider: available[0]?.provider ?? 'workersai',
      model: available[0]?.model ?? '@cf/openai/gpt-oss-20b',
      score: 0,
      reasons: ['Tidak ada model yang memenuhi syarat tugas ini'],
    };
  }

  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];
  const reasons: string[] = [
    `Skor ${best.score.toFixed(1)} dari ${candidates.length} kandidat`,
    best.info.context ? `Context ${best.info.context.toLocaleString()} token` : 'Context tidak diketahui',
    best.info.speed !== undefined ? `Kecepatan ${best.info.speed}/10` : '',
    best.info.cost !== undefined ? `Harga ${best.info.cost}/10` : '',
    best.info.coding !== undefined ? `Coding ${Math.round(best.info.coding * 100)}%` : '',
    best.info.reasoning !== undefined ? `Reasoning ${Math.round(best.info.reasoning * 100)}%` : '',
    best.info.vision ? 'Mendukung vision' : '',
    best.info.image ? 'Mendukung image generation' : '',
  ].filter(Boolean);

  return {
    provider: best.provider,
    model: best.model,
    score: best.score,
    reasons,
  };
}

/**
 * Ranking semua model yang tersedia untuk sebuah tugas.
 */
export function rankModels(available: Array<{ provider: ProviderName; model: string }>, task: AiTask): PickResult[] {
  const w = TASK_WEIGHTS[task];
  return available
    .map((avail) => {
      const info = findModel(avail.provider, avail.model);
      const score =
        (info.speed ?? 5) * w.speed +
        (info.cost ?? 5) * w.cost +
        (info.coding ?? 0.5) * w.coding * 10 +
        (info.reasoning ?? 0.5) * w.reasoning * 10 +
        (info.vision ? 10 : 0) * w.vision +
        (info.image ? 10 : 0) * w.image;
      return { provider: avail.provider, model: avail.model, score, reasons: [findModelLabel(info)] };
    })
    .sort((a, b) => b.score - a.score);
}

function findModelLabel(info: ModelInfo): string {
  return info.label ?? `${info.provider}/${info.model}`;
}
