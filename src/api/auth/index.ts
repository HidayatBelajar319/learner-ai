import { Hono } from 'hono';
import { Env, RegisterRequest, LoginRequest } from '@/types';
import {
  hashPassword,
  verifyPassword,
  createToken,
  isValidEmail,
  validatePassword,
  validateUsername,
} from '@/lib/auth/jwt';
import {
  successResponse,
  errorResponse,
  generateId,
  now,
  sanitizeString,
} from '@/api/utils/helpers';

const auth = new Hono<{ Bindings: Env }>();

/**
 * POST /api/auth/register
 * Mendaftarkan pengguna baru
 */
auth.post('/register', async (c) => {
  let body: RegisterRequest;

  try {
    body = await c.req.json<RegisterRequest>();
  } catch {
    return errorResponse('Format request tidak valid');
  }

  const { full_name, username, email, password } = body;

  if (!full_name || !username || !email || !password) {
    return errorResponse('Semua field wajib diisi', 400, [
      'full_name, username, email, password harus diisi',
    ]);
  }

  const cleanName = sanitizeString(full_name);
  const cleanUsername = sanitizeString(username).toLowerCase();
  const cleanEmail = sanitizeString(email).toLowerCase();

  const errors: string[] = [];

  if (cleanName.length < 2) {
    errors.push('Nama lengkap minimal 2 karakter');
  }

  const usernameErrors = validateUsername(cleanUsername);
  errors.push(...usernameErrors);

  if (!isValidEmail(cleanEmail)) {
    errors.push('Format email tidak valid');
  }

  const passwordErrors = validatePassword(password);
  errors.push(...passwordErrors);

  if (errors.length > 0) {
    return errorResponse('Data tidak valid', 400, errors);
  }

  const db = c.env.LEARNER_DB;

  const existingEmail = await db
    .prepare('SELECT id FROM users WHERE email = ?')
    .bind(cleanEmail)
    .first();

  if (existingEmail) {
    return errorResponse('Email sudah digunakan', 409, ['Email sudah terdaftar']);
  }

  const existingUsername = await db
    .prepare('SELECT id FROM users WHERE username = ?')
    .bind(cleanUsername)
    .first();

  if (existingUsername) {
    return errorResponse('Username sudah digunakan', 409, ['Username sudah terdaftar']);
  }

  const userId = generateId();
  const passwordHash = await hashPassword(password);
  const createdAt = now();

  await db
    .prepare(
      `INSERT INTO users (id, email, username, password_hash, full_name, profile, preferences, role, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      userId,
      cleanEmail,
      cleanUsername,
      passwordHash,
      cleanName,
      '{}',
      JSON.stringify({ theme: 'system', language: 'id', notifications: true }),
      'student',
      1,
      createdAt,
      createdAt,
    )
    .run();

  await db
    .prepare(
      `INSERT INTO user_xp (id, user_id, total_xp, level, last_updated)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .bind(generateId(), userId, 0, 1, createdAt)
    .run();

  await db
    .prepare(
      `INSERT INTO user_streaks (id, user_id, current_streak, longest_streak, last_login)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .bind(generateId(), userId, 0, 0, createdAt)
    .run();

  const token = await createToken(
    { sub: userId, email: cleanEmail, username: cleanUsername, role: 'student' },
    c.env.JWT_SECRET,
  );

  return successResponse('Akun berhasil dibuat', {
    user: {
      id: userId,
      email: cleanEmail,
      username: cleanUsername,
      full_name: cleanName,
      role: 'student',
      created_at: createdAt,
    },
    token,
  });
});

/**
 * POST /api/auth/login
 * Login pengguna dengan email dan password
 */
auth.post('/login', async (c) => {
  let body: LoginRequest;

  try {
    body = await c.req.json<LoginRequest>();
  } catch {
    return errorResponse('Format request tidak valid');
  }

  const { email, password } = body;

  if (!email || !password) {
    return errorResponse('Email dan password wajib diisi', 400);
  }

  const cleanEmail = sanitizeString(email).toLowerCase();

  const user = await c.env.LEARNER_DB
    .prepare(
      `SELECT id, email, username, password_hash, full_name, profile, preferences, role, is_active
       FROM users WHERE email = ?`,
    )
    .bind(cleanEmail)
    .first<{
      id: string;
      email: string;
      username: string;
      password_hash: string;
      full_name: string;
      profile: string;
      preferences: string;
      role: string;
      is_active: number;
    }>();

  if (!user) {
    return errorResponse('Email atau password salah', 401);
  }

  if (!user.is_active) {
    return errorResponse('Akun tidak aktif. Hubungi admin.', 403);
  }

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    return errorResponse('Email atau password salah', 401);
  }

  const token = await createToken(
    { sub: user.id, email: user.email, username: user.username, role: user.role },
    c.env.JWT_SECRET,
  );

  await c.env.LEARNER_DB
    .prepare(`UPDATE user_streaks SET last_login = ? WHERE user_id = ?`)
    .bind(now(), user.id)
    .run();

  return successResponse('Login berhasil', {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      profile: JSON.parse(user.profile || '{}'),
      preferences: JSON.parse(user.preferences || '{}'),
    },
    token,
  });
});

/**
 * GET /api/auth/me
 * Mendapatkan data user yang sedang login
 */
auth.get('/me', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse('Token tidak ditemukan', 401);
  }

  const token = authHeader.slice(7);
  const { verifyToken } = await import('@/lib/auth/jwt');
  const payload = await verifyToken(token, c.env.JWT_SECRET);

  if (!payload) {
    return errorResponse('Token tidak valid atau sudah expired', 401);
  }

  const user = await c.env.LEARNER_DB
    .prepare(
      `SELECT u.id, u.email, u.username, u.full_name, u.profile, u.preferences, u.role, u.created_at,
              x.total_xp, x.level,
              s.current_streak, s.longest_streak
       FROM users u
       LEFT JOIN user_xp x ON x.user_id = u.id
       LEFT JOIN user_streaks s ON s.user_id = u.id
       WHERE u.id = ? AND u.is_active = 1`,
    )
    .bind(payload.sub)
    .first<{
      id: string;
      email: string;
      username: string;
      full_name: string;
      profile: string;
      preferences: string;
      role: string;
      created_at: string;
      total_xp: number;
      level: number;
      current_streak: number;
      longest_streak: number;
    }>();

  if (!user) {
    return errorResponse('User tidak ditemukan', 404);
  }

  return successResponse('Data user berhasil diambil', {
    id: user.id,
    email: user.email,
    username: user.username,
    full_name: user.full_name,
    role: user.role,
    profile: JSON.parse(user.profile || '{}'),
    preferences: JSON.parse(user.preferences || '{}'),
    created_at: user.created_at,
    xp: {
      total_xp: user.total_xp ?? 0,
      level: user.level ?? 1,
    },
    streak: {
      current: user.current_streak ?? 0,
      longest: user.longest_streak ?? 0,
    },
  });
});

export default auth;
