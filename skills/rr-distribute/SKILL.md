---
name: rr-distribute
description: Take a published Rovonn Russell blog post and produce platform-specific distribution versions — LinkedIn, X thread, newsletter, and Pinterest pin. Use whenever the user wants to distribute, repurpose, syndicate, or cross-post a blog post they just published on rovonnrussell.com/blog. Triggers on phrases like "distribute this post", "make the LinkedIn version", "repurpose this for socials", "make a thread from this post", "newsletter version of this post", "make pins for this post", or "cross-post this".
---

# rr-distribute

Takes one published blog post from rovonnrussell.com/blog and produces platform-specific distribution versions that all link back to the original post. Inherits voice from the rr-blog-writer skill.

## When this skill runs

Run this skill AFTER a post has been drafted and passes the pre-publish checklist. The blog post is the canonical version. Every distribution version drives traffic back to it.

If the user asks for a LinkedIn or X version of something that isn't a blog post yet, redirect: "This sounds like it should be a blog post first, then distributed. Want me to run rr-blog-writer?"

## Required reading before drafting

Before producing distribution versions, read:

1. The blog post itself (the MDX file or rendered URL)
2. `C:\Users\Rovonn\OneDrive\Desktop\Claude Work\Personal Brand - Rovonn Russell\rovonn-russell-brand\docs\VOICE_REFERENCE.md`

The voice rules apply to every distribution surface. The translation guide section of the voice doc tells you how to shift emphasis for different audiences.

## Outputs

For every blog post, produce these four versions:

### 1. LinkedIn post

