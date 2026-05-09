-- ─────────────────────────────────────────────────────────────────────────────
-- Supabase SQL — leads table
-- Run this in: Supabase Dashboard → SQL Editor → New query → Paste → Run
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.leads (
  id                    UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  email                 TEXT          NOT NULL,
  company_name          TEXT,
  role                  TEXT,
  audit_id              UUID          REFERENCES public.audits(id) ON DELETE SET NULL,
  total_monthly_savings NUMERIC       DEFAULT 0,
  tools_audited         TEXT[]        DEFAULT '{}',
  is_high_savings       BOOLEAN       DEFAULT FALSE,
  created_at            TIMESTAMPTZ   DEFAULT NOW()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS leads_email_idx
  ON public.leads (email);

CREATE INDEX IF NOT EXISTS leads_is_high_savings_idx
  ON public.leads (is_high_savings);

CREATE INDEX IF NOT EXISTS leads_created_at_idx
  ON public.leads (created_at DESC);

-- ─── Row-Level Security ───────────────────────────────────────────────────────
-- Disabled for MVP. Enable and add policies before production.

ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
