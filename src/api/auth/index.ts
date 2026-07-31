import { Hono } from 'hono';
import { Env, RegisterRequest, LoginRequest } from '@/types';
import {
  hashPassword,
  verifyPassword,
  createToken,
  extractToken,
  verifyToken,
  verifyTokenRaw,
  isValidEmail,
  validatePassword,
  validateUsername,
} from '@/lib/auth/jwt';
import {
  successResponse,
  errorResponse,
  jsonResponse,
  generateId,
  now,
  sanitizeString,
} from '@/api/utils/helpers';
import { generateTOTPSecret, generateBackupCodes, verifyTOTPAsync } from '@/lib/auth/totp';

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

  const adminEmails = (c.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
  const premiumDomains = (c.env.PREMIUM_DOMAINS || '').split(',').map(d => d.trim().toLowerCase());
  const emailDomain = cleanEmail.split('@')[1]?.toLowerCase() || '';
  const userRole = adminEmails.includes(cleanEmail) ? 'admin' : premiumDomains.includes(emailDomain) ? 'premium' : 'student';

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
      userRole,
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
      `SELECT id, email, username, password_hash, full_name, profile, preferences, role, is_active, inactive_reason
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
      inactive_reason: string | null;
    }>();

  if (!user) {
    const deleted = await c.env.LEARNER_DB
      .prepare('SELECT reason FROM user_deletions WHERE email = ?')
      .bind(cleanEmail)
      .first<{ reason: string }>();
    if (deleted) {
      return jsonResponse({
        success: false,
        message: `Akun kamu telah dihapus. Alasan: ${deleted.reason}`,
        data: { account_deleted: true, reason: deleted.reason },
      }, 410);
    }
    return errorResponse('Email atau password salah', 401);
  }

  if (!user.is_active) {
    return errorResponse(
      `Akun kamu dinonaktifkan. Alasan: ${user.inactive_reason || 'kebijakan admin'}`,
      403,
    );
  }

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    return errorResponse('Email atau password salah', 401);
  }

  const twoFA = await c.env.LEARNER_DB
    .prepare('SELECT totp_enabled FROM user_2fa WHERE user_id = ? AND totp_enabled = 1')
    .bind(user.id)
    .first<{ totp_enabled: number }>();

  if (twoFA) {
    const partialToken = await createToken(
      { sub: user.id, email: user.email, username: user.username, role: user.role, step: '2fa' },
      c.env.JWT_SECRET,
    );
    return successResponse('Verifikasi 2FA diperlukan', {
      requires_2fa: true,
      user_id: user.id,
      partial_token: partialToken,
    });
  }

  const token = await createToken(
    { sub: user.id, email: user.email, username: user.username, role: user.role },
    c.env.JWT_SECRET,
  );

  await c.env.LEARNER_DB
    .prepare(`UPDATE user_streaks SET last_login = ? WHERE user_id = ?`)
    .bind(now(), user.id)
    .run();

  await c.env.LEARNER_SESSION.delete(`acct-notice:${user.id}`);

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
  const payload = await verifyToken(token, c.env.JWT_SECRET);

  if (!payload) {
    return errorResponse('Token tidak valid atau sudah expired', 401);
  }

  const deleted = await c.env.LEARNER_DB
    .prepare('SELECT reason FROM user_deletions WHERE user_id = ?')
    .bind(payload.sub)
    .first<{ reason: string }>();

  if (deleted) {
    return jsonResponse({
      success: false,
      message: `Akun kamu telah dihapus. Alasan: ${deleted.reason}`,
      data: { account_deleted: true, reason: deleted.reason },
    }, 410);
  }

  const user = await c.env.LEARNER_DB
    .prepare(
      `SELECT u.id, u.email, u.username, u.full_name, u.profile, u.preferences, u.role, u.is_active, u.inactive_reason, u.created_at,
              x.total_xp, x.level,
              s.current_streak, s.longest_streak
       FROM users u
       LEFT JOIN user_xp x ON x.user_id = u.id
       LEFT JOIN user_streaks s ON s.user_id = u.id
       WHERE u.id = ?`,
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
      is_active: number;
      inactive_reason: string | null;
      created_at: string;
      total_xp: number;
      level: number;
      current_streak: number;
      longest_streak: number;
    }>();

  if (!user) {
    return errorResponse('User tidak ditemukan', 404);
  }

  let accountStatus: { inactive: boolean; reason: string | null; notice_count?: number; force_logout?: boolean } = {
    inactive: false,
    reason: null,
  };

  if (!user.is_active) {
    const key = `acct-notice:${payload.sub}`;
    const countStr = await c.env.LEARNER_SESSION.get(key);
    const count = (parseInt(countStr || '0', 10) || 0) + 1;
    const forceLogout = count >= 4;
    await c.env.LEARNER_SESSION.put(key, String(count), { expirationTtl: 7 * 86400 });
    if (forceLogout) await c.env.LEARNER_SESSION.delete(key);
    accountStatus = {
      inactive: true,
      reason: user.inactive_reason || null,
      notice_count: count,
      force_logout: forceLogout,
    };
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
    account_status: accountStatus,
  });
});

/**
 * POST /api/auth/2fa/setup
 * Setup TOTP authenticator
 */
auth.post('/2fa/setup', async (c) => {
  try {
    const payload = await requireAuthWorker(c.req.raw, c.env.JWT_SECRET);
    if (!payload) return errorResponse('Unauthorized', 401);

    const secret = generateTOTPSecret();
    const backupCodes = generateBackupCodes(10);
    const nowStr = now();
    const id = generateId();

    await c.env.LEARNER_DB
      .prepare('INSERT OR REPLACE INTO user_2fa (id, user_id, totp_secret, totp_enabled, backup_codes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(id, payload.sub, secret, 0, JSON.stringify(backupCodes), nowStr, nowStr)
      .run();

    return successResponse('TOTP siap diaktifkan', {
      secret,
      qr_otpauth: `otpauth://totp/Learner%20AI:${payload.email}?secret=${secret}&issuer=Learner%20AI`,
      backup_codes: backupCodes,
    });
  } catch (e: any) {
    return errorResponse(e.message || 'Terjadi kesalahan', 500);
  }
});

