# Deployment

This site deploys from GitHub through Lovable. Supabase owns the database tables and Edge Functions for The Edge and the resource downloads.

## 1. Run the Supabase migration

Open the Supabase SQL Editor for the personal brand project.

Copy the full contents of:

```text
supabase/migrations/20260523_the_edge_and_subscribers.sql
```

Paste it into the SQL Editor and click Run.

This creates:

- `edge_submissions`
- `prompt_codes_subscribers`
- `playbook_subscribers`

## 2. Deploy the Edge Functions

From the project root:

```bash
supabase functions deploy process-edge-submission
supabase functions deploy subscribe-to-list
```

Set the function secrets in Supabase:

```bash
supabase secrets set ANTHROPIC_API_KEY=...
supabase secrets set RESEND_API_KEY=...
supabase secrets set FIRECRAWL_API_KEY=...
supabase secrets set ROVONN_EMAIL=...
supabase secrets set EDGE_NOTIFICATION_EMAIL=rovonnrussell@gmail.com
supabase secrets set PLAYBOOK_PDF_URL=...
supabase secrets set PROMPT_CODES_PDF_URL=...
supabase secrets set BOOKING_URL=...
supabase secrets set IMPACT_OS_EDGE_WEBHOOK_URL=...
supabase secrets set IMPACT_OS_EDGE_WEBHOOK_TOKEN=...
```

Supabase also provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions. If your project does not expose them automatically, add them as secrets too.

## 3. Frontend environment variable

Set this in Lovable and in `.env.local` for local development:

```env
VITE_SUPABASE_FUNCTIONS_URL=https://<project-ref>.supabase.co/functions/v1
```

For this project, replace `<project-ref>` with the Supabase project ref.

## 4. Local verification

```bash
npm run lint
npm run build
```

## 5. Bookings deployment

The custom booking system replaces Calendly for the personal brand site. It powers `/book`, `/bookings`, `/booking-confirmed`, and `/cancel-booking`.

### Run the bookings migration

Open the Supabase SQL Editor and paste the full contents of:

```text
supabase/migrations/20260528_bookings.sql
```

Click Run.

This creates:

- `booking_leads`
- `booking_availability_config`

### Deploy the booking Edge Functions

From the project root:

```bash
supabase functions deploy get-availability --no-verify-jwt
supabase functions deploy create-booking-lead --no-verify-jwt
supabase functions deploy create-booking
supabase functions deploy cancel-booking
supabase functions deploy booking-scheduler-sweep --no-verify-jwt
```

`--no-verify-jwt` is needed for the public-facing functions and the cron-triggered sweep. `create-booking` and `cancel-booking` should require auth in production. For now they are open.

### Set Supabase Edge Function secrets

Set these in Supabase Dashboard, Edge Functions, Secrets:

```text
SUPABASE_URL=auto
SUPABASE_SERVICE_ROLE_KEY=auto
RESEND_API_KEY=...
ROVONN_EMAIL=rovonn@rovonnrussell.com
EDGE_NOTIFICATION_EMAIL=rovonnrussell@gmail.com
MEETING_LINK_BASE=your default Google Meet URL
BOOKING_URL=https://rovonnrussell.com/book?type=edge-followup
ANTHROPIC_API_KEY=...
FIRECRAWL_API_KEY=...
PLAYBOOK_PDF_URL=...
PROMPT_CODES_PDF_URL=...
IMPACT_OS_EDGE_WEBHOOK_URL=https://your-public-tunnel.example.com/api/blueprint-lab/edge-webhook
IMPACT_OS_EDGE_WEBHOOK_TOKEN=choose-a-long-random-token
```

`ANTHROPIC_API_KEY`, `FIRECRAWL_API_KEY`, `PLAYBOOK_PDF_URL`, and `PROMPT_CODES_PDF_URL` are also used by the existing Edge submission and download functions.

`IMPACT_OS_EDGE_WEBHOOK_URL` is optional. When set, every completed Edge briefing triggers the Impact OS Blueprint Lab so the DeepSeek research agents start a full background report. Because Impact OS is desktop-first, this URL needs to be a public tunnel or hosted endpoint that can reach your local sidecar.

Set the same token in Impact OS Desktop:

```env
EDGE_WEBHOOK_TOKEN=choose-a-long-random-token
```

The Edge Function sends the token as `x-impact-os-token`.

### Schedule the booking sweep

Option A: `pg_cron`, best because it runs inside Supabase. In SQL Editor:

```sql
SELECT cron.schedule(
  'booking-scheduler-sweep',
  '*/20 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://<project-ref>.supabase.co/functions/v1/booking-scheduler-sweep',
    headers := '{"Authorization": "Bearer <SUPABASE_ANON_KEY>"}'::jsonb
  );
  $$
);
```

Replace `<project-ref>` and `<SUPABASE_ANON_KEY>`. This runs every 20 minutes.

Option B: external cron. Use cron-job.org, GitHub Actions, or another scheduler to hit the function URL every 20 minutes. This is simpler but adds an external dependency.

### Seems busy tuning

The `booking_availability_config` table has a `seems_busy_ratio` column. The default is `0.30`, which hides about 30 percent of open slots per day.

To change it:

```sql
UPDATE booking_availability_config SET seems_busy_ratio = 0.40 WHERE id = 1;
```

Set it to `0` to disable entirely:

```sql
UPDATE booking_availability_config SET seems_busy_ratio = 0 WHERE id = 1;
```

Hidden slots are deterministic per date and salt. Refreshing the page shows the same hidden slots for that day. To rotate which slots appear hidden:

```sql
UPDATE booking_availability_config SET seems_busy_salt = 'rovonn-2026-05-29' WHERE id = 1;
```

### Lovable frontend environment variable

Add this to Lovable environment variables:

```env
VITE_SUPABASE_FUNCTIONS_URL=https://<project-ref>.supabase.co/functions/v1
```
