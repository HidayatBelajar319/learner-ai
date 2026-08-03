-- Migration: 0014_performance_indexes.sql
-- Learner AI - Fase 4 (Optimasi): indeks tambahan untuk query yang sering dipakai
-- (daftar konten, statistik dashboard, riwayat, flashcards, desain, quiz kustom).

-- Konten & daftar materi
CREATE INDEX IF NOT EXISTS idx_content_subject_level ON content(subject, level);

-- Riwayat belajar & dashboard
CREATE INDEX IF NOT EXISTS idx_learning_history_user_time ON learning_history(user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_time ON learning_sessions(user_id, started_at);

-- Progress user
CREATE INDEX IF NOT EXISTS idx_user_progress_user_time ON user_progress(user_id, last_accessed);

-- Sertifikat
CREATE INDEX IF NOT EXISTS idx_certificates_user_time ON certificates(user_id, issued_at);

-- Flashcards (deck & favorit)
CREATE INDEX IF NOT EXISTS idx_flashcards_user_favorite ON flashcards(user_id, is_favorite);
CREATE INDEX IF NOT EXISTS idx_flashcards_user_review ON flashcards(user_id, next_review);

-- API keys (pencarian kandidat provider)
CREATE INDEX IF NOT EXISTS idx_api_keys_user_active ON api_keys(user_id, is_active);

-- Desain kreatif (urutan terbaru di galeri)
CREATE INDEX IF NOT EXISTS idx_creative_designs_user_time ON creative_designs(user_id, updated_at);

-- Quiz kustom
CREATE INDEX IF NOT EXISTS idx_custom_quizzes_user_time ON custom_quizzes(user_id, updated_at);

-- Halaman kustom & UI
CREATE INDEX IF NOT EXISTS idx_ui_pages_user_time ON ui_custom_pages(user_id, updated_at);

-- Mind map & diagram
CREATE INDEX IF NOT EXISTS idx_user_mind_maps_user_time ON user_mind_maps(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_user_diagrams_user_time ON user_diagrams(user_id, created_at);
