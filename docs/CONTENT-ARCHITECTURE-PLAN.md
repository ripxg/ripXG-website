# Content Architecture Plan: Single Source MD → Multi-Platform Publishing

**Status:** Planning Complete | Ready for Build  
**Author:** Orion 🦉  
**Date:** 2026-01-28  
**Build Model:** GLM-4.7  

---

## Overview

**Goal:** One MD file per article → transforms to LinkedIn, X.com, Substack, ripxg.com

**Publishing approach:**
- LinkedIn: Manual copy-paste
- X.com/Twitter: Manual copy-paste
- Substack: Manual (ripxg.substack.com)
- Blog: Automated via build

**Images:** Shared across all platforms via URLs

---

## 1. New Directory Structure

```
/content/
├── articles/                    # Single source MD files
│   ├── writing-ideas.md
│   ├── observability-updates.md
│   └── ...
├── transforms/                  # Platform-specific output (generated)
│   ├── linkedin/
│   ├── twitter/
│   ├── substack/
│   └── blog/                    # MDX for Next.js
└── publish-status.json          # Cross-platform tracking

/scripts/
├── transform-linkedin.ts        # MD → LinkedIn format
├── transform-twitter.ts         # MD → Thread breakdown
├── transform-substack.ts        # MD → Newsletter format
├── transform-blog.ts            # MD → MDX for site
├── transform-all.ts             # Run all transforms
├── migrate-mdx.ts               # One-time migration script
└── publish-tracker.ts           # Update publish-status.json
```

---

## 2. Unified Frontmatter Schema

```yaml
---
# Core metadata
id: writing-ideas                 # Unique slug (required)
title: Writing ideas into reality
subtitle: Why I'm committing to writing for life  # Optional
author: Jeff
date: 2026-01-05
updated: 2026-01-10               # Last edit date
tags: [writing, AI, productivity]
summary: >
  This year I'm committing to writing. Not as a resolution,
  but for life. Here's why writing matters in the age of AI.

# Images
featured_image: /images/writing-ideas-hero.jpg
images:
  - url: /images/writing-ideas-hero.jpg
    alt: Writing desk with notebook
    caption: Where ideas become words

# Content settings
status: published                 # draft | review | published
canonical_url: https://ripxg.com/blog/writing-ideas

# Platform publishing status
platforms:
  blog:
    enabled: true
    published_at: 2026-01-05
    url: https://ripxg.com/blog/writing-ideas
  linkedin:
    enabled: true
    published_at: 2026-01-06
    url: https://linkedin.com/posts/...
    format: article                # article | post | carousel
  twitter:
    enabled: true
    published_at: null
    thread_id: null
    format: thread                 # thread | single
  substack:
    enabled: true
    published_at: null
    url: null

# Legacy (for migration tracking)
legacy:
  wordpress_id: 2507
  wordpress_url: https://blog.ripxg.com/2026/01/05/writing-ideas-into-reality/
---
```

---

## 3. Transform Script Specifications

### 3.1 `transform-blog.ts`

**Input:** `/content/articles/*.md`  
**Output:** `/content/transforms/blog/*.mdx`

**Logic:**
- Convert MD → MDX
- Extract frontmatter, map to blog-specific fields
- Add Next.js compatible imports if needed
- Preserve code blocks, images, links
- Keep image references as-is (relative URLs work on site)

### 3.2 `transform-linkedin.ts`

**Input:** `/content/articles/*.md`  
**Output:** `/content/transforms/linkedin/*.txt`

**LinkedIn formatting rules:**
- Max ~3000 chars for posts, longer for articles
- No markdown rendering — convert to plain text with line breaks
- Convert `**bold**` to CAPS or remove
- Convert `- list` to `→ list` or `• list`
- Add emoji bullets for visual appeal
- Add `#hashtags` from tags array
- Include CTA + link to canonical URL at end
- Include image URL for manual attachment
- Format options: `article` (LinkedIn publishing) or `post` (feed post)

**Output format:**
```
[TITLE]

[CONTENT - plain text formatted]

---
🔗 Read more: [canonical_url]

#tag1 #tag2 #tag3

📷 Image: [featured_image_url]
```

### 3.3 `transform-twitter.ts`

**Input:** `/content/articles/*.md`  
**Output:** `/content/transforms/twitter/*.json`