/**
 * POST /api/auth/2fa/verify
 * Verifikasi dan aktifkan TOTP
 */
auth.post('/2fa/verify', async (c) => {
  const payload = await requireAuthWorker(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { token: string };
  try { body = await c.req.json(); } catch { return errorResponse('Format tidak valid'); }

  const record = await c.env.LEARNER_DB
    .prepare('SELECT totp_secret FROM user_2fa WHERE user_id = ?')
    .bind(payload.sub)
    .first<{ totp_secret: string }>();

  if (!record?.totp_secret) return errorResponse('Belum setup TOTP', 400);

  const valid = await verifyTOTPAsync(record.totp_secret, body.token);
  if (!valid) return errorResponse('Kode TOTP tidak valid', 400);

  await c.env.LEARNER_DB
    .prepare('UPDATE user_2fa SET totp_enabled = 1 WHERE user_id = ?')
    .bind(payload.sub)
    .run();

  return successResponse('TOTP berhasil diaktifkan');
});

/**
 * POST /api/auth/2fa/validate
 * Validasi TOTP saat login
 */
auth.post('/2fa/validate', async (c) => {
  let body: { user_id: string; token: string; partial_token?: string };
  try { body = await c.req.json(); } catch { return errorResponse('Format tidak valid'); }

  if (body.partial_token) {
    const partial = await verifyTokenRaw(body.partial_token, c.env.JWT_SECRET);
    if (!partial || partial.step !== '2fa' || partial.sub !== body.user_id) {
      return errorResponse('Sesi login tidak valid', 401);
    }
  } else {
    return errorResponse('Sesi login tidak valid', 401);
  }

  const record = await c.env.LEARNER_DB
    .prepare('SELECT totp_secret, backup_codes FROM user_2fa WHERE user_id = ? AND totp_enabled = 1')
    .bind(body.user_id)
    .first<{ totp_secret: string; backup_codes: string }>();

  if (!record) return errorResponse('TOTP tidak aktif', 400);

  let verified = await verifyTOTPAsync(record.totp_secret, body.token);
  if (!verified) {
    const codes: string[] = JSON.parse(record.backup_codes || '[]');
    const idx = codes.indexOf(body.token);
    if (idx !== -1) {
      codes.splice(idx, 1);
      await c.env.LEARNER_DB
        .prepare('UPDATE user_2fa SET backup_codes = ? WHERE user_id = ?')
        .bind(JSON.stringify(codes), body.user_id)
        .run();
      verified = true;
    }
  }
  if (!verified) return errorResponse('Kode tidak valid', 400);

  const user = await c.env.LEARNER_DB
    .prepare('SELECT id, email, username, full_name, role, profile, preferences FROM users WHERE id = ?')
    .bind(body.user_id)
    .first<{ id: string; email: string; username: string; full_name: string; role: string; profile: string; preferences: string }>();

  if (!user) return errorResponse('User tidak ditemukan', 404);

  const token = await createToken(
    { sub: user.id, email: user.email, username: user.username, role: user.role },
    c.env.JWT_SECRET,
  );

  return successResponse('TOTP valid', {
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
 * GET /api/auth/2fa/status
 * Cek status 2FA user
 */
auth.get('/2fa/status', async (c) => {
  const payload = await requireAuthWorker(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  const record = await c.env.LEARNER_DB
    .prepare('SELECT totp_enabled FROM user_2fa WHERE user_id = ?')
    .bind(payload.sub)
    .first<{ totp_enabled: number }>();

  return successResponse('Status 2FA', {
    enabled: record?.totp_enabled === 1,
  });
});

/**
 * POST /api/auth/change-password
 */
auth.post('/change-password', async (c) => {
  const payload = await requireAuthWorker(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { old_password: string; new_password: string };
  try { body = await c.req.json(); } catch { return errorResponse('Format tidak valid'); }

  if (!body.old_password || !body.new_password) {
    return errorResponse('Password lama dan baru wajib diisi');
  }

  const pwdErrors = validatePassword(body.new_password);
  if (pwdErrors.length > 0) return errorResponse('Password baru tidak valid', 400, pwdErrors);

  const user = await c.env.LEARNER_DB
    .prepare('SELECT password_hash FROM users WHERE id = ?')
    .bind(payload.sub)
    .first<{ password_hash: string }>();

  if (!user) return errorResponse('User tidak ditemukan', 404);

  const match = await verifyPassword(body.old_password, user.password_hash);
  if (!match) return errorResponse('Password lama salah', 400);

  const newHash = await hashPassword(body.new_password);
  await c.env.LEARNER_DB
    .prepare('UPDATE users SET password_hash = ? WHERE id = ?')
    .bind(newHash, payload.sub)
    .run();

  return successResponse('Password berhasil diubah');
});

/**
 * POST /api/auth/avatar
 * Upload foto profil (data URL base64) — disimpan di profile.avatar
 */
auth.post('/avatar', async (c) => {
  const payload = await requireAuthWorker(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { avatar: string };
  try { body = await c.req.json(); } catch { return errorResponse('Format tidak valid'); }

  if (typeof body.avatar !== 'string') {
    return errorResponse('Data avatar wajib diisi');
  }

  if (body.avatar.length > 2_500_000) {
    return errorResponse('Ukuran foto profil terlalu besar (maks 2MB)');
  }

  if (body.avatar !== '' && !/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(body.avatar)) {
    return errorResponse('Format avatar tidak valid. Gunakan data URL image (png/jpeg/webp/gif).');
  }

  const user = await c.env.LEARNER_DB
    .prepare('SELECT profile FROM users WHERE id = ?')
    .bind(payload.sub)
    .first<{ profile: string }>();

  if (!user) return errorResponse('User tidak ditemukan', 404);

  const profile = JSON.parse(user.profile || '{}');
  if (body.avatar === '') {
    delete profile.avatar;
  } else {
    profile.avatar = body.avatar;
  }

  await c.env.LEARNER_DB
    .prepare('UPDATE users SET profile = ?, updated_at = ? WHERE id = ?')
    .bind(JSON.stringify(profile), now(), payload.sub)
    .run();

  return successResponse('Foto profil berhasil diupdate', { profile });
});

/**
 * POST /api/auth/profile
 * Update profil (bio, sekolah, kelas, tanggal lahir)
 */
auth.post('/profile', async (c) => {
  const payload = await requireAuthWorker(c.req.raw, c.env.JWT_SECRET);
  if (!payload) return errorResponse('Unauthorized', 401);

  let body: { bio?: string; school?: string; grade?: string; birth_date?: string; full_name?: string };
  try { body = await c.req.json(); } catch { return errorResponse('Format tidak valid'); }

  const user = await c.env.LEARNER_DB
    .prepare('SELECT profile, full_name FROM users WHERE id = ?')
    .bind(payload.sub)
    .first<{ profile: string; full_name: string }>();

  if (!user) return errorResponse('User tidak ditemukan', 404);

  const profile = JSON.parse(user.profile || '{}');

  if (typeof body.bio === 'string') profile.bio = body.bio.slice(0, 500);
  if (typeof body.school === 'string') profile.school = body.school.slice(0, 120);
  if (typeof body.grade === 'string') profile.grade = body.grade.slice(0, 50);
  if (typeof body.birth_date === 'string') profile.birth_date = body.birth_date;

  await c.env.LEARNER_DB
    .prepare('UPDATE users SET profile = ?, updated_at = ? WHERE id = ?')
    .bind(JSON.stringify(profile), now(), payload.sub)
    .run();

  const cleanFullName = body.full_name ? sanitizeString(body.full_name) : '';
  if (cleanFullName.length >= 2) {
    await c.env.LEARNER_DB
      .prepare('UPDATE users SET full_name = ?, updated_at = ? WHERE id = ?')
      .bind(cleanFullName, now(), payload.sub)
      .run();
  }

  return successResponse('Profil berhasil diupdate', { profile });
});

async function requireAuthWorker(request: Request, jwtSecret: string) {
  const token = extractToken(request);
  if (!token) return null;
  return verifyToken(token, jwtSecret);
}

export default auth;
