---
title: "The $10/Month AI Business Stack"
date: 2026-04-05
summary: >
  I tried building a professional setup without the enterprise price tag. It's not perfect, but it works and costs almost nothing. Here's what I learned along the way.
status: draft
canonical_url: https://ripxg.com/blog/2026-04-ai-business-stack
platforms:
  blog:
    enabled: true
  twitter:
    enabled: true
  linkedin:
    enabled: true
  substack:
    enabled: false
featured_image: ""
project_links:
  - name: OpenClaw
    url: https://github.com/openclaw/openclaw
  - name: OpenRouter
    url: https://openrouter.ai
  - name: Vercel
    url: https://vercel.com
  - name: Railway
    url: https://railway.app
---

When I first started looking at AI tools for my business, I assumed I'd need to spend serious money. Enterprise plans. Premium APIs. The whole package. But after a few months of paying for things I didn't fully use, I started questioning what I was actually buying.

Turns out most of that spend wasn't buying capability. It was buying convenience. And if you're willing to wire things together yourself, you can get most of the way there for a fraction of the cost.

Here's the stack I ended up with. It's about $10-15 a month. It handles my customer emails, task management, code deployment, and more. It's not fancy. It works.

## The Orchestrator: OpenClaw on a Cheap VPS

[OpenClaw](https://github.com/openclaw/openclaw) is an autonomous agent that runs continuously. It checks emails, manages tasks, connects tools together. That's the job.

I started running it locally on my laptop. Development was easy, privacy was solid, and I had full control. But there was this problem: every morning I'd wonder if my laptop had slept overnight. If something broke while I was away. If a heartbeat got missed.

That uncertainty became its own kind of cost. So I moved OpenClaw to a [Contabo](https://contabo.com) Cloud VPS S plan for around €5-6 per month.

The change was straightforward. No more guessing. The agent stays up. I can restart my machine, travel, lose internet. None of it matters. The orchestration keeps running.

There's something else here that's easy to miss. When you run your own orchestrator, you own the system. No vendor can change your pricing. No one can block your access. No approval process to flip a setting. It's yours.

## The Brain: OpenRouter and Free Models

I use [OpenRouter](https://openrouter.ai) to access AI models. The shift there was practical, not philosophical.

Anthropic started blocking third-party access to Claude on their prepaid plans. If you weren't paying for the enterprise route, you were locked out. That left me looking for alternatives that didn't put a single vendor in control of my workflow.

OpenRouter's free tier gives you access to specific models like [MiniMax M2.5](https://openrouter.ai/minimax/minimax-m2.5:free) and [Qwen 3.6 Plus](https://openrouter.ai/qwen/qwen3.6-plus:free). They're not at the level of Claude Sonnet for complex reasoning tasks. But for the bulk of everyday work, like drafting emails, summarizing documents, or writing boilerplate code, they're good enough. And they cost nothing.

These models are free at the time of writing, but OpenRouter rotates their free offerings over time. That's the trade-off you're making. Free models save you money. But you give up predictability and access. Free tiers can hit rate limits. Performance can vary. For my usage, it's been fine. If I needed more reliability, I could drop $10 a month on a paid tier. I haven't needed to yet.

Most business tasks don't need the smartest model available. They need a model that's available consistently, at a price you can predict. The free tier manages that balance well enough for where I am right now.

## The Workspace: Gmail and Calendar via `gws`

I don't use a CRM. I don't pay for a project management suite. I use a standard Google account with the `gws` CLI tool.

OpenClaw connects to [Gmail](https://gmail.com) and Google Calendar through `gws`. It reads incoming emails, drafts responses, checks my calendar for conflicts, creates events. All of it runs automatically.

The automation layer is what matters here, not the platform. My inbox functions as a task queue. Calendar invites get validated against my priorities. Follow-ups go out on schedule without me remembering them.

This runs on a free Google account. The tooling is open source. The intelligence comes from the orchestrator sitting on top, not from anything Google provides.

## The Codebase: GitHub Free Tier

I keep everything on [GitHub's](https://github.com) free tier. It's generous for a solo founder. Repositories, issues, and Actions are all included.

GitHub Team runs $4 per user per month. What you get is more Actions minutes and features like Branch Protection rules. For one person, the free tier is enough. I'd upgrade when I'm working with multiple contributors and need those guardrails. Not before.

I haven't hit the point where the free tier slows me down. When I do, I'll upgrade. The trigger is clear. It's not arbitrary.

## The Hosting: Vercel and Railway

This is the part that just works.

[Vercel](https://vercel.com) handles my frontend and DNS for free. Push to Git and the site deploys. The free tier includes bandwidth and serverless functions that cover most small projects. I haven't come close to the limits.

[Railway](https://railway.app) runs my backend. They offer a $5 trial credit to get started, and their starter plans kick in once you scale. I currently pay about $5 a month for PostgreSQL and room for a few microservices. The pricing is transparent. I pay for what I use. What I use costs less than lunch.

The two together cover what I need. Vercel for the edge, Railway for the backend. Both scale automatically. Neither requires me to become a DevOps engineer.

## What This Actually Costs

Here's the breakdown. [Contabo](https://contabo.com) VPS at €5-6 per month. [OpenRouter](https://openrouter.ai) free tier, so $0 unless I need more. [Railway](https://railway.app) around $5. [Vercel](https://vercel.com) is free. [GitHub](https://github.com) is free. [Google](https://google.com) is free.

Total comes to about $10-15 a month.

But the real benefit isn't the savings. It's the control. Every component is something I understand. I can swap pieces out. I can scale or cut back based on what the business needs, not what a vendor's contract says.

If you're building something and want to talk about how AI can help you move faster, drop me a line. I'm always happy to chat.