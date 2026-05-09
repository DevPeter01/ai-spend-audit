-- ─────────────────────────────────────────────────────────────────────────────
-- Supabase SQL — add ai_summary column to audits
-- Run this in: Supabase Dashboard → SQL Editor → New query → Paste → Run
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.audits
  ADD COLUMN IF NOT EXISTS ai_summary TEXT;
