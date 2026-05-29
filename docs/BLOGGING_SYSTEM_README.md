# Blogging System - What was built

Everything below ships in this PR. Treat it as the v1 of the 10/10 production blogging system for rovonnrussell.com/blog.

## Documents (in `docs/`)

- `VOICE_REFERENCE.md` - voice calibrated from 21 real LinkedIn posts. Includes a new "Where the voice comes from" section covering Toronto, Black community, Caribbean roots, community-organizer instincts, builder identity. The 15 AI Agents post is treated as anti-example throughout.
- `EDITORIAL_CALENDAR.md` - 24 posts mapped across 5 categories (Building in Public, Storytelling, Systems & Agents, Community/Culture, ADAPT in Practice). Each row has primary audience, keyword target, and a one-line angle hook in voice.
- `PRE_PUBLISH_CHECKLIST.md` - 7-section checklist with hard gates on forbidden patterns (em dashes, formulaic listicle headers, "leverage" as verb, generic AI hype, etc.) and pass/fail criteria for voice, structure, audience, SEO, distribution-readiness, and gut-check.
- `SEO_KEYWORD_MAP.md` - primary + secondary keywords per category, search-intent notes, internal-link clusters, and a keyword-to-post matrix tying each calendar post to a search target.
- `BLOG_METRICS.md` - events emitted, what to watch weekly/monthly/quarterly, dashboard query plan, health thresholds.
- `BLOG_MIGRATION.md` - playbook for moving from blog.rovonnrussell.com (subdomain) to rovonnrussell.com/blog (subdirectory). 301 redirects, sitemap and Search Console steps, validation checklist.
- `SAMPLE_POST_DRAFT.md` - sample post in voice ("Why I run three brands instead of one"). Marked `published: false`. The user is meant to mark it up against the voice doc and feed corrections back.

## Skills (in `skills/`)

- `rr-blog-writer/SKILL.md` - canonical drafting skill. Loads voice + calendar + checklist + SEO map. Workflow: confirm post -> find the moment -> draft -> frontmatter -> self-check -> save MDX. Fails posts that don't have a real opening moment.
- `rr-distribute/SKILL.md` - distribution skill. Takes a published post and produces LinkedIn (1200â€“1800 char), X thread (4â€“6 tweets), newsletter (600â€“900 words), and Pinterest pin description.

To activate the skills in Cowork mode, copy each skill folder into:
```
C:\Users\Rovonn\AppData\Roaming\Claude\local-agent-mode-sessions\skills-plugin\aa2dcd05-3285-47ca-9040-541f80b6b5a0\daf82c96-6ca2-475a-a979-fd08ab6da140\skills\
```

## Site infrastructure

- `content/blog/` - directory for markdown blog posts. The sample post is here (`why-i-run-three-brands-instead-of-one.md`, `published: false`).
- `src/lib/blog.ts` - data layer. Loads posts via Vite's `import.meta.glob`, parses YAML frontmatter, computes reading time, exposes `getAllPosts`, `getPostBySlug`, `getPostsByCategory`, `getRelatedPosts`, `getCategoryCounts`.
- `src/pages/Blog.tsx` - `/blog` index. Featured post + grid. Empty state when no posts published.
- `src/pages/BlogPost.tsx` - `/blog/:slug`. Full post layout, FAQ JSON-LD schema, related posts, post-bottom CTAs to kit and Work With Me. Fires `blog_post_viewed`, `blog_scroll_50`, `blog_scroll_90`, `blog_cta_click` events.
- `src/pages/BlogCategory.tsx` - `/blog/category/:slug`. Category landing with blurb and post grid.
- `src/components/blog/` - `PostCard`, `CategoryNav`, `MarkdownContent` (with rehype-slug + autolink-headings), `FAQSection` (with JSON-LD schema injection), `RelatedPosts`.
- `src/components/BlogRedirect.tsx` - client-side redirect from `/blogs` -> `/blog`.
- `public/_redirects` - hosting-layer redirects for the `/blogs/*` -> `/blog/*` migration.
- `scripts/build-rss.mjs` - RSS feed generator. Wired into `npm run build`. Outputs to `public/rss.xml`.

## Routing changes

- `src/App.tsx` adds `/blog`, `/blog/category/:categorySlug`, `/blog/:slug`, plus `/blogs` and `/blogs/:slug` redirects.
- `src/components/Navbar.tsx` replaces the Articles -> blog.rovonnrussell.com external link with a `Blog` -> `/blog` internal link.
- `src/components/Footer.tsx` updated to link `/blog` instead of the subdomain.
- `src/pages/Index.tsx` - Latest Articles section now pulls from `getAllPosts()` and links to `/blog/:slug`. Shows an empty-state CTA to the kit when no posts are published.

## New dependencies (added to package.json)

Runtime: `js-yaml`, `react-markdown`, `reading-time`, `rehype-autolink-headings`, `rehype-slug`, `remark-gfm`.
Dev: `@types/js-yaml`.

The `@tailwindcss/typography` plugin is now wired into `tailwind.config.ts` (was already in devDependencies).

## What to do next

1. **Run `npm install`** to pick up the new dependencies.
2. **Run `npm run build`** to confirm the build is clean and check `public/rss.xml` is generated.
3. **Read the sample post** (`docs/SAMPLE_POST_DRAFT.md` and `content/blog/why-i-run-three-brands-instead-of-one.md`). Mark anything that doesn't sound like you. Send the markup back so the voice doc can be updated.
4. **Copy the skills** into the Cowork user-skills folder (path above).
5. **Configure subdomain redirects** at the hosting / DNS layer per `docs/BLOG_MIGRATION.md`.
6. **Flip `published: true`** on the sample post when it's voice-validated. Then `npm run build` regenerates RSS and the `/blog` index renders the post.
7. **Record a 10-minute voice memo** about something you're working through right now - a moment from this week, a frustration, an observation. Send it as audio. The transcript goes into `VOICE_REFERENCE.md` as raw quotes that anchor the voice further.

## What's NOT in this PR

- Actual hosting-level redirects from `blog.rovonnrussell.com` (configured at Lovable / Cloudflare, not in code).
- Photographs / hero images for posts - uses placeholder paths; first real post needs a hero image at `public/blog/<slug>/hero.jpg`.
- Newsletter platform integration (Beehiiv) - separate workstream.
- The post-publish workflow automation (right now you ship manually, run `rr-distribute` for the social pack, then schedule).

## Health check

After deploying, validate:

- [ ] `rovonnrussell.com/blog` loads
- [ ] `rovonnrussell.com/rss.xml` returns valid XML (regenerated on every build)
- [ ] The Navbar's "Blog" link goes to `/blog` not the old subdomain
- [ ] `Index.tsx` Latest Articles section shows the empty state initially, switches to real posts when published
- [ ] When the sample post is `published: true`, `/blog/why-i-run-three-brands-instead-of-one` renders
- [ ] FAQ accordion at the bottom of the post works
- [ ] FAQ JSON-LD schema is present in `<head>` (inspect element)
- [ ] `/blogs` redirects to `/blog`
