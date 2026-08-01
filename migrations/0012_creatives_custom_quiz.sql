-- Migration: 0012_creatives_custom_quiz.sql
-- Learner AI - Creatives editor, Custom Quiz, dan upgrade sertifikat:
--   * tabel creative_designs (desain Canva-like) & creative_assets (upload logo/gambar/background/dll)
--   * tabel custom_quizzes (quiz buatan pengguna, 7 tipe soal)
--   * kolom kategori sertifikat

CREATE TABLE IF NOT EXISTS creative_designs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'design',
  type TEXT NOT NULL DEFAULT 'design',
  design TEXT NOT NULL,
  width INTEGER NOT NULL DEFAULT 1200,
  height INTEGER NOT NULL DEFAULT 800,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS creative_assets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'image',
  name TEXT NOT NULL,
  data TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS custom_quizzes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  questions TEXT NOT NULL,
  timer_minutes INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_creative_designs_user ON creative_designs(user_id);
CREATE INDEX IF NOT EXISTS idx_creative_assets_user ON creative_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_quizzes_user ON custom_quizzes(user_id);
