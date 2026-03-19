---
id: 2026-02-choosing-ai-models-without-burning-cash
title: "Choosing AI models without burning cash"
author: Jeff
date: 2026-02-08
updated: 2026-02-08
tags: [ai, cost, models, automation]
summary: >
  I burned through my Claude Pro subscription in three days. Then my Cursor Pro subscription the week after. Both $20/month, both gone before I'd even built half the features I wanted. The problem wasn't the subscriptions. It was that I treated every task the same. Used the premium models for everything, even when simpler models would work fine. Learning to match models to tasks changed how I build with AI.

featured_image: null
status: published
canonical_url: https://ripxg.com/blog/2026-02-08-choosing-ai-models-without-burning-cash

platforms:
  blog:
    enabled: true
    published_at: 2026-02-08
    url: https://ripxg.com/blog/2026-02-08-choosing-ai-models-without-burning-cash
  linkedin:
    enabled: true
    published_at: null
  twitter:
    enabled: true
    published_at: null
  substack:
    enabled: true
    published_at: null
---

I burned through my Claude Pro subscription in three days.

Then my Cursor Pro subscription the week after.

Both $20/month. Both gone before I'd even built half the features I wanted.

The problem wasn't the subscriptions. It was that I treated every task the same.

Used the premium models for everything, even when simpler models would work fine.

Once you start coding with AI at speed, those monthly token limits vanish fast. You need a strategy beyond "use the best model."

I learned to match models to cognitive load.

Most coordination work doesn't need Opus. Reading files, checking status, spawning subagents. These are straightforward operations. Sonnet handles them just fine at a fraction of the cost.

I reserve Opus for work that benefits from deep thinking. Writing product requirement documents. Making architectural decisions. Security reviews.

For routine coding tasks, I use GLM. It's dramatically cheaper than Claude models while being surprisingly capable for well-defined work. Building UI components, fixing bugs, implementing features from clear specs.

GLM costs roughly 10x less per token than Sonnet, and 50x less than Opus. For straightforward implementation work, that difference compounds fast.

Here's what that looks like in my setup. My coordinator agent (Orion) defaults to Sonnet. When Orion needs to write a product spec, it switches to Opus. When it spawns a frontend engineer to build UI, that subagent uses GLM.

Same work gets done. Quality stays high. Token burn drops dramatically.

I also built daily token usage reporting. Shows me which models I'm using and how much they're costing. That visibility alone changed my behavior. I stopped defaulting to expensive models out of habit.

If you're hitting subscription limits or burning through API credits, try this approach. Default to mid-tier models. Use premium models only when complexity genuinely demands them. Use cheap models for clear, well-scoped implementation.

Your token budget should scale with task complexity, not task volume.
