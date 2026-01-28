#!/usr/bin/env tsx
/**
 * Migration Script: MDX → Unified MD
 *
 * Reads existing MDX files from /content/blog/ and converts them to
 * the new unified MD format in /content/articles/
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const BLOG_DIR = path.join(CONTENT_DIR, 'blog');
const ARTICLES_DIR = path.join(CONTENT_DIR, 'articles');

// Ensure articles directory exists
if (!fs.existsSync(ARTICLES_DIR)) {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
}

/**
 * Extract slug from filename (strip date prefix)
 * Example: "2026-01-05-writing-ideas-into-reality.mdx" → "writing-ideas-into-reality"
 * Example: "2025-10-17-observability-updates.mdx" → "2025-10-observability-updates"
 */
function extractSlug(filename: string): string {
  const withoutExt = filename.replace(/\.mdx?$/, '');
  // Check for date prefix (YYYY-MM-DD-)
  const dateMatch = withoutExt.match(/^(\d{4}-\d{2})-\d{2}-(.+)$/);
  if (dateMatch) {
    // For series posts that repeat (like monthly updates), include year-month
    const yearMonth = dateMatch[1];
    const slug = dateMatch[2];
    return `${yearMonth}-${slug}`;
  }
  // Fallback: remove full date prefix
  return withoutExt.replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

/**
 * Convert WordPress date string to ISO format
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Generate canonical URL from slug
 */
function generateCanonicalUrl(slug: string): string {
  return `https://ripxg.com/blog/${slug}`;
}

/**
 * Convert old frontmatter to new unified schema
 */
function convertFrontmatter(
  oldFrontmatter: Record<string, any>,
  slug: string
): string {
  const {
    title,
    date,
    tags = [],
    summary = '',
    status = 'draft',
    wordpressId,
    wordpressUrl,
  } = oldFrontmatter;

  const formattedDate = formatDate(date);
  const canonicalUrl = generateCanonicalUrl(slug);
  const blogUrl = canonicalUrl;

  // Build YAML frontmatter
  const newFrontmatter = [
    '---',
    `id: ${slug}`,
    `title: "${title.replace(/"/g, '\\"')}"`,
    `author: Jeff`,
    `date: ${formattedDate}`,
    `updated: ${formattedDate}`,
    `tags: [${tags.join(', ')}]`,
    `summary: >`,
    ...summary.split('\n').map((line: string) => `  ${line.trim()}`),
    '',
    `featured_image: null`,
    `status: ${status}`,
    `canonical_url: ${canonicalUrl}`,
    '',
    'platforms:',
    '  blog:',
    '    enabled: true',
    `    published_at: ${formattedDate}`,
    `    url: ${blogUrl}`,
    '  linkedin:',
    '    enabled: true',
    '    published_at: null',
    '  twitter:',
    '    enabled: true',
    '    published_at: null',
    '  substack:',
    '    enabled: true',
    '    published_at: null',
  ];

  // Add legacy section if WordPress data exists
  if (wordpressId || wordpressUrl) {
    newFrontmatter.push('', 'legacy:');
    if (wordpressId) {
      newFrontmatter.push(`  wordpress_id: ${wordpressId}`);
    }
    if (wordpressUrl) {
      newFrontmatter.push(`  wordpress_url: '${wordpressUrl}'`);
    }
  }

  newFrontmatter.push('---', '');

  return newFrontmatter.join('\n');
}

/**
 * Clean MDX content by removing MDX-specific syntax
 * For now, we keep content as-is since existing posts don't use MDX components
 */
function cleanMdxContent(content: string): string {
  // Remove HTML entity references like &hellip;
  let cleaned = content.replace(/&hellip;/g, '...');
  cleaned = cleaned.replace(/&[a-z]+;/g, (match) => {
    const entities: Record<string, string> = {
      '&nbsp;': ' ',
      '&mdash;': '—',
      '&ndash;': '–',
      '&ldquo;': '"',
      '&rdquo;': '"',
      '&lsquo;': "'",
      '&rsquo;': "'",
    };
    return entities[match] || match;
  });

  return cleaned;
}

/**
 * Main migration function
 */
function migrateFile(mdxFile: string): void {
  const filename = path.basename(mdxFile);
  const slug = extractSlug(filename);
  const outputPath = path.join(ARTICLES_DIR, `${slug}.md`);

  console.log(`Migrating: ${filename} → ${slug}.md`);

  // Read and parse MDX file
  const fileContent = fs.readFileSync(mdxFile, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);

  // Convert frontmatter
  const newFrontmatter = convertFrontmatter(frontmatter, slug);

  // Clean content
  const cleanedContent = cleanMdxContent(content);

  // Write new MD file
  const fullContent = newFrontmatter + cleanedContent;
  fs.writeFileSync(outputPath, fullContent, 'utf-8');

  console.log(`  ✓ Saved to: ${outputPath}`);
}

/**
 * Migrate all MDX files
 */
function migrateAll(): void {
  console.log('🚀 Starting MDX → MD migration...\n');

  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`❌ Blog directory not found: ${BLOG_DIR}`);
    process.exit(1);
  }

  const mdxFiles = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => path.join(BLOG_DIR, f))
    .sort();

  console.log(`Found ${mdxFiles.length} MDX files\n`);

  for (const mdxFile of mdxFiles) {
    migrateFile(mdxFile);
    console.log('');
  }

  console.log('✅ Migration complete!\n');
  console.log(`📁 Articles directory: ${ARTICLES_DIR}`);
  console.log(`📊 Total migrated: ${mdxFiles.length}`);
}

// Run migration
migrateAll();
