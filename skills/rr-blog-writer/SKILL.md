---
name: rr-blog-writer
description: Write a blog post for rovonnrussell.com/blog in Rovonn's calibrated voice. Use whenever the user wants to draft, create, or write a blog post for the personal brand site (rovonnrussell.com). Triggers on phrases like "write a blog post for the personal brand", "draft post #N from the calendar", "write a blog post about [topic]", "draft something for rovonnrussell.com/blog", "write a Building in Public post", "write a Storytelling post", "write a Systems & Agents post", "write a Community/Culture post", "write an ADAPT in Practice post". This is the canonical skill for the personal brand blog — supersedes rr-essay, rr-personal-story, and rr-framework-breakdown for any post going to rovonnrussell.com/blog (the subdirectory blog, not the old subdomain).
---

# rr-blog-writer

The canonical skill for writing blog posts on rovonnrussell.com/blog. Loads the voice reference, editorial calendar, pre-publish checklist, and SEO keyword map, then drafts an MDX post that conforms to all four.

This skill replaces the older rr-essay / rr-personal-story / rr-framework-breakdown skills for posts going to the new subdirectory blog (rovonnrussell.com/blog). Those skills targeted the old subdomain and were calibrated against a single AI-written post that misrepresented Rovonn's voice. This skill is calibrated against 21 real LinkedIn posts.

## Installation

This SKILL.md ships in the repo at `rovonn-russell-brand/skills/rr-blog-writer/`. To activate it for Cowork mode, copy the `rr-blog-writer/` folder into the user-level skills directory:

```
C:\Users\Rovonn\AppData\Roaming\Claude\local-agent-mode-sessions\skills-plugin\aa2dcd05-3285-47ca-9040-541f80b6b5a0\daf82c96-6ca2-475a-a979-fd08ab6da140\skills\
```

Once copied, Cowork will pick it up automatically on the next session.

## When this skill runs

Trigger this skill any time the user says they want to draft a blog post for the personal brand. If the user names a topic or a calendar post number, take it directly. If they don't, surface the editorial calendar first and ask which one.

Do NOT trigger this skill for:
- Impact Loop blog posts (use `il-*` skills)
- IL Foundation posts (use `ilf-*` skills)
- Dream Streams posts (use `ds-*` skills)
- Posts on the old `blog.rovonnrussell.com` subdomain (those are being migrated; new posts always go to the subdirectory)

## Required reading before drafting

Before writing a single line, read these four files from the repo:

1. `C:\Users\Rovonn\OneDrive\Desktop\Claude Work\Personal Brand - Rovonn Russell\rovonn-russell-brand\docs\VOICE_REFERENCE.md`
2. `C:\Users\Rovonn\OneDrive\Desktop\Claude Work\Personal Brand - Rovonn Russell\rovonn-russell-brand\docs\EDITORIAL_CALENDAR.md`
3. `C:\Users\Rovonn\OneDrive\Desktop\Claude Work\Personal Brand - Rovonn Russell\rovonn-russell-brand\docs\PRE_PUBLISH_CHECKLIST.md`
4. `C:\Users\Rovonn\OneDrive\Desktop\Claude Work\Personal Brand - Rovonn Russell\rovonn-russell-brand\docs\SEO_KEYWORD_MAP.md`

These are the four sources of truth. The voice doc supersedes anything you remember about Rovonn's writing from prior conversations. The calendar supplies the topic. The checklist tells you what the draft must satisfy. The keyword map tells you what to optimize for.

## Workflow

### Step 1 — Confirm the post

Ask the user one of:
- "Which post from the editorial calendar — by number or topic?"
- "Or do you have a fresh topic? If so, what's the moment that prompted it?"

If the user supplies a calendar number, read that row. If a fresh topic, pull the closest category from the calendar and use the matching SEO cluster.

### Step 2 — Find the moment

Before writing, surface the moment. Ask:
- "What's the specific observation that opens this post? A Tuesday, a conversation, a project that just shipped, a thing a founder said?"
- "Who or what gets named? People, places, organizations, tools, weeks?"

If the user can't name a real moment, do not draft generically. Either:
- Suggest a real moment from prior context (Impact Loop projects, ADAPT cycles, agents shipped, community work, conversations the user has mentioned).
- Or push back: "We don't have a moment yet. Want to take ten minutes to story-capture before drafting?"

A post without a real opening moment will fail the voice gates. Don't ship one.

### Step 3 — Draft

Follow the structure from `VOICE_REFERENCE.md`:

- **Opening (1–3 paragraphs):** observation. Set the scene. Name specifics. Don't reveal the thesis yet.
- **Sections (3–5 H2 anchor headings):** sentence-style headers, never formulaic ("5 Ways to X").
- **Body:** mix short and long paragraphs. Use signature phrases naturally ("What stood out most was...", "Walking away, I'm reminded that...", "Big respect to..."). Use "not X, but Y" contrasts where they earn their place. Use tricolons where three is the right number, not because three sounds good.
- **Close:** credit-giving and forward-looking. Names the people / partners / experiences the post draws from. Final sentence points at what's next.
- **FAQ block:** 4–8 plain-language questions someone would Google, with direct answers in voice. Used for SEO and AI search.

Word count: 800–1,500. Hard cap. If it wants to go longer, it should be split into two posts.

### Step 4 — Frontmatter

Use this template exactly:

