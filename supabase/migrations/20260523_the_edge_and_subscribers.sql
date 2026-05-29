-- Supabase migration: The Edge submissions + Prompt Codes subscribers
-- Generated: 2026-05-23
-- Drop into Supabase SQL Editor and run, or save as a Supabase migration file.

-- ============================================
-- THE EDGE: form submissions table
-- ============================================
CREATE TABLE IF NOT EXISTS public.edge_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Form fields
  business_description TEXT NOT NULL,
  time_eater TEXT NOT NULL,
  stalled_project TEXT NOT NULL,
  ai_status TEXT NOT NULL CHECK (ai_status IN ('defense', 'watching', 'offense')),
  business_url TEXT,
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,

  -- Source attribution
  source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  -- Workflow tracking
  acknowledgment_sent_at TIMESTAMPTZ,
  briefing_generated_at TIMESTAMPTZ,
  briefing_doc_url TEXT,
  briefing_content TEXT,
  response_sent_at TIMESTAMPTZ,
  call_booked_at TIMESTAMPTZ,
  call_completed_at TIMESTAMPTZ,
  converted_to_advisory BOOLEAN DEFAULT FALSE,

  internal_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_edge_email ON public.edge_submissions (email);
CREATE INDEX IF NOT EXISTS idx_edge_status ON public.edge_submissions (ai_status);
CREATE INDEX IF NOT EXISTS idx_edge_created ON public.edge_submissions (created_at DESC);

-- ============================================
-- PROMPT CODES: subscriber list
-- ============================================
CREATE TABLE IF NOT EXISTS public.prompt_codes_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,

  source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  pdf_sent_at TIMESTAMPTZ,
  nurture_day_2_sent_at TIMESTAMPTZ,
  nurture_day_4_sent_at TIMESTAMPTZ,
  nurture_day_7_sent_at TIMESTAMPTZ,
  nurture_day_14_sent_at TIMESTAMPTZ,

  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_codes_email ON public.prompt_codes_subscribers (email);
CREATE INDEX IF NOT EXISTS idx_codes_created ON public.prompt_codes_subscribers (created_at DESC);

-- ============================================
-- ADAPT PLAYBOOK: subscriber list
-- ============================================
CREATE TABLE IF NOT EXISTS public.playbook_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,

  source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  pdf_sent_at TIMESTAMPTZ,
  nurture_day_2_sent_at TIMESTAMPTZ,
  nurture_day_4_sent_at TIMESTAMPTZ,
  nurture_day_7_sent_at TIMESTAMPTZ,
  nurture_day_14_sent_at TIMESTAMPTZ,

  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_playbook_email ON public.playbook_subscribers (email);
CREATE INDEX IF NOT EXISTS idx_playbook_created ON public.playbook_subscribers (created_at DESC);

-- ============================================
-- Row Level Security
-- ============================================
-- Lock down for anonymous read. Only the service role (backend) can read.
-- Anonymous can INSERT (form submissions) but not SELECT.

ALTER TABLE public.edge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_codes_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbook_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert on edge_submissions"
  ON public.edge_submissions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on prompt_codes_subscribers"
  ON public.prompt_codes_subscribers FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on playbook_subscribers"
  ON public.playbook_subscribers FOR INSERT
  TO anon
  WITH CHECK (true);

-- (Service role bypasses RLS automatically. Use service_role key for the
-- Edge function reads and writes to update workflow status fields.)
