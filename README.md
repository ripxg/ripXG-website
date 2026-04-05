# ripXG-website

Personal brand website and blog for Jeff Chau - Observability Advisor & AI Agent Specialist.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Content:** MDX (Markdown + JSX)
- **Hosting:** Vercel (planned)

## Features

- Blog with migrated WordPress posts
- About page
- Newsletter signup (Substack integration)
- Sahil Bloom-inspired clean design
- Dark mode support

## Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Build

```bash
npm run build
npm start
```

## Content Structure

```
content/
  blog/         # Published blog posts (migrated from WordPress + new posts)
  drafts/        # Agent-generated drafts
```

## Creating New Blog Posts

1.  **Format:** Use MDX format (`.mdx` extension) directly in `content/blog/`. Do not use `.md`.
2.  **Naming Convention:** Name files using the `YYYY-MM-DD-slug.mdx` pattern (e.g., `2026-04-05-my-post-title.mdx`). This ensures the correct URL slug is generated.
3.  **Frontmatter:**
    *   `status`: Set to `draft` for work-in-progress or `published` to go live.
    *   `canonical_url`: Must match the final URL path (e.g., `https://ripxg.com/blog/YYYY-MM-DD-slug`).
4.  **Validation:** The pre-commit hook automatically validates formatting and canonical URLs. Ensure your `canonical_url` matches your filename to avoid build failures.

## WordPress Migration

Posts are migrated from `blog.ripxg.com` using the WordPress REST API.
Run migration script to update:

```bash
node scripts/migrate-wordpress.js
```

## Deployment

Coming soon: Vercel
