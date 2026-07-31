export type ProviderName = 'openrouter' | 'openai' | 'mistral' | 'anthropic' | 'google' | 'omniroute' | 'workersai';

export interface ProviderConfig {
  name: ProviderName;
  label: string;
  baseUrl: string;
  defaultModel: string;
  models: string[];
  requiresKey: boolean;
  customBaseUrl?: boolean;
}

export const PROVIDERS: ProviderConfig[] = [
  {
    name: 'openrouter',
    label: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'openai/gpt-4o-mini',
    models: ['openai/gpt-4o-mini', 'openai/gpt-4o', 'anthropic/claude-3.5-sonnet', 'google/gemini-2.0-flash-001', 'mistral/mistral-small-24b-instruct-2501'],
    requiresKey: true,
  },
  {
    name: 'openai',
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'],
    requiresKey: true,
  },
  {
    name: 'mistral',
    label: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai/v1',
    defaultModel: 'mistral-small-latest',
    models: ['mistral-small-latest', 'mistral-medium-latest', 'mistral-large-latest'],
    requiresKey: true,
  },
  {
    name: 'anthropic',
    label: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-3-haiku-20240307',
    models: ['claude-3-haiku-20240307', 'claude-3.5-sonnet-20241022', 'claude-3-opus-20240229'],
    requiresKey: true,
  },
  {
    name: 'google',
    label: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    defaultModel: 'gemini-2.0-flash-001',
    models: ['gemini-2.0-flash-001', 'gemini-2.0-flash', 'gemini-1.5-pro-001', 'gemini-1.5-flash'],
    requiresKey: true,
  },
  {
    name: 'omniroute',
    label: 'OmniRoute (Local)',
    baseUrl: 'http://localhost:20128/v1',
    defaultModel: 'auto',
    models: ['auto'],
    requiresKey: false,
    customBaseUrl: true,
  },
  {
    name: 'workersai',
    label: 'Workers AI (Cloudflare)',
    baseUrl: '',
    defaultModel: '@cf/openai/gpt-oss-20b',
    models: [
      '@cf/openai/gpt-oss-20b',
      '@cf/openai/gpt-oss-120b',
      '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
      '@cf/qwen/qwen3-30b-a3b-fp8',
      '@cf/mistralai/mistral-small-3.1-24b-instruct',
      '@cf/zai-org/glm-4.7-flash',
      '@cf/meta/llama-3.2-3b-instruct',
    ],
    requiresKey: false,
  },
];

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_calls?: Array<{
    id: string;
    type?: string;
    function: { name: string; arguments: string };
  }>;
  tool_call_id?: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  tools?: unknown[];
  tool_choice?: 'auto' | 'none' | 'required';
}

export interface ChatResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  tool_calls?: Array<{
    id: string;
    name: string;
    arguments: string;
  }>;
}

