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
  blog/         # Published blog posts (migrated from WordPress)
  drafts/        # Agent-generated drafts
```

## WordPress Migration

Posts are migrated from `blog.ripxg.com` using the WordPress REST API.
Run migration script to update:

```bash
node scripts/migrate-wordpress.js
```

## Deployment

Coming soon: Vercel
