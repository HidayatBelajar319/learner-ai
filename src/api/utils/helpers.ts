import { Env, ApiResponse } from '@/types';

/**
 * Membuat response JSON standar
 * @param data - Data response
 * @param status - HTTP status code
 * @returns Response object
 */
export function jsonResponse<T>(data: ApiResponse<T>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

/**
 * Membuat response error standar
 * @param message - Pesan error
 * @param status - HTTP status code
 * @param errors - Array error detail
 * @returns Response object
 */
export function errorResponse(message: string, status = 400, errors?: string[]): Response {
  return jsonResponse({ success: false, message, errors }, status);
}

/**
 * Membuat response sukses standar
 * @param message - Pesan sukses
 * @param data - Data response
 * @returns Response object
 */
export function successResponse<T>(message: string, data?: T): Response {
  return jsonResponse({ success: true, message, data });
}

/**
 * Generate UUID v4
 * @returns UUID string
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Mendapatkan timestamp ISO sekarang
 * @returns ISO timestamp string
 */
export function now(): string {
  return new Date().toISOString();
}

/**
 * Parse JSON dengan aman
 * @param text - JSON string
 * @returns Parsed object atau null
 */
export function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/**
 * Sanitize string dari karakter berbahaya
 * @param input - Input string
 * @returns String yang sudah di-sanitize
 */
export function sanitizeString(input: unknown): string {
  if (input == null) return '';
  return String(input).trim().replace(/[<>'"]/g, '');
}

/**
 * Menghitung level dari total XP
 * @param totalXp - Total XP pengguna
 * @returns Level number (1-10)
 */
export function calculateLevel(totalXp: number): number {
  return Math.floor(totalXp / 100) + 1;
}

/**
 * CORS headers untuk semua response
 * @param env - Environment variables
 * @returns Headers object
 */
export function getCorsHeaders(env: Env): Record<string, string> {
  const origin = env.APP_ENV === 'development' ? '*' : env.APP_URL;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}