async function openaiChat(baseUrl: string, apiKey: string, req: ChatRequest): Promise<ChatResponse> {  const body: Record<string, unknown> = {
    model: req.model,
    messages: req.messages,
    temperature: req.temperature ?? 0.7,
    max_tokens: req.max_tokens ?? 2048,
  };
  if (req.tools && req.tools.length > 0) {
    body.tools = req.tools;
    body.tool_choice = req.tool_choice ?? 'auto';
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

  const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI API error (${res.status}): ${err}`);
  }

  const data: any = await res.json();
  const message = data.choices?.[0]?.message ?? {};
  const toolCalls = Array.isArray(message.tool_calls)
    ? message.tool_calls.map((tc: any) => ({
        id: tc.id ?? `call_${Math.random().toString(36).slice(2)}`,
        name: tc.function?.name ?? '',
        arguments: tc.function?.arguments ?? '{}',
      }))
    : undefined;

  return {
    content: message.content ?? '',
    model: data.model ?? req.model ?? '',
    usage: data.usage ? {
      prompt_tokens: data.usage.prompt_tokens,
      completion_tokens: data.usage.completion_tokens,
      total_tokens: data.usage.total_tokens,
    } : undefined,
    tool_calls: toolCalls,
  };
}

async function anthropicChat(baseUrl: string, apiKey: string, req: ChatRequest): Promise<ChatResponse> {
  const system = req.messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n');

  const rawMessages: any[] = req.messages
    .filter((m) => m.role !== 'system')
    .map((m) => {
      if (m.role === 'tool') {
        return {
          role: 'user',
          content: [
            { type: 'tool_result', tool_use_id: m.tool_call_id || '', content: m.content },
          ],
        };
      }
      if (m.tool_calls && m.tool_calls.length > 0) {
        const contentArr: any[] = [];
        if (m.content) contentArr.push({ type: 'text', text: m.content });
        contentArr.push(
          ...m.tool_calls.map((tc) => ({
            type: 'tool_use',
            id: tc.id,
            name: tc.function.name,
            input: (() => {
              try { return JSON.parse(tc.function.arguments); } catch { return {}; }
            })(),
          })),
        );
        return {
          role: 'assistant',
          content: contentArr,
        };
      }
      return { role: m.role, content: m.content };
    });

  const messages: any[] = [];
  for (const msg of rawMessages) {
    const last = messages[messages.length - 1];
    if (last && last.role === msg.role) {
      if (Array.isArray(last.content) && Array.isArray(msg.content)) {
        last.content.push(...msg.content);
      } else if (Array.isArray(last.content)) {
        last.content.push({ type: 'text', text: String(msg.content ?? '') });
      } else if (Array.isArray(msg.content)) {
        last.content = [{ type: 'text', text: String(last.content ?? '') }, ...msg.content];
      } else {
        last.content = `${last.content ?? ''}${msg.content ?? ''}`;
      }
      if (msg.tool_calls) last.tool_calls = last.tool_calls || [];
    } else {
      messages.push(msg);
    }
  }

  const body: Record<string, unknown> = {
    model: req.model,
    max_tokens: req.max_tokens ?? 2048,
    messages,
  };
  if (system) body.system = system;
  if (req.temperature !== undefined) body.temperature = req.temperature;
  if (req.tools && req.tools.length > 0) {
    body.tools = req.tools.map((t: any) => ({
      name: t.function.name,
      description: t.function.description,
      input_schema: t.function.parameters,
    }));
  }

  const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${err}`);
  }

  const data: any = await res.json();

  let content = '';
  const toolCalls: ChatResponse['tool_calls'] = [];
  for (const block of data.content ?? []) {
    if (block.type === 'text') {
      content += block.text ?? '';
    } else if (block.type === 'tool_use') {
      toolCalls.push({
        id: block.id ?? `call_${Math.random().toString(36).slice(2)}`,
        name: block.name ?? '',
        arguments: typeof block.input === 'string' ? block.input : JSON.stringify(block.input ?? {}),
      });
    }
  }

  return {
    content,
    model: data.model ?? req.model ?? '',
    usage: data.usage ? {
      prompt_tokens: data.usage.input_tokens ?? 0,
      completion_tokens: data.usage.output_tokens ?? 0,
      total_tokens: (data.usage.input_tokens ?? 0) + (data.usage.output_tokens ?? 0),
    } : undefined,
    tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
  };
}

