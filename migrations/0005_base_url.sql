-- Migration: 0005_base_url.sql
-- Learner AI - Custom endpoint per API key (OmniRoute local, dll)

ALTER TABLE api_keys ADD COLUMN base_url TEXT;
