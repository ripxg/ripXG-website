#!/usr/bin/env tsx
/**
 * Publish Tracker: Manage Cross-Platform Publishing Status
 *
 * Commands:
 *   status   - Display current publishing status
 *   mark     - Mark an article as published on a platform
 *   init     - Initialize publish-status.json from articles
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const ARTICLES_DIR = path.join(CONTENT_DIR, 'articles');
const STATUS_FILE = path.join(CONTENT_DIR, 'publish-status.json');

type PlatformStatus = 'draft' | 'pending' | 'published';
type Platform = 'blog' | 'linkedin' | 'twitter' | 'substack';

interface ArticleStatus {
  source: string;
  last_modified: string;
  transforms_generated: string | null;
  platforms: Record<Platform, {
    status: PlatformStatus;
    published_at: string | null;
    url: string | null;
    notes?: string;
  }>;
}

interface PublishStatus {
  articles: Record<string, ArticleStatus>;
  stats: {
    total_articles: number;
    published_blog: number;
    published_linkedin: number;
    published_twitter: number;
    published_substack: number;
  };
}

/**
 * Read current publish status
 */
function readStatus(): PublishStatus {
  if (!fs.existsSync(STATUS_FILE)) {
    return {
      articles: {},
      stats: {
        total_articles: 0,
        published_blog: 0,
        published_linkedin: 0,
        published_twitter: 0,
        published_substack: 0,
      },
    };
  }

  const content = fs.readFileSync(STATUS_FILE, 'utf-8');
  return JSON.parse(content);
}

/**
 * Write publish status
 */
function writeStatus(status: PublishStatus): void {
  fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2), 'utf-8');
}

/**
 * Get last modified time of a file
 */
function getFileModified(filePath: string): string {
  const stats = fs.statSync(filePath);
  return stats.mtime.toISOString();
}

/**
 * Calculate stats from articles
 */
function calculateStats(status: PublishStatus): PublishStatus['stats'] {
  const articles = Object.values(status.articles);

  return {
    total_articles: articles.length,
    published_blog: articles.filter(a => a.platforms.blog.status === 'published').length,
    published_linkedin: articles.filter(a => a.platforms.linkedin.status === 'published').length,
    published_twitter: articles.filter(a => a.platforms.twitter.status === 'published').length,
    published_substack: articles.filter(a => a.platforms.substack.status === 'published').length,
  };
}

/**
 * Initialize status from articles directory
 */
function initStatus(): void {
  console.log('🔄 Initializing publish-status.json...\n');

  const status = readStatus();
  status.articles = {};

  if (!fs.existsSync(ARTICLES_DIR)) {
    console.error(`❌ Articles directory not found: ${ARTICLES_DIR}`);
    process.exit(1);
  }

  const articleFiles = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.md') && f !== '.gitkeep')
    .sort();

  console.log(`Found ${articleFiles.length} articles\n`);

  for (const filename of articleFiles) {
    const slug = filename.replace('.md', '');
    const articlePath = path.join(ARTICLES_DIR, filename);

    const { data: frontmatter } = matter.read(articlePath);
    const modified = getFileModified(articlePath);

    // Determine platform status from frontmatter
    const platforms: ArticleStatus['platforms'] = {
      blog: {
        status: frontmatter.platforms?.blog?.published_at ? 'published' : 'draft',
        published_at: frontmatter.platforms?.blog?.published_at || null,
        url: frontmatter.platforms?.blog?.url || null,
      },
      linkedin: {
        status: frontmatter.platforms?.linkedin?.published_at ? 'published' : 'pending',
        published_at: frontmatter.platforms?.linkedin?.published_at || null,
        url: frontmatter.platforms?.linkedin?.url || null,
      },
      twitter: {
        status: frontmatter.platforms?.twitter?.published_at ? 'published' : 'pending',
        published_at: frontmatter.platforms?.twitter?.published_at || null,
        url: frontmatter.platforms?.twitter?.url || null,
      },
      substack: {
        status: frontmatter.platforms?.substack?.published_at ? 'published' : 'draft',
        published_at: frontmatter.platforms?.substack?.published_at || null,
        url: frontmatter.platforms?.substack?.url || null,
      },
    };

    status.articles[slug] = {
      source: `content/articles/${filename}`,
      last_modified: modified,
      transforms_generated: null,
      platforms,
    };

    console.log(`✅ Added: ${slug}`);
  }

  status.stats = calculateStats(status);
  writeStatus(status);

  console.log(`\n📊 Stats:`);
  console.log(`   Total: ${status.stats.total_articles}`);
  console.log(`   Blog: ${status.stats.published_blog} published`);
  console.log(`   LinkedIn: ${status.stats.published_linkedin} published`);
  console.log(`   Twitter: ${status.stats.published_twitter} published`);
  console.log(`   Substack: ${status.stats.published_substack} published`);

  console.log(`\n💾 Saved to: ${STATUS_FILE}`);
}

/**
 * Display current status
 */
