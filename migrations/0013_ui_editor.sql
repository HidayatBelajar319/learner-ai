-- Migration: 0013_ui_editor.sql
-- Learner AI - AI UI Editor:
--   * tabel user_ui_settings (pengaturan UI runtime per user: warna aksen, sidebar, font)
--   * tabel ui_custom_pages (halaman kustom yang dibuat AI / manual untuk menu sidebar)

CREATE TABLE IF NOT EXISTS user_ui_settings (
  user_id TEXT PRIMARY KEY,
  settings TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ui_custom_pages (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📄',
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ui_pages_user ON ui_custom_pages(user_id);
