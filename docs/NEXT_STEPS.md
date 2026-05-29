# Next Steps - 10/10 Blogging System

Saved 2026-05-04. Run these in order.

1. **Install + build.** `npm install && npm run build` from the `rovonn-russell-brand` repo to confirm everything compiles. The build also generates `public/rss.xml` automatically.

2. **Activate the skills.** Copy these two folders into your Cowork user-skills directory:
   - `rovonn-russell-brand/skills/rr-blog-writer/`
   - `rovonn-russell-brand/skills/rr-distribute/`

   Destination:
   ```
   C:\Users\Rovonn\AppData\Roaming\Claude\local-agent-mode-sessions\skills-plugin\aa2dcd05-3285-47ca-9040-541f80b6b5a0\daf82c96-6ca2-475a-a979-fd08ab6da140\skills\
   ```

3. **Voice-validate the sample post.** Read `docs/SAMPLE_POST_DRAFT.md` ("Why I run three brands instead of one") and mark up anything that doesn't sound like you. Send the markup back so the voice doc gets calibrated against your actual reactions, not just inferences from LinkedIn posts.

4. **Optional but high-value: voice memo.** Record a 10-minute voice memo about something you're working through right now - a moment from this week, a frustration, an observation. Send it as audio. The transcript becomes anchor quotes inside `docs/VOICE_REFERENCE.md` and tightens the voice further.

5. **Migrate the blog and ship.** Configure the subdomain 301 redirects per `docs/BLOG_MIGRATION.md`, flip the sample post's `published: true`, and run `PUSH-TO-GITHUB.bat` from the repo root.