**Thread formatting rules:**
- Break into 280-char chunks (smart paragraph breaks)
- First tweet = hook (grab attention)
- Last tweet = CTA + link to canonical
- Output as JSON array of tweets
- Include image attachment info per tweet if applicable

**Output format:**
```json
{
  "article_id": "writing-ideas",
  "thread": [
    {
      "index": 1,
      "text": "This year I'm committing to writing.\n\nNot as a New Year's resolution, but for life.\n\nHere's why 🧵",
      "image": null
    },
    {
      "index": 2,
      "text": "Writing is one of the few ways anyone can advance how they think.\n\nFor me, it's how ideas that would otherwise sit unexplored become something real.",
      "image": "/images/writing-ideas-hero.jpg"
    },
    {
      "index": 3,
      "text": "Read the full article:\nhttps://ripxg.com/blog/writing-ideas",
      "image": null
    }
  ],
  "total_tweets": 3,
  "canonical_url": "https://ripxg.com/blog/writing-ideas"
}
```

### 3.4 `transform-substack.ts`

**Input:** `/content/articles/*.md`  
**Output:** `/content/transforms/substack/*.md`

**Substack formatting:**
- Keep as MD (Substack supports markdown)
- Add email-friendly formatting
- Include subscribe CTA at end
- Add "Read on web" link
- Preserve images with full URLs (not relative)
- Strip any site-specific elements (Next.js components)

**Output format:**
```markdown
# [TITLE]

[CONTENT - markdown preserved]

---

*Originally published at [ripxg.com](canonical_url)*

**[Subscribe to get articles like this in your inbox →](https://ripxg.substack.com)**
```

---

## 4. `publish-status.json` Schema

```json
{
  "articles": {
    "writing-ideas": {
      "source": "content/articles/writing-ideas.md",
      "last_modified": "2026-01-10T12:00:00Z",
      "transforms_generated": "2026-01-10T12:05:00Z",
      "platforms": {
        "blog": {
          "status": "published",
          "published_at": "2026-01-05",
          "url": "https://ripxg.com/blog/writing-ideas"
        },
        "linkedin": {
          "status": "published",
          "published_at": "2026-01-06",
          "url": "https://linkedin.com/posts/..."
        },
        "twitter": {
          "status": "pending",
          "notes": "Ready to post"
        },
        "substack": {
          "status": "draft"
        }
      }
    }
  },
  "stats": {
    "total_articles": 13,
    "published_blog": 13,
    "published_linkedin": 5,
    "published_twitter": 2,
    "published_substack": 0
  }
}
```

---

## 5. Migration Plan (MDX → MD)

### Phase 1: Extract
1. Read all `/content/blog/*.mdx` files
2. Parse frontmatter with gray-matter
3. Extract clean content (strip MDX-specific syntax)

### Phase 2: Transform
1. Create new frontmatter with unified schema
2. Map legacy fields to `legacy:` section
3. Initialize `platforms:` with blog as published
4. Generate slug from filename (strip date prefix)
5. Save to `/content/articles/{slug}.md`

### Phase 3: Update Next.js
1. Modify `lib/blog.ts` to read from `/content/transforms/blog/`
2. Add transform step to build process (`prebuild` script)
3. Update `[slug]/page.tsx` to use transformed MDX
4. Ensure images resolve correctly

### Phase 4: Validate
1. Run transforms
2. Verify blog still renders correctly
3. Test each platform transform output
4. Compare before/after for content integrity

---

## 6. CLI Commands

Add to `package.json`:

```json
{
  "scripts": {
    "transform:all": "tsx scripts/transform-all.ts",
    "transform:blog": "tsx scripts/transform-blog.ts",
    "transform:linkedin": "tsx scripts/transform-linkedin.ts",
    "transform:twitter": "tsx scripts/transform-twitter.ts",
    "transform:substack": "tsx scripts/transform-substack.ts",
    "migrate": "tsx scripts/migrate-mdx.ts",
    "publish:status": "tsx scripts/publish-tracker.ts status",
    "publish:mark": "tsx scripts/publish-tracker.ts mark",
    "prebuild": "npm run transform:blog"
  }
}
```

**Usage:**

