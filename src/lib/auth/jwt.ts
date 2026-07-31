import { SignJWT, jwtVerify } from 'jose';
import { AuthPayload } from '@/types';

const ALGORITHM = 'HS256';
const EXPIRY = '24h';

/**
 * Membuat JWT token untuk user yang berhasil login
 * @param payload - Data user untuk disimpan di token
 * @param secret - JWT secret key
 * @returns Token string
 */
export async function createToken(
  payload: Omit<AuthPayload, 'iat' | 'exp'>,
  secret: string,
): Promise<string> {
  const secretKey = new TextEncoder().encode(secret);
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(secretKey);
}

/**
 * Memverifikasi JWT token
 * @param token - Token yang akan diverifikasi
 * @param secret - JWT secret key
 * @returns Payload jika valid, null jika tidak valid
 */
export async function verifyTokenRaw(
  token: string,
  secret: string,
): Promise<AuthPayload | null> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as AuthPayload;
  } catch {
    return null;
  }
}

export async function verifyToken(
  token: string,
  secret: string,
): Promise<AuthPayload | null> {
  const payload = await verifyTokenRaw(token, secret);
  if (!payload) return null;
  if (payload.step === '2fa') return null;
  return payload;
}

/**
 * Mengambil token dari header Authorization
 * @param request - HTTP request
 * @returns Token string atau null
 */
export function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

/**
 * Hash password menggunakan SHA-256 dengan salt
 * @param password - Password plain text
 * @param salt - Salt string (opsional, jika tidak ada akan dibuat random)
 * @returns Hash string dalam format "salt:hash"
 */
export async function hashPassword(password: string, salt?: string): Promise<string> {
  const usedSalt = salt ?? crypto.randomUUID();
  const data = new TextEncoder().encode(usedSalt + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${usedSalt}:${hashHex}`;
}

/**
 * Memverifikasi password dengan hash yang tersimpan
 * @param password - Password plain text yang akan dicek
 * @param storedHash - Hash yang tersimpan di database (format "salt:hash")
 * @returns true jika password benar
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt] = storedHash.split(':');
  if (!salt) return false;
  const newHash = await hashPassword(password, salt);
  return newHash === storedHash;
}

/**
 * Validasi format email
 * @param email - Email yang akan divalidasi
 * @returns true jika format valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validasi kekuatan password
 * @param password - Password yang akan divalidasi
 * @returns Array of error messages (kosong jika valid)
 */
export function validatePassword(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 8) {
    errors.push('Password minimal 8 karakter');
  }
  return errors;
}

/**
 * Validasi username
 * @param username - Username yang akan divalidasi
 * @returns Array of error messages (kosong jika valid)
 */
export function validateUsername(username: string): string[] {
  const errors: string[] = [];
  if (username.length < 3) {
    errors.push('Username minimal 3 karakter');
  }
  if (username.length > 30) {
    errors.push('Username maksimal 30 karakter');
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username hanya boleh mengandung huruf, angka, dan underscore');
  }
  return errors;
}
