---
id: 2025-10-observability-updates
title: "[October] Observability Updates for SRE/Monitoring Teams"
author: Jeff
date: 2025-10-17
updated: 2025-10-17
tags: [observability, sre, monitoring, ai, troubleshooting]
summary: >
  Monthly update on observability trends, AI agent troubleshooting, and infrastructure monitoring insights

featured_image: null
status: published
canonical_url: https://ripxg.com/blog/2025-10-observability-updates

platforms:
  blog:
    enabled: true
    published_at: 2025-10-17
    url: https://ripxg.com/blog/2025-10-observability-updates
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

Hello again to my closest Observability enthusiasts,

I've come back from some holiday time and there were certainly a few stories to share, next time we meet.

### Recent Conversation Topics

The conversations I've had since my return from holiday have been focused on:

- Troubleshooting of AI agents themselves, now that services and applications are being built with AI agents, transaction flows can heavily depend on agent-to-agent communication as well as agent performance and accuracy

- Continued interest in AI directed troubleshooting, for which I have further updates below

- Observability for AI infrastructure, LLM usage and cost analysis

- Real user monitoring and analytics, especially for mobile applications

- Data residency for SaaS solutions (especially for SG-based companies)

### .conf25 Key Highlights

Splunk's annual conference .conf25 went ahead in Boston and major announcements were made on the progress of Splunk in the Observability space. I promised that I would share key highlights of .conf25 and I've summarized them below for you and your teams.

**FIRST - The most exciting to me is the Alpha release of the AI Troubleshooting Agent.** Check out this screenshot of the agent in action:

![Alpha: Agentic Troubleshooting](https://drive.google.com/file/d/1NUQrx6R5UAHXaqEb1HprV62_cxc2_Mmn/view)

You can see that the agent is taking a structured approach to responding to a performance alert, looking through metrics and traces for root cause analysis and determining end-user impact. This solves two major challenges for both small and large teams alike:

- Alert fatigue, by allowing an agent to respond to all critical alerts within a minute
- Slow troubleshooting, by giving humans an automated workflow with AI assistance

This capability will be in Alpha for both O11y Cloud and AppDynamics customers. Speak to me to get started on it - or you can see a video of it in action, in this 1min45sec demo: [https://drive.google.com/file/d/1NUQrx6R5UAHXaqEb1HprV62_cxc2_Mmn/view](https://drive.google.com/file/d/1NUQrx6R5UAHXaqEb1HprV62_cxc2_Mmn/view?trk=article-ssr-frontend-pulse_little-text-block)

**SECOND - The adoption of AI models and growth of infrastructure among many of my customers has driven conversations on Observability of AI consumption and performance.** The latest Observability for AI release is already generally available for both O11y Cloud and AppDynamics customers. Work with me on getting this built into your environment.

**THIRD - I see user journey monitoring come up as a key ask from FSI and Telco customers a lot.** They may be teams relying on the basic capabilities of Google Analytics or Firebase today that would benefit greatly from having application-level visibility and tracing without needing your teams to manually stitch these together from logs. This upcoming release will give you the ability to enable business insights for key customer journeys. Another one to get started ASAP if it's a focus for you. This capability is extremely powerful when combined with recent GA of Business Transactions.

**FOURTH - Alpha release: Digital Experience Monitoring Business Insights**

Exciting times as we see local enterprises and services partners already working on getting these set up in the region. Speak soon.

---

## More by Jeff Chau

## Others also viewed

## Explore content categories