```bash
# Transform all articles for all platforms
npm run transform:all

# Transform specific article (future enhancement)
npm run transform:all -- --article=writing-ideas

# Check publish status
npm run publish:status

# Mark as published (interactive or with flags)
npm run publish:mark -- --article=writing-ideas --platform=linkedin --url="..."
```

---

## 7. Dependencies to Add

```json
{
  "devDependencies": {
    "tsx": "^4.x",
    "gray-matter": "^4.0.3"
  }
}
```

Note: `gray-matter` already exists. Only `tsx` needed for running TypeScript scripts directly.

---

## 8. Files to Create

| File | Purpose | Priority |
|------|---------|----------|
| `/scripts/migrate-mdx.ts` | One-time MDX → MD migration | 1 |
| `/scripts/transform-blog.ts` | MD → MDX for site | 2 |
| `/scripts/transform-all.ts` | Orchestrate all transforms | 3 |
| `/scripts/transform-linkedin.ts` | MD → LinkedIn format | 4 |
| `/scripts/transform-twitter.ts` | MD → Thread JSON | 5 |
| `/scripts/transform-substack.ts` | MD → Newsletter | 6 |
| `/scripts/publish-tracker.ts` | Status management | 7 |
| `/content/articles/.gitkeep` | Placeholder | 1 |
| `/content/transforms/.gitkeep` | Placeholder | 1 |
| `/content/publish-status.json` | Initial empty state | 1 |
| `/docs/CONTENT-WORKFLOW.md` | User guide | 8 |

---

## 9. Platform Details

| Platform | URL | Publishing Method | Format |
|----------|-----|-------------------|--------|
| Blog | ripxg.com | Automated (build) | MDX |
| LinkedIn | linkedin.com/in/... | Manual copy-paste | Plain text |
| X/Twitter | x.com/... | Manual copy-paste | Thread JSON |
| Substack | ripxg.substack.com | Manual copy-paste | Markdown |

---

## 10. Build Execution Notes

**For GLM-4.7 build phase:**

1. Start with migration script (`migrate-mdx.ts`)
2. Test with one article first
3. Build transforms in order: blog → linkedin → twitter → substack
4. Update Next.js to use transforms
5. Validate full build works
6. Clean up old `/content/blog/` after validation

**Testing checklist:**
- [ ] Migration preserves all content
- [ ] Blog renders identically after migration
- [ ] LinkedIn transform produces clean copy-paste text
- [ ] Twitter transform produces valid thread JSON
- [ ] Substack transform produces clean markdown
- [ ] publish-status.json updates correctly

---

## Appendix: Example Article After Migration

**File:** `/content/articles/writing-ideas.md`

```markdown
---
id: writing-ideas
title: Writing ideas into reality
author: Jeff
date: 2026-01-05
updated: 2026-01-05
tags: [writing, AI, productivity]
summary: >
  This year I'm committing to writing. Not as a New Year's
  resolution, but for life. Why? Because writing is one of the few ways I
  believe anyone can advance how they think.
featured_image: null
status: published
canonical_url: https://ripxg.com/blog/writing-ideas
platforms:
  blog:
    enabled: true
    published_at: 2026-01-05
    url: https://ripxg.com/blog/writing-ideas
  linkedin:
    enabled: true
    published_at: null
  twitter:
    enabled: true
    published_at: null
  substack:
    enabled: true
    published_at: null
legacy:
  wordpress_id: 2507
  wordpress_url: https://blog.ripxg.com/2026/01/05/writing-ideas-into-reality/
---

This year I'm committing to writing.

Not as a New Year's resolution, but for life.

Why?

Because writing is one of the few ways I believe anyone can advance how they think.

For me, it's how ideas that would otherwise sit unexplored in the corners of my mind become something real.

Writing forces those ideas to take shape. It gives them structure, clarity, and momentum.

Secondly, writing is how ideas scale.

Most ideas never reach beyond the people we can speak to directly. That matters, because even the most useful ideas only have value if they reach the right people.

If I can encourage even a few of you to do the same, it will be worth it.

Thirdly, in the age of AI, the potential of text is incredible. I can take anything I've written and question it, reflect on it from a third-person perspective, or even transform it into something entirely different.

AI is like a supercharged magic mirror—beyond just a reflection—a mirror that shapes you into who you are becoming.
```

---

**Plan complete. Ready for GLM build.**
