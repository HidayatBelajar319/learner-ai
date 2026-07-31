-- Migration: 0008_account_admin.sql
-- Learner AI - Admin delete/deactivate account with reason

-- Alasan nonaktifkan akun (users.is_active = 0)
ALTER TABLE users ADD COLUMN inactive_reason TEXT;

-- Riwayat akun yang dihapus admin (untuk pesan saat login/me)
CREATE TABLE IF NOT EXISTS user_deletions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  reason TEXT NOT NULL,
  deleted_by TEXT,
  deleted_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_deletions_email ON user_deletions(email);
CREATE INDEX IF NOT EXISTS idx_user_deletions_user ON user_deletions(user_id);
