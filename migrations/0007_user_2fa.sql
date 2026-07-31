-- Migration: 0007_user_2fa.sql
-- Learner AI - TOTP 2FA table (referenced by src/api/auth/index.ts but never created)

CREATE TABLE IF NOT EXISTS user_2fa (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  totp_secret TEXT,
  totp_enabled INTEGER NOT NULL DEFAULT 0,
  backup_codes TEXT DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_2fa_user ON user_2fa(user_id);
