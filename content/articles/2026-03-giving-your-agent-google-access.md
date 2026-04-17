---
id: 2026-03-giving-your-agent-google-access
title: "Giving your AI agent access to Google Workspace"
author: Jeff
date: 2026-03-10
updated: 2026-03-10
tags: [ai, agents, google-workspace, gws-cli, automation]
summary: >
  Most AI agents are cut off from the tools businesses actually run on. Google Workspace (Gmail, Calendar, Sheets, Drive) is where real work happens. Today I replaced gogcli with gws-cli, and for the first time, giving an agent full Workspace access feels like proper infrastructure. Here's what that unlocks.

featured_image: null
status: published
canonical_url: https://ripxg.com/blog/2026-03-10-giving-your-agent-google-access

platforms:
  blog:
    enabled: true
    published_at: 2026-03-10
    url: https://ripxg.com/blog/2026-03-10-giving-your-agent-google-access
  twitter:
    enabled: true
    published_at: "2026-03-10"
---

Most AI agents are blind to where actual work happens.

They can write code, answer questions, summarize documents you paste in. But your calendar, your inbox, your shared spreadsheets: the things your business actually runs on. Those are invisible to them by default.

Google Workspace is where most teams operate. If your agent can't read it, it's working with a fraction of the context it needs.

That's the problem I've been trying to solve, and today the tooling finally caught up.

For the past several months, I've been using [gogcli](https://gogcli.sh), a Google Workspace CLI built by [steipete](https://steipete.com) (the creator of OpenClaw!), who hit the same wall and decided to build around it. It handled OAuth, wrapped the Google APIs into shell commands, and made it possible for my agent Orion to search Gmail, check calendar events, and pull from Sheets.

It worked well. The limitation wasn't the tool itself. gogcli was a community-built solution, without the depth and breadth you get from a CLI backed by the Google tools team directly.

Today I replaced it with gws-cli, and the difference is significant.

gws follows a single consistent pattern across everything: `gws <service> <resource> <method>`. Gmail, Calendar, Drive, Sheets, Docs, Slides, Tasks, Chat, Forms, Keep, Meet, People. Fourteen Google services, all through the same interface. It also supports schema inspection, so an agent can ask what parameters an endpoint accepts before calling it.

That consistency is what makes it agent-friendly. An agent can reason about how to use a new service without needing custom instructions written for each one. That's the kind of flexibility that scales.

Think about what this actually unlocks for a business running on Google Workspace.

Your agent can monitor your inbox and surface urgent messages before you've opened your laptop. It can check everyone's calendar before scheduling anything, without you explaining the availability situation. It can pull live data from Sheets, update rows when something changes in your system, and write summaries back to Docs. When a project milestone hits, it can post to the relevant Google Chat space automatically.

These aren't demos. This is what an agent connected to real business infrastructure can do today.

The difference between an AI assistant that answers questions and one that actually helps run operations is access. Specifically, read and write access to the tools your team is already using.

Setting this up takes about 15 minutes. You create an OAuth app in Google Cloud Console, download the credentials file, run the auth setup once. After that, any agent running on your machine can call any of those fourteen services.

gogcli, thanks to steipete, opened the door. gws-cli is a proper entrance.

If you're building with AI agents and your business runs on Google Workspace, this is worth setting up. The configuration is a bit technical: OAuth apps, credential files, CLI setup. If you want help getting it running for your own agent stack, [get in touch](https://www.ripxg.com/get-started).

**[gws-cli on GitHub](https://github.com/googleworkspace/cli)** · **[OpenClaw docs](https://docs.openclaw.ai)**
