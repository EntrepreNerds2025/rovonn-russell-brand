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
supabase secrets set PLAYBOOK_PDF_URL=...
supabase secrets set PROMPT_CODES_PDF_URL=...
supabase secrets set CALENDLY_URL=...
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