function showStatus(articleId?: string): void {
  const status = readStatus();

  if (articleId) {
    // Show specific article
    const article = status.articles[articleId];
    if (!article) {
      console.error(`❌ Article not found: ${articleId}`);
      process.exit(1);
    }

    console.log(`\n📝 Article: ${articleId}`);
    console.log(`   Source: ${article.source}`);
    console.log(`   Last modified: ${article.last_modified}`);
    console.log(`   Transforms: ${article.transforms_generated || 'Not generated'}`);
    console.log('\n   Platform Status:');
    for (const [platform, info] of Object.entries(article.platforms)) {
      const statusEmoji = info.status === 'published' ? '✅' : info.status === 'pending' ? '⏳' : '📝';
      console.log(`   ${statusEmoji} ${platform}: ${info.status}`);
      if (info.published_at) console.log(`      Published: ${info.published_at}`);
      if (info.url) console.log(`      URL: ${info.url}`);
      if (info.notes) console.log(`      Notes: ${info.notes}`);
    }
  } else {
    // Show all articles with summary
    console.log('\n📊 Publishing Status\n');

    if (Object.keys(status.articles).length === 0) {
      console.log('No articles tracked. Run: tsx publish-tracker.ts init\n');
      return;
    }

    for (const [slug, article] of Object.entries(status.articles).sort()) {
      const blogStatus = article.platforms.blog.status;
      const blogEmoji = blogStatus === 'published' ? '✅' : '📝';
      console.log(`${blogEmoji} ${slug}`);

      const platforms = ['linkedin', 'twitter', 'substack'];
      for (const platform of platforms) {
        const info = article.platforms[platform as Platform];
        const emoji = info.status === 'published' ? '✅' : info.status === 'pending' ? '⏳' : '📝';
        console.log(`   ${emoji} ${platform}`);
      }
      console.log('');
    }

    console.log('Stats:');
    console.log(`  Total articles: ${status.stats.total_articles}`);
    console.log(`  Blog: ${status.stats.published_blog}/${status.stats.total_articles} published`);
    console.log(`  LinkedIn: ${status.stats.published_linkedin}/${status.stats.total_articles} published`);
    console.log(`  Twitter: ${status.stats.published_twitter}/${status.stats.total_articles} published`);
    console.log(`  Substack: ${status.stats.published_substack}/${status.stats.total_articles} published`);
  }
}

/**
 * Mark article as published on a platform
 */
function markPublished(
  articleId: string,
  platform: Platform,
  url?: string,
  notes?: string
): void {
  console.log(`📝 Marking ${articleId} as published on ${platform}...\n`);

  const status = readStatus();

  if (!status.articles[articleId]) {
    console.error(`❌ Article not found: ${articleId}`);
    process.exit(1);
  }

  const now = new Date().toISOString().split('T')[0];
  status.articles[articleId].platforms[platform].status = 'published';
  status.articles[articleId].platforms[platform].published_at = now;
  if (url) {
    status.articles[articleId].platforms[platform].url = url;
  }
  if (notes) {
    status.articles[articleId].platforms[platform].notes = notes;
  }

  status.stats = calculateStats(status);
  writeStatus(status);

  console.log(`✅ ${articleId} marked as published on ${platform}`);
  if (url) console.log(`   URL: ${url}`);
  if (notes) console.log(`   Notes: ${notes}`);
}

/**
 * Update transforms_generated timestamp
 */
function markTransformsGenerated(articleId?: string): void {
  const status = readStatus();
  const now = new Date().toISOString();

  if (articleId) {
    if (!status.articles[articleId]) {
      console.error(`❌ Article not found: ${articleId}`);
      process.exit(1);
    }
    status.articles[articleId].transforms_generated = now;
    console.log(`✅ Updated transforms timestamp for ${articleId}`);
  } else {
    for (const slug of Object.keys(status.articles)) {
      status.articles[slug].transforms_generated = now;
    }
    console.log(`✅ Updated transforms timestamp for all articles`);
  }

  writeStatus(status);
}

/**
 * Parse command line arguments
 */
function parseArgs(): {
  command: string;
  articleId?: string;
  platform?: Platform;
  url?: string;
  notes?: string;
} {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';

  return {
    command,
    articleId: args[1],
    platform: args[2] as Platform,
    url: args['--url'],
    notes: args['--notes'],
  };
}

/**
 * Main entry point
 */
function main(): void {
  const { command, articleId, platform, url, notes } = parseArgs();

  switch (command) {
    case 'init':
      initStatus();
      break;

    case 'status':
      showStatus(articleId);
      break;

    case 'mark':
      if (!articleId || !platform) {
        console.error('Usage: tsx publish-tracker.ts mark <article-id> <platform> [--url=URL] [--notes=NOTES]');
        console.error('Platforms: blog, linkedin, twitter, substack');
        process.exit(1);
      }
      markPublished(articleId, platform, url, notes);
      break;

    case 'transforms-generated':
      markTransformsGenerated(articleId);
      break;

    default:
      console.error(`Unknown command: ${command}`);
      console.error('Usage: tsx publish-tracker.ts <command> [args]');
      console.error('Commands:');
      console.error('  init                      Initialize status from articles');
      console.error('  status [article-id]        Show publishing status');
      console.error('  mark <article-id> <platform>  Mark as published');
      console.error('  transforms-generated [article-id] Update transforms timestamp');
      process.exit(1);
  }
}

main();