async function googleChat(baseUrl: string, apiKey: string, req: ChatRequest): Promise<ChatResponse> {
  const system = req.messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n');
  const model = req.model ?? 'gemini-2.0-flash-001';

  const contents: any[] = [];
  const pendingToolNames: string[] = [];
  const toolResults: string[] = [];

  for (const m of req.messages) {
    if (m.role === 'system') continue;
    if (m.role === 'tool') {
      toolResults.push(m.content);
      continue;
    }
    if (m.tool_calls && m.tool_calls.length > 0) {
      contents.push({
        role: 'model',
        parts: m.tool_calls.map((tc) => {
          pendingToolNames.push(tc.function.name);
          return {
            functionCall: {
              name: tc.function.name,
              args: (() => {
                try { return JSON.parse(tc.function.arguments); } catch { return {}; }
              })(),
            },
          };
        }),
      });
      continue;
    }
    contents.push({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    });
  }

  if (toolResults.length > 0) {
    contents.push({
      role: 'user',
      parts: toolResults.map((t, i) => ({
        functionResponse: {
          name: pendingToolNames[i] ?? 'tool',
          response: { result: t },
        },
      })),
    });
  }

  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: req.temperature ?? 0.7,
      maxOutputTokens: req.max_tokens ?? 2048,
    },
  };
  if (system) body.systemInstruction = { parts: [{ text: system }] };
  if (req.tools && req.tools.length > 0) {
    body.tools = [{
      functionDeclarations: req.tools.map((t: any) => ({
        name: t.function.name,
        description: t.function.description,
        parameters: t.function.parameters,
      })),
    }];
  }

  const res = await fetch(
    `${baseUrl.replace(/\/+$/, '')}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${err}`);
  }

  const data: any = await res.json();

  let content = '';
  const toolCalls: ChatResponse['tool_calls'] = [];
  for (const candidate of data.candidates ?? []) {
    for (const part of candidate.content?.parts ?? []) {
      if (part.text) content += part.text;
      if (part.functionCall) {
        toolCalls.push({
          id: `call_${Math.random().toString(36).slice(2)}`,
          name: part.functionCall.name ?? '',
          arguments: JSON.stringify(part.functionCall.args ?? {}),
        });
      }
    }
  }

  const usage = data.usageMetadata;
  return {
    content,
    model: data.modelVersion ?? model,
    usage: usage ? {
      prompt_tokens: usage.promptTokenCount ?? 0,
      completion_tokens: usage.candidatesTokenCount ?? 0,
      total_tokens: usage.totalTokenCount ?? 0,
    } : undefined,
    tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
  };
}

export interface ChatOptions {
  baseUrl?: string;
  ai?: unknown;
}

async function workersaiChat(ai: any, req: ChatRequest): Promise<ChatResponse> {
  const model = req.model ?? '@cf/openai/gpt-oss-20b';
  const messages = req.messages
    .filter((m) => m.role === 'system' || m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role, content: m.content }));

  const input: Record<string, unknown> = { messages };
  if (req.temperature !== undefined) input.temperature = req.temperature;
  if (req.max_tokens !== undefined) input.max_tokens = req.max_tokens;
  else input.max_tokens = 4096;

  const res: any = await ai.run(model, input);

  let content = '';
  if (typeof res?.response === 'string' && res.response.trim()) {
    content = res.response;
  } else {
    const msg = res?.choices?.[0]?.message;
    if (typeof msg?.content === 'string' && msg.content.trim()) {
      content = msg.content;
    } else if (typeof msg?.reasoning_content === 'string') {
      content = msg.reasoning_content;
    } else if (Array.isArray(msg?.content)) {
      content = msg.content.map((b: any) => (typeof b?.text === 'string' ? b.text : '')).join('');
    } else if (typeof res?.response === 'string') {
      content = res.response;
    } else if (Array.isArray(res?.response)) {
      content = res.response.map((b: any) => (typeof b?.text === 'string' ? b.text : '')).join('');
    }
  }

  if (!content) {
    throw new Error(`Model ${model} tidak menghasilkan respons. Coba pilih model lain di Pengaturan.`);
  }

  return {
    content,
    model,
    usage: res?.usage
      ? {
          prompt_tokens: res.usage.prompt_tokens ?? 0,
          completion_tokens: res.usage.completion_tokens ?? 0,
          total_tokens: (res.usage.prompt_tokens ?? 0) + (res.usage.completion_tokens ?? 0),
        }
      : undefined,
  };
}

export async function chat(provider: ProviderName, apiKey: string, req: ChatRequest, options: ChatOptions = {}): Promise<ChatResponse> {
  const config = PROVIDERS.find(p => p.name === provider);
  if (!config) throw new Error(`Provider ${provider} tidak dikenal`);

  const baseUrl = options.baseUrl || config.baseUrl;
  const model = req.model ?? config.defaultModel;

  if (provider === 'workersai') {
    if (!options.ai) throw new Error('Workers AI (Cloudflare) tidak tersedia di environment ini');
    return workersaiChat(options.ai, { ...req, model });
  }

  if (provider === 'anthropic') {
    return anthropicChat(baseUrl, apiKey, { ...req, model });
  }

  if (provider === 'google') {
    return googleChat(baseUrl, apiKey, { ...req, model });
  }

  if (provider === 'openrouter' || provider === 'openai' || provider === 'mistral' || provider === 'omniroute') {
    return openaiChat(baseUrl, apiKey, { ...req, model });
  }

  throw new Error(`Provider ${provider} belum didukung`);
}
