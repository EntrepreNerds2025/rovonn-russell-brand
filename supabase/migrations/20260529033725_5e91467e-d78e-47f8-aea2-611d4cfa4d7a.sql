
-- THE EDGE submissions
CREATE TABLE IF NOT EXISTS public.edge_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  business_description TEXT NOT NULL,
  time_eater TEXT NOT NULL,
  stalled_project TEXT NOT NULL,
  ai_status TEXT NOT NULL CHECK (ai_status IN ('defense', 'watching', 'offense')),
  business_url TEXT,
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,
  source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
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

GRANT INSERT ON public.edge_submissions TO anon;
GRANT INSERT ON public.edge_submissions TO authenticated;
GRANT ALL ON public.edge_submissions TO service_role;

ALTER TABLE public.edge_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anonymous can insert edge submissions"
  ON public.edge_submissions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Authenticated can insert edge submissions"
  ON public.edge_submissions FOR INSERT TO authenticated WITH CHECK (true);

-- PROMPT CODES subscribers
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

GRANT INSERT ON public.prompt_codes_subscribers TO anon;
GRANT INSERT ON public.prompt_codes_subscribers TO authenticated;
GRANT ALL ON public.prompt_codes_subscribers TO service_role;

ALTER TABLE public.prompt_codes_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anonymous can subscribe to prompt codes"
  ON public.prompt_codes_subscribers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Authenticated can subscribe to prompt codes"
  ON public.prompt_codes_subscribers FOR INSERT TO authenticated WITH CHECK (true);

-- PLAYBOOK subscribers
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

GRANT INSERT ON public.playbook_subscribers TO anon;
GRANT INSERT ON public.playbook_subscribers TO authenticated;
GRANT ALL ON public.playbook_subscribers TO service_role;

ALTER TABLE public.playbook_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anonymous can subscribe to playbook"
  ON public.playbook_subscribers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Authenticated can subscribe to playbook"
  ON public.playbook_subscribers FOR INSERT TO authenticated WITH CHECK (true);
