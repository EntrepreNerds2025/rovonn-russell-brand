-- Personal brand bookings system migration.
-- Ported from Impact Loop's booking_leads pattern with founder-facing call types.

CREATE TABLE IF NOT EXISTS public.booking_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_website TEXT,
  business_size TEXT,
  challenge_type TEXT NOT NULL,
  referral_source TEXT,
  pre_call_answers JSONB,
  call_type TEXT NOT NULL CHECK (call_type IN ('edge-followup', 'advisory-discovery', 'speaking-inquiry', 'adapt-sprint-intro')),
  call_duration_min INTEGER NOT NULL CHECK (call_duration_min > 0 AND call_duration_min <= 180),
  scheduled_at TIMESTAMPTZ,
  google_event_id TEXT,
  meeting_link TEXT,
  status TEXT NOT NULL DEFAULT 'intake_complete' CHECK (status IN ('intake_complete', 'booked', 'completed', 'cancelled', 'no_show')),
  cancel_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  cancel_reason TEXT,
  reminder_sent_at TIMESTAMPTZ,
  brief_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT booked_requires_schedule CHECK (
    (status <> 'booked') OR (scheduled_at IS NOT NULL)
  )
);

ALTER TABLE public.booking_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert on booking_leads"
ON public.booking_leads
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Service role has full access"
ON public.booking_leads
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_booking_leads_status_scheduled
ON public.booking_leads (status, scheduled_at);

CREATE INDEX IF NOT EXISTS idx_booking_leads_email
ON public.booking_leads (email);

CREATE INDEX IF NOT EXISTS idx_booking_leads_cancel_token
ON public.booking_leads (cancel_token);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_booking_leads_booked_slot
ON public.booking_leads (scheduled_at)
WHERE status = 'booked' AND scheduled_at IS NOT NULL;

CREATE OR REPLACE FUNCTION public.update_booking_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_booking_leads_updated_at ON public.booking_leads;
CREATE TRIGGER update_booking_leads_updated_at
  BEFORE UPDATE ON public.booking_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_booking_leads_updated_at();

-- Optional: business hours / availability config table
-- Lets you tune availability without code deploys.
CREATE TABLE IF NOT EXISTS public.booking_availability_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  timezone TEXT NOT NULL DEFAULT 'America/Toronto',
  weekly_hours JSONB NOT NULL DEFAULT '{"mon":["10:00","17:00"],"tue":["10:00","17:00"],"wed":["10:00","17:00"],"thu":["10:00","17:00"],"fri":["10:00","15:00"]}'::jsonb,
  buffer_before_min INTEGER NOT NULL DEFAULT 15,
  buffer_after_min INTEGER NOT NULL DEFAULT 15,
  slot_step_min INTEGER NOT NULL DEFAULT 30,
  min_notice_hours INTEGER NOT NULL DEFAULT 12,
  max_notice_days INTEGER NOT NULL DEFAULT 14,
  blocked_dates DATE[] DEFAULT '{}',
  -- "Seems busy" mode: deterministically hide a percentage of slots per day so the
  -- calendar looks lived-in. 0.0 disables. 0.3 hides ~30% per day. Same slots stay
  -- hidden across page refreshes because the random seed is the date string.
  seems_busy_ratio NUMERIC(3,2) NOT NULL DEFAULT 0.30 CHECK (seems_busy_ratio >= 0 AND seems_busy_ratio <= 0.8),
  seems_busy_salt TEXT NOT NULL DEFAULT 'rovonn',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.booking_availability_config (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.booking_availability_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages availability config"
ON public.booking_availability_config
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