**Length:** 1,200–1,800 characters (LinkedIn's sweet spot for engagement). Hard cap at 3,000.

**Structure:**
- **Hook (first 2 lines, before the "see more"):** the strongest moment from the blog post, lifted as-is or sharpened. This is the hardest line to write. It has to make someone tap.
- **Body:** the observation → reflection → bigger picture from the blog, compressed. Cut to maybe 60% of the blog's word count for body.
- **Close:** credit-giving line + link to full post. The close on LinkedIn IS allowed to point at the blog ("Full post on the blog — link in comments" or in body if no comment-restriction).
- **CTA placement:** drop the link in the first comment, not the post body. LinkedIn deprioritizes posts with outbound links in the body.

**Voice rules carry over:**
- No em dashes
- Open with the moment, not the thesis
- Name specifics
- Signature phrases used naturally
- First person

**Hashtags:** 3–5 max, at the end. Mix of category hashtags (#Storytelling, #BuildingInPublic) and audience hashtags (#FoundersJourney, #ImpactLeaders).

### 2. X thread

**Length:** 4–6 tweets. The thread tells a smaller version of the same story.

**Structure:**
- **Tweet 1 (hook):** the opening moment from the blog, compressed to 280 chars. Must work standalone.
- **Tweet 2:** the surprise — what the moment revealed. The "what stood out was..." beat.
- **Tweets 3–5:** the 1–3 most quotable lines from the blog. One idea per tweet. Sharp.
- **Tweet 6 (final):** the close + link to full post on the blog. Format: "Full post: rovonnrussell.com/blog/[slug]"

**Constraints:**
- Each tweet stands alone if pulled from context
- No threadbait language ("a thread 🧵", "let me explain"). Just start.
- No em dashes
- First person

### 3. Newsletter version

**Length:** 600–900 words. Roughly 70% of the blog post.

**Structure:**
- **Subject line:** the strongest sentence from the blog, rephrased as a teaser. Under 60 chars. No emoji.
- **Preheader:** 80–120 char follow-up to the subject. Reads like the next sentence.
- **Greeting:** "Hi friends," or first-name token if the newsletter platform supports it. Never "Hey there,".
- **Lede:** the opening moment from the blog. Same as the blog's opener.
- **Body:** condensed version of the blog's middle sections. Skip one of the three observation → reflection → bigger picture turns if the post had more than three; keep the strongest two.
- **Close:** the same credit-giving forward-looking line. Then a single CTA: "Full post on the blog →" linking to rovonnrussell.com/blog/[slug].
- **Footer:** signature ("— Rovonn"), then the standard newsletter footer with unsubscribe + brand attribution.

**Voice rules:**
- Newsletter is the most personal surface. Lean into it.
- Use a slightly more conversational tone than the blog. Contractions are fine. "I" is doing more work here.

### 4. Pinterest pin

**Pin design considerations** (the user produces the actual graphic; this skill produces the text):

- **Pin title (overlay text on pin):** 8–12 words. Sharp. Builds curiosity. Often a question or a contrarian frame. Example: "What I'd change about Impact Loop if I started it tomorrow." Not "5 Things I Wish I Knew About Starting an Agency."
- **Pin description (the caption Pinterest shows):** 100–500 characters. Front-loads the primary keyword from the SEO map. Reads naturally. Doesn't sound like SEO copy.
- **Pin URL:** rovonnrussell.com/blog/[slug]
- **Suggested boards:** match to category — "Founder Lessons", "Building in Public", "AI for Small Business", "Impact Storytelling", "Toronto Operators".

**Pin description template:**

```
[One-sentence hook in voice]. [One-sentence value statement that names what the post covers]. [Soft CTA: "Full post on the blog."]
```

Example:
> Last Tuesday I shipped my sixteenth agent and figured out the thing that actually makes them reliable. The breakthrough wasn't a smarter prompt. It was pushing every decision the system could pattern-match into Python. Full post on the blog.

## Workflow

### Step 1 — Read the blog post

Read the MDX or rendered version of the blog post being distributed. Note:
- The strongest opening moment
- The 2–3 most quotable lines
- The credit-giving close
- The primary keyword from frontmatter

### Step 2 — Produce all four versions

Draft them in this order:
1. LinkedIn (most native to Rovonn's voice)
2. Newsletter (closest to the blog)
3. X thread (most compressed)
4. Pinterest pin description (most SEO-shaped)

Output each version clearly labeled. The user copies each into the right surface.

### Step 3 — Voice gate check

For each version, verify:
- No em dashes
- Opens with the moment, not the thesis
- Names at least one specific
- First person
- Sounds like Rovonn, not an algorithm

If any version fails, rewrite that one. Don't ship distribution versions that misrepresent the brand voice.

### Step 4 — Save the distribution pack

Write all four versions into a single MDX file at:
```
C:\Users\Rovonn\OneDrive\Desktop\Claude Work\Personal Brand - Rovonn Russell\rovonn-russell-brand\content\blog\<slug>.distribution.mdx
```

Use this structure:

```mdx
# Distribution pack — [Post Title]

Source: rovonnrussell.com/blog/[slug]
Date: 2026-MM-DD

## LinkedIn

[full LinkedIn post text]

**Hashtags:** [list]
**First comment:** [link drop]

## X Thread

1/ [tweet 1]
2/ [tweet 2]
...

## Newsletter

**Subject:** [subject line]
**Preheader:** [preheader]

[full newsletter body]

## Pinterest

**Pin title:** [overlay text]
**Description:** [pin description]
**Boards:** [suggested boards]
**Pin URL:** rovonnrussell.com/blog/[slug]
```

## Schedule guidance

- **Tuesday morning:** Blog post goes live. Newsletter sends same morning. LinkedIn post Tuesday morning, with link in first comment.
- **Wednesday:** X thread posts.
- **Thursday:** Pinterest pin published. Pin to 3–5 relevant boards over the next week.
- **Friday:** Shorter blog post (Storytelling or Community/Culture category) follows the same pattern, compressed.

## Anti-patterns

- **Cross-posting the blog wholesale to LinkedIn.** LinkedIn isn't a blog. Compress and lead with the moment.
- **Generic thread bait.** "A thread 🧵 on what I learned…" — skip. Just start.
- **Stuffing keywords into the Pinterest description.** Reads naturally or it doesn't go.
- **Multi-link LinkedIn posts.** One link, in the first comment.
- **Using the same hashtag set on every post.** Vary. Match the topic.
- **Newsletter that reads like a blog excerpt.** Newsletter is its own form. More personal, more conversational.

## Failure modes

- **Distribution version sounds nothing like the blog.** Re-read both. Voice should carry across.
- **The hook on LinkedIn doesn't earn the tap.** First two lines are the whole game. Rewrite.
- **The X thread loses the moment.** First tweet has to anchor. If it's a thesis, rewrite.
- **The newsletter feels promotional.** Strip the sales energy. Newsletter is a conversation with the reader.
- **The Pinterest description is too SEO.** Read it aloud. If it sounds like a robot, rewrite.

When in doubt, re-read the blog post and ask: would Rovonn share this version himself? If not, rewrite.
