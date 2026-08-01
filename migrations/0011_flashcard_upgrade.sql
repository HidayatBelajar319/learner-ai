-- Migration: 0011_flashcard_upgrade.sql
-- Learner AI - Flashcards upgrade:
--   * tautkan kartu ke deck (deck_id)
--   * kolom favorit (is_favorite)
--   * ikon/logo deck (icon)
--   * backfill kartu lama (deck_id NULL) ke deck dengan subject yang sama

ALTER TABLE flashcards ADD COLUMN deck_id TEXT;
ALTER TABLE flashcards ADD COLUMN is_favorite INTEGER NOT NULL DEFAULT 0;
ALTER TABLE flashcard_decks ADD COLUMN icon TEXT NOT NULL DEFAULT '🃏';

CREATE INDEX IF NOT EXISTS idx_flashcards_deck ON flashcards(deck_id);

-- Backfill: kartu lama ditautkan ke deck terbaru yang memiliki subject sama
UPDATE flashcards
SET deck_id = (
  SELECT d.id
  FROM flashcard_decks d
  WHERE d.user_id = flashcards.user_id AND d.subject = flashcards.subject
  ORDER BY d.updated_at DESC
  LIMIT 1
)
WHERE deck_id IS NULL;
