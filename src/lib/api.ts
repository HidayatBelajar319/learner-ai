const API_BASE = '/api';

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string | null;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, token } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const result = await response.json() as Record<string, unknown>;

  if (!response.ok) {
    throw new Error((result.message as string) || 'Terjadi kesalahan');
  }

  return result as T;
}

export const api = {
  get: <T>(endpoint: string, token?: string | null) =>
    request<T>(endpoint, { token }),

  post: <T>(endpoint: string, body?: unknown, token?: string | null) =>
    request<T>(endpoint, { method: 'POST', body, token }),

  put: <T>(endpoint: string, body?: unknown, token?: string | null) =>
    request<T>(endpoint, { method: 'PUT', body, token }),

  delete: <T>(endpoint: string, token?: string | null) =>
    request<T>(endpoint, { method: 'DELETE', token }),
};
