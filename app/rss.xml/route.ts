import { getBlogPosts } from '@/lib/blog';

const SITE_URL = 'https://ripxg.com';

export async function GET() {
  const posts = getBlogPosts();

  const items = posts
    .map((post) => {
      const link = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      const description = post.summary ? `<description>${escapeXml(post.summary)}</description>` : '';
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      ${description}
      <pubDate>${pubDate}</pubDate>
      <link>${link}</link>
      <guid>${link}</guid>
    </item>`;
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>ripXG — AI Agents &amp; Tech for Everyone</title>
    <description>I build and manage custom AI agents that automate your workflows. Plus: practical guides on AI, observability, and building fast.</description>
    <link>${SITE_URL}</link>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
