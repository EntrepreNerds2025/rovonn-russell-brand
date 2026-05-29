# Blog Metrics

How to read whether the blog is doing its job. Events fire from the rovonn-russell-brand app via `trackEvent` (src/lib/analytics.ts), which dispatches to `gtag`, `plausible`, and `dataLayer` if configured.

## Events emitted

| Event | When | Properties |
|---|---|---|
| `blog_index_viewed` | `/blog` page load | - |
| `blog_category_viewed` | `/blog/category/:slug` page load | `category` |
| `blog_post_viewed` | `/blog/:slug` page load | `slug`, `category` |
| `blog_scroll_50` | scroll depth â‰¥ 50% on a post | `slug` |
| `blog_scroll_90` | scroll depth â‰¥ 90% on a post | `slug` |
| `blog_cta_click` | inline CTA at end of post | `kind` (`kit` \| `work_with_me`), `slug` |
| `starter_kit_form_started` | first keystroke in the kit form | - |
| `starter_kit_form_submitted` | kit form submitted successfully | `audience` |
| `starter_kit_downloaded` | PDF download click | - |

## What to watch (weekly)

**Top of funnel.**
- `blog_index_viewed` and `blog_category_viewed` per week - overall traffic shape
- New visitors vs returning (from your analytics provider)
- Top entry posts (which posts are pulling people in from search and social)

**Engagement on posts.**
- `blog_scroll_50` rate per post = the post is holding readers
- `blog_scroll_90` rate per post = the post is closing the loop
- If `blog_post_viewed` is high but `blog_scroll_50` is low, the lede needs work
- If `blog_scroll_50` is high but `blog_scroll_90` is low, the middle drags or the close doesn't earn the reader through

**Conversion to action.**
- `blog_cta_click` with `kind: kit` per post -> which posts feed the Visibility Starter Kit
- `blog_cta_click` with `kind: work_with_me` per post -> which posts feed consulting inquiries
- `starter_kit_form_submitted` after `blog_cta_click` -> blog-attributed kit submissions
- Strategy call form submissions (from Work With Me) attributed to blog referral

## Quarterly review

Every quarter, pull the top 5 ranking posts by views and the bottom 5. Look at the pattern:

- What's the topic? Which category dominates?
- What's the publish date? Are older posts compounding (good SEO signal) or are recent posts driving everything (good momentum signal)?
- What's the search query mix bringing them in? (From Google Search Console.)
- What's the conversion ratio (`blog_cta_click` / `blog_post_viewed`)? Anything above 3% is excellent. 1â€“3% is healthy. Under 1% means the close isn't doing its job.

Update the editorial calendar based on what's learned. Double down on what's working. Retire categories that aren't.

## Simple dashboard query plan

If using GA4 or Plausible, build a Looker Studio / Plausible report with these widgets:

1. **Posts published this quarter** (count of `blog_post_viewed` distinct slugs)
2. **Total post views this week / last week** (line chart)
3. **Top 10 posts by views (last 30 days)** (table)
4. **Top 10 posts by 90% scroll rate** (table) - these are the ones holding readers
5. **CTA conversion rate by post** (bar chart, sorted descending)
6. **Kit form submissions by acquisition source** (pie or bar chart, blog vs LinkedIn vs direct)

When the blog has 12+ published posts, this dashboard becomes the steering wheel. Until then, eyeball the events in your provider and don't over-invest in dashboards.

## What we're NOT measuring

- Time on page. Misleading metric. Scroll depth tells the same story without the noise.
- Bounce rate. A reader who lands, reads, and leaves satisfied is not a bounce in any useful sense.
- Page speed. Tracked separately via Core Web Vitals, not blog-specific.

## Health thresholds

A healthy post (after first 30 days):
- â‰¥ 200 page views
- â‰¥ 40% scroll-50 rate
- â‰¥ 15% scroll-90 rate
- â‰¥ 1% CTA click rate

A great post:
- â‰¥ 1,000 page views
- â‰¥ 60% scroll-50 rate
- â‰¥ 30% scroll-90 rate
- â‰¥ 3% CTA click rate
- Generates at least 1 consulting inquiry attributable to its publish window

A struggling post:
- < 100 page views after 60 days, or
- Scroll-50 rate < 25% (the lede isn't working)

For struggling posts: rewrite the opening, refresh the SEO title/meta description, internal-link to it more aggressively from healthy posts.

## Frequency of review

- **Weekly:** glance at the previous week's top 5 posts and any that broke 1,000 views.
- **Monthly:** review CTA conversion rates and update the editorial calendar.
- **Quarterly:** full dashboard review, update keyword targets, retire what's not working.
