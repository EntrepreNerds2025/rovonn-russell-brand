---
title: "What shipping fifteen agents actually taught me"
slug: "what-shipping-fifteen-agents-actually-taught-me"
date: "2026-05-11"
author: "rovonn-russell"
category: "Building in Public"
tags: ["ai-agents", "building-in-public", "adapt", "production-ai", "founders"]
excerpt: "The Tuesday I shipped agent number sixteen, the thing that surprised me wasn't that it worked. It was what made it work. The breakthrough wasn't a smarter prompt. It was making the LLM dumber."
seoTitle: "What shipping fifteen AI agents actually taught me"
metaDescription: "Sixteen production agents in. The fix wasn't smarter prompts. It was pushing every decision the system could pattern-match into deterministic code."
heroImage: "/blog/what-shipping-fifteen-agents-actually-taught-me/hero.jpg"
heroImageAlt: "A laptop screen showing code and an agent run log, with a notebook nearby."
faq:
  - question: "What's the biggest mistake people make when building AI agents?"
    answer: "Trying to make the LLM smarter. The reliable agents are the ones where the LLM is doing as little decision-making as possible. Most of the work happens in deterministic code around the model."
  - question: "How do you decide what should be a Python script vs an LLM call?"
    answer: "Anything the system can pattern-match should be deterministic. That includes classifications with finite categories, lookups, validations, and structured extraction with a known schema. Anything that genuinely needs reasoning over open-ended text or judgment in ambiguous cases is where the LLM earns its keep. The default should be Python until proven otherwise."
  - question: "What does an actually-reliable agent look like in production?"
    answer: "Boring. It runs every day without anyone watching it. The logs show predictable behavior. When something goes wrong, the failure is in a deterministic step you can debug in five minutes, not an LLM hallucination you have to retry. The teams that hate their agents are usually running the opposite setup."
  - question: "How does this connect to the ADAPT framework?"
    answer: "ADAPT is about tailoring AI and systems to what the work actually needs. The Apply phase says build the smallest version that could possibly work. For agents, that almost always means deterministic-first. The LLM gets pulled in only for the steps that actually need it. That's the same logic, applied at the architecture level."
published: false
---

The Tuesday I shipped agent number sixteen, I sat with the run logs for an hour just watching it work.

It's an inbox triager that reads every email coming into Impact Loop, classifies it, and routes it. By Friday it had handled 142 emails I would have triaged manually. Eight hours back.

What surprised me wasn't that it worked. It was *what* made it work.

Most people building AI agents try to make the LLM smarter. The breakthrough on this one was making the LLM dumber.

## The agent before this one didn't work

Agent number fifteen had broken twice in three days. It was a similar inbox triager, built for a client. The architecture was wrong. I'd written it the way most people write agents: a single LLM call doing classification, summarization, and routing logic in one prompt. When it worked, it felt magical. When it broke, the failure was somewhere inside the model's reasoning, and there was nothing to debug.

The Friday it broke the second time, I sat with what had actually gone wrong. The model had classified an internal email as a press inquiry. There was no way to step through *why*. The prompt looked right. The example felt right. The output was just wrong, and the next one might be wrong in a different way.

That's when I rebuilt agent sixteen from scratch with a different rule.

## The rule

Push every decision the system can pattern-match into deterministic code. Use the LLM only for the steps that genuinely need reasoning over open-ended text.

For the inbox triager, that meant the architecture became:

A small Python preprocessor pulled the email's metadata: sender domain, has-attachment, subject keywords, whether the sender was in our CRM. That gave a first-pass classification covering 70% of cases without ever calling the LLM.

For the remaining 30%, an LLM call with a tight schema and a small set of examples did the harder classification, the cases that actually needed a model to read the email and understand intent.

A second Python step took the classification and ran the routing logic. No LLM in this step at all. Pure if-else, lookups, and outbound API calls.

Logs everywhere. Every decision in every step was recorded.

The agent went from breaking every few days to running quietly for weeks. The 70% deterministic path doesn't fail. The 30% LLM path fails sometimes, but when it does, the failure is contained, it doesn't cascade through the routing logic.

## What stood out most was how unglamorous this is

If you'd asked me a year ago what makes AI agents work, I would have said something about good prompts. Few-shot examples. Maybe chain-of-thought. The cool stuff.

Sitting with the logs of agent sixteen, none of that was the point. The point was *every decision the system could pattern-match was already deterministic before the LLM ever ran*. The LLM only handled the steps that genuinely needed it. The rest was code.

This isn't a clever insight. It's the same architectural principle behind every reliable software system: push complexity to the edges, keep the core boring. The novelty was just realizing it applied to LLMs too.

The teams I see hating their agents are almost always running the opposite setup. One mega-prompt doing six things at once. When something breaks, the whole thing has to be retried. They blame the model. The model is fine, the architecture is wrong.

## Why this is the Apply phase question

Most of the founders who ask me about AI agents start with "what should I build?" That's actually two questions hiding in one.

The first question is *what's the right outcome to build toward.* That's the [Discover phase of ADAPT](/frameworks/adapt): figure out what specific job needs doing in your business and what would change if it were handled by a system. Inbox triage. Reply classification. Lead enrichment. Content draft generation. Each of these is a different outcome.

The second question is *how should the system actually be built.* That's the Apply phase. And the answer is almost always the same: build the smallest version that could possibly work, and within that version, push every decision the system can pattern-match into deterministic code.

When you separate the two questions, agents stop being a vibe and start being a build.

## What I'd do differently if I were starting today

Start smaller than you think. The first agent shouldn't handle a category, it should handle one job. Inbox triage is too big for a v1. Inbox triage *for the specific case where someone replies to a cold email I sent* is small enough to build in a day and learn from in a week.

Write the deterministic version first. Before any LLM. Map out what would need to be true for the system to make a decision. If you can do that with a Python function, you don't need a model at that step.

Log everything. Every input, every classification, every retry, every routing decision. The logs are where the second version gets designed.

Plan to throw the first version away. The teams that try to ship the perfect first agent never ship anything. The teams that ship a small, ugly first agent and rebuild the architecture in the second pass end up with something they actually trust.

Sixteen agents in, the unifying lesson isn't about a tool or a model. It's about treating agents the way you'd treat any production system the team needs to run: small, deterministic by default, observable, and built around what the work actually needs, not around what's exciting on Twitter that week.

If this resonates and you want the simpler version of the question (*should I be using AI for this at all?*), that's the post that came before this one: [When to use AI and when to write it yourself](/blog/when-to-use-ai-and-when-to-write-it-yourself). Same logic, applied at the sentence level instead of the architecture level.

---

*Big respect to the teams at Impact Loop and the founders running their own builds who let me look at their agent architectures and ask hard questions about what's deterministic and what isn't. Looking forward to seeing what gets built when more people start with "what's the smallest version that could possibly work" instead of "what's the most powerful model I can wire up."*