```yaml
---
title: "[Sentence-style title]"
slug: "kebab-case-slug"
date: "2026-MM-DD"
author: "rovonn-russell"
category: "Building in Public | Storytelling | Systems & Agents | Community/Culture | ADAPT in Practice"
tags: ["tag1", "tag2", "tag3"]
excerpt: "One-sentence summary in voice — what the post is actually about."
seoTitle: "[Under 60 chars, primary keyword front-loaded]"
metaDescription: "[Under 160 chars, reads like a sentence]"
heroImage: "/blog/[slug]/hero.jpg"
heroImageAlt: "[descriptive alt text]"
faq:
  - question: "Plain-language question someone would Google"
    answer: "Direct answer in voice."
  - question: "..."
    answer: "..."
published: false
---
```

Always start with `published: false`. The user flips it to true after the checklist passes.

### Step 5 — Self-check against the checklist

Before handing the draft over, run through `PRE_PUBLISH_CHECKLIST.md` mentally and report which gates the draft passes and which need work. Be honest. The checklist exists so AI-flavored content doesn't ship under Rovonn's name. If the draft fails three or more gates, redraft instead of handing it over.

Specifically check Section 2 (Forbidden patterns) line by line:
- No em dashes anywhere in body copy
- No "In today's fast-paced world..."
- No "The most important lesson is this:" patterns
- No formulaic listicle headers
- No "leverage" as a verb
- No generic AI-hype language
- No rule-of-three for everything (vary)
- No "we" when it should be "I"
- No fabricated specifics
- No copy-pasted phrasing from earlier posts

Any single forbidden-pattern hit = automatic fail = redraft that section.

### Step 6 — Save the draft

Write the MDX file to:
```
C:\Users\Rovonn\OneDrive\Desktop\Claude Work\Personal Brand - Rovonn Russell\rovonn-russell-brand\content\blog\<slug>.mdx
```

Confirm to the user the file path, the calendar post number it satisfies (if applicable), and which gates the draft passes. If any gates need user input (e.g., the user needs to verify a specific anonymized client is OK to reference), flag those clearly.

## Cultural specificity guardrails

Re-read the "Where the voice comes from" section in `VOICE_REFERENCE.md` before drafting any post that touches:
- Toronto, the GTA, North York, Scarborough, Etobicoke
- Black community organizing, Caribbean roots, CAFCAN, Black Health Alliance, OPTK
- Youth programs, trades programs, community-led nonprofit work
- Health equity, representation in data, donor trust

When these are in the room of the post, name them the way someone inside the community would name them. Do not generalize "underserved communities" when the post is about Black communities specifically. Do not generalize "a city" when the post is about Toronto. Specificity is the whole point.

## Length and format reference

| Section | Length |
|---|---|
| Opening | 1–3 paragraphs |
| Body sections | 3–5 sections, each 150–350 words |
| Close | 1–2 paragraphs, credit + forward-looking |
| FAQ | 4–8 questions |
| Total | 800–1,500 words |

## Anti-patterns — never do these

- Open with the thesis. (Open with the moment.)
- Em dashes anywhere in body copy.
- "In today's fast-paced world", "The most important lesson is this:", "After [N] years, I've learned...".
- Formulaic listicle headers: "5 Ways to X", "3 Mistakes I Made", "7 Tips for Y".
- Rule-of-three for everything. Vary the structure.
- Generic AI hype: "AI is transforming everything", "the future is here".
- "Leverage" as a verb. Use "draw on" or "apply".
- "We" when it should be "I". First person always unless writing about a real team moment.
- Padding to hit a word count. If the idea is done at 900 words, ship at 900.
- Closing with a sales CTA. Close with credit + forward-looking. The CTA happens via the page chrome (kit, ADAPT, Work With Me links).
- Inventing specifics. Every named person, organization, project, or tool is real or clearly anonymized.

## Reference exemplars

The voice exemplars at the bottom of `VOICE_REFERENCE.md` are the tuning fork. Re-read them before drafting. The 4 paragraphs there are from Rovonn's actual LinkedIn posts and represent the voice in its purest form.

The sample blog post at `docs/SAMPLE_POST_DRAFT.md` ("Why I run three brands instead of one") is also a reference — but treat it as a draft for review, not a finished exemplar. The user is meant to mark it up and feed corrections back into the voice doc.

## After the draft

Once the user accepts the draft:
1. They flip `published: false` to `true` in frontmatter.
2. They commit the MDX file to the repo and push.
3. They run the `rr-distribute` skill to generate LinkedIn / X / newsletter / Pinterest versions.
4. They publish the LinkedIn post on Tuesday or Friday morning, with the newsletter going out same day.

Do not run the distribution skill from inside this skill. Hand off cleanly.

## Failure modes

If you find yourself doing any of these, stop and reset:

- **Drafting without a moment.** No real observation = no real post. Push back.
- **Hitting forbidden patterns.** Re-read the forbidden-patterns list. Rewrite.
- **The voice feels generic.** Re-read the voice exemplars. Re-read the cultural specificity section. Specifics are the cure.
- **The post is mostly thesis with one anecdote at the end.** Flip the structure. Anecdote first, thesis after.
- **Every paragraph is the same length.** Vary. Short punch, long reflection, short punch.

When in doubt, read it aloud. If it sounds like Rovonn talking on a call, ship it. If it sounds like a marketing email, rewrite.
