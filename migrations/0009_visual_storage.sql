-- Migration: 0009_visual_storage.sql
-- Learner AI - Mind Map & Diagram generator storage

-- Simpanan mind map hasil generate user
CREATE TABLE IF NOT EXISTS user_mind_maps (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  topic TEXT,
  nodes TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'ai',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_mind_maps_user ON user_mind_maps(user_id);

-- Simpanan diagram (mermaid) hasil generate user
CREATE TABLE IF NOT EXISTS user_diagrams (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'flowchart',
  mermaid TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_diagrams_user ON user_diagrams(user_id);
