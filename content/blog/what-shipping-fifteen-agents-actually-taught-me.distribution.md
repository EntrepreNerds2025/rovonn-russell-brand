# Distribution pack: What shipping fifteen agents actually taught me

Source: rovonnrussell.com/blog/what-shipping-fifteen-agents-actually-taught-me
Date: 2026-05-11

Voice gates re-checked across all four surfaces. No em dashes, opens with the moment, names specifics, first person, sounds like Rovonn talking on a call.

---

## LinkedIn

The Tuesday I shipped agent number sixteen, I sat with the run logs for an hour just watching it work.

It's an inbox triager that reads every email coming into Impact Loop, classifies it, and routes it. By Friday it had handled 142 emails I would have triaged manually. Eight hours back.

What surprised me wasn't that it worked. It was *what* made it work.

Most people building AI agents try to make the LLM smarter. The breakthrough on this one was making the LLM dumber.

Agent fifteen had broken twice in three days. Single LLM call doing classification, summarization, and routing in one prompt. When it broke, the failure was somewhere inside the model's reasoning. Nothing to debug.

Agent sixteen got a different rule.

Push every decision the system can pattern-match into deterministic code. Use the LLM only for steps that genuinely need reasoning over open-ended text.

For the inbox triager that meant:

A small Python preprocessor pulled metadata (sender domain, has-attachment, subject keywords, whether the sender was in our CRM). First-pass classification covered 70% of cases without ever calling the LLM.

For the remaining 30%, an LLM call with a tight schema and small example set did the harder classification.

A second Python step took the classification and ran routing logic. No LLM in this step. Pure if-else, lookups, outbound API calls.

Logs everywhere.

The agent went from breaking every few days to running quietly for weeks. The 70% deterministic path doesn't fail. The 30% LLM path sometimes fails, but when it does the failure is contained. It doesn't cascade.

If you'd asked me a year ago what makes AI agents work, I would have said something about good prompts. Few-shot examples. Maybe chain-of-thought.

None of that was the point.

The point was *every decision the system could pattern-match was already deterministic before the LLM ever ran*. Same architectural principle as every reliable software system: push complexity to the edges, keep the core boring.

The teams that hate their agents are almost always running the opposite setup. One mega-prompt doing six things at once. They blame the model. The model is fine. The architecture is wrong.

**Hashtags:** #BuildingInPublic #AIAgents #PracticalAI #FoundersJourney #ProductionAI

**First comment:** Full post on the blog with the full architectural breakdown and how this connects to the ADAPT framework: rovonnrussell.com/blog/what-shipping-fifteen-agents-actually-taught-me

---

## X Thread

1/ Sixteen production agents in. The thing that made them reliable wasn't smarter prompts.

It was making the LLM dumber.

2/ Agent fifteen broke twice in three days. Single LLM call doing classification, summarization, and routing in one prompt.

When it broke, the failure was inside the model's reasoning. Nothing to debug.

3/ Agent sixteen got a different rule:

Push every decision the system can pattern-match into deterministic code.

Use the LLM only for steps that genuinely need reasoning over open-ended text.

4/ For the inbox triager that meant:

-> Python preprocessor pulled metadata. Classified 70% of cases without an LLM call.

-> LLM call with tight schema for the harder 30%.

-> Python step ran routing logic. No LLM. Pure if-else.

5/ The 70% deterministic path doesn't fail. The 30% LLM path fails sometimes, but when it does the failure is contained.

The agent went from breaking every few days to running quietly for weeks.

6/ Same architectural principle as every reliable software system: push complexity to the edges, keep the core boring.

The teams that hate their agents are running the opposite setup. One mega-prompt doing six things at once.

7/ Full post: rovonnrussell.com/blog/what-shipping-fifteen-agents-actually-taught-me

---

## Newsletter

**Subject:** The breakthrough on agent sixteen wasn't a smarter prompt
**Preheader:** It was making the LLM dumber. Here's what shifted between agents fifteen and sixteen, and why it's the same principle behind every reliable software system.

---

Hi friends,

The Tuesday I shipped agent number sixteen, I sat with the run logs for an hour just watching it work.

It's an inbox triager that reads every email coming into Impact Loop, classifies it, and routes it. By Friday it had handled 142 emails I would have triaged manually. Eight hours back.

What surprised me wasn't that it worked. It was *what* made it work.

Most people building AI agents try to make the LLM smarter. The breakthrough on this one was making the LLM dumber.

Agent fifteen had broken twice in three days. I'd written it the way most people write agents: a single LLM call doing classification, summarization, and routing logic in one prompt. When it worked, it felt magical. When it broke, the failure was somewhere inside the model's reasoning, and there was nothing to debug.

That's when I rebuilt agent sixteen with a different rule:

Push every decision the system can pattern-match into deterministic code. Use the LLM only for the steps that genuinely need reasoning over open-ended text.

For the inbox triager, that meant a small Python preprocessor pulled the email's metadata (sender domain, has-attachment, subject keywords, whether the sender was in our CRM). That gave a first-pass classification covering 70% of cases without ever calling the LLM. For the remaining 30%, an LLM call with a tight schema and a small set of examples did the harder classification. Then a second Python step took the classification and ran the routing logic. No LLM in that step. Pure if-else.

The agent went from breaking every few days to running quietly for weeks. The 70% deterministic path doesn't fail. The 30% LLM path sometimes fails, but when it does the failure is contained.

If you'd asked me a year ago what makes AI agents work, I would have said something about good prompts. Few-shot examples. Maybe chain-of-thought. The cool stuff.

None of that was the point.

The point was every decision the system could pattern-match was already deterministic before the LLM ever ran. Same architectural principle as every reliable software system: push complexity to the edges, keep the core boring. The novelty was just realizing it applied to LLMs too.

The teams I see hating their agents are almost always running the opposite setup. One mega-prompt doing six things at once. They blame the model. The model is fine. The architecture is wrong.

Full post on the blog ->
rovonnrussell.com/blog/what-shipping-fifteen-agents-actually-taught-me

Rovonn

---

## Pinterest

**Pin title (overlay text on pin):** The fix that made my AI agents reliable wasn't a smarter prompt.

**Description:** Sixteen production agents in. The thing that made them reliable was pushing every decision the system could pattern-match into deterministic Python code, and only using the LLM for steps that actually needed reasoning. Same principle as every reliable software system. Full post on the blog.

**Boards:** AI for Small Business, Building in Public, Founder Lessons, AI Agents, Production AI

**Pin URL:** rovonnrussell.com/blog/what-shipping-fifteen-agents-actually-taught-me

---

## Schedule

- **Tuesday morning (Week 2 of pillar duo):** Blog post live. Newsletter sends same morning. LinkedIn post Tuesday morning, link drops in first comment.
- **Wednesday:** X thread.
- **Thursday:** Pinterest pin published, pin to 3-5 boards over the next week.

This post is the second half of a pillar duo with "When to use AI and when to write it yourself." Anyone who reads either lands naturally on the other through the cross-link in the post bodies and the related-posts widget at the bottom.
