const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const WP_URL = 'https://blog.ripxg.com';
const WP_USERNAME = 'ripxg';
const WP_APP_PASSWORD = 'bANFRzvgLaPrjmo2ZnuoEHxP';

// Create blog directory if it doesn't exist
const blogDir = path.join(__dirname, '..', 'content', 'blog');
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

async function fetchAllPosts() {
  let page = 1;
  let allPosts = [];

  console.log('Fetching posts from WordPress...');

  while (true) {
    const response = await fetch(
      `${WP_URL}/wp-json/wp/v2/posts?per_page=100&page=${page}&status=publish`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64')}`
        }
      }
    );

    const posts = await response.json();

    if (!Array.isArray(posts) || posts.length === 0) {
      break;
    }

    allPosts = [...allPosts, ...posts];
    console.log(`Fetched page ${page}: ${posts.length} posts`);
    page++;

    if (posts.length < 100) break;
  }

  return allPosts;
}

function htmlToMarkdown(html) {
  // Basic HTML to Markdown conversion
  let markdown = html;

  // Headers
  markdown = markdown.replace(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi, (_, level, content) => {
    const hashes = '#'.repeat(parseInt(level));
    return `\n${hashes} ${content}\n`;
  });

  // Paragraphs
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n');

  // Bold
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');

  // Italic
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

  // Links
  markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Lists
  markdown = markdown.replace(/<ul[^>]*>/gi, '\n');
  markdown = markdown.replace(/<\/ul>/gi, '\n');
  markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1');

  // Code
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  markdown = markdown.replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```');

  // Blockquotes
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '\n> $1\n');

  // Line breaks
  markdown = markdown.replace(/<br\s*\/?>/gi, '\n');

  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  markdown = markdown.replace(/&nbsp;/g, ' ');
  markdown = markdown.replace(/&amp;/g, '&');
  markdown = markdown.replace(/&lt;/g, '<');
  markdown = markdown.replace(/&gt;/g, '>');
  markdown = markdown.replace(/&#39;/g, "'");
  markdown = markdown.replace(/&quot;/g, '"');

  // Clean up extra whitespace
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  markdown = markdown.trim();

  return markdown;
}

function convertPostToMDX(post) {
  const date = new Date(post.date);
  const slug = post.slug || post.id.toString();
  const filename = `${date.toISOString().split('T')[0]}-${slug}.mdx`;

  const content = htmlToMarkdown(post.content.rendered || '');

  const frontmatter = {
    title: post.title.rendered,
    date: date.toISOString(),
    tags: [],
    summary: post.excerpt?.rendered?.replace(/<[^>]+>/g, '') || '',
    status: 'published',
    wordpressId: post.id,
    wordpressUrl: post.link
  };

  const matterResult = matter.stringify(content, frontmatter);

  const filepath = path.join(blogDir, filename);
  fs.writeFileSync(filepath, matterResult, 'utf8');

  console.log(`✓ Converted: ${filename}`);
}

async function migrate() {
  try {
    const posts = await fetchAllPosts();
    console.log(`\nTotal posts: ${posts.length}\n`);

    posts.forEach(convertPostToMDX);

    console.log('\n✅ Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();
