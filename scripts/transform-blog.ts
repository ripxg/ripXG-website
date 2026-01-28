#!/usr/bin/env tsx
/**
 * Transform: MD → MDX for Blog
 *
 * Reads MD files from /content/articles/ and generates MDX files
 * for Next.js blog in /content/blog/
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');
const BLOG_OUTPUT_DIR = path.join(process.cwd(), 'content', 'blog');

// Ensure blog directory exists
if (!fs.existsSync(BLOG_OUTPUT_DIR)) {
  fs.mkdirSync(BLOG_OUTPUT_DIR, { recursive: true });
}

/**
 * Format date as YYYY-MM-DD for blog slugs and frontmatter
 */
function formatDateForBlog(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generate blog slug from article id and date
 * Format: YYYY-MM-DD-slug (matches existing blog naming)
 *
 * Article ID format: YYYY-MM-slug
 * We extract YYYY-MM from the ID and add DD from date
 */
function generateBlogSlug(articleId: string, dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // Extract slug portion from article ID (remove YYYY-MM- prefix if present)
  const slugMatch = articleId.match(/^\d{4}-\d{2}-(.+)$/);
  const slugPart = slugMatch ? slugMatch[1] : articleId;

  return `${year}-${month}-${day}-${slugPart}`;
}

/**
 * Escape YAML special characters in strings
 */
function escapeYamlString(str: string): string {
  return str
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ');
}

/**
 * Convert unified frontmatter to blog-specific MDX format
 */
function convertToBlogFrontmatter(
  frontmatter: Record<string, any>,
  slug: string
): string {
  const { title, date, tags = [], summary, status, canonical_url } = frontmatter;
  const formattedDate = formatDateForBlog(date);

  // Build YAML frontmatter for blog MDX - single block with no blank lines
  const lines = [
    '---',
    `title: "${escapeYamlString(title)}"`,
    `date: ${formattedDate}`,
  ];

  // Only include tags if non-empty
  if (tags && tags.length > 0) {
    lines.push(`tags: [${tags.map((t: string) => `'${escapeYamlString(t)}'`).join(', ')}]`);
  }

  // Add summary if present (as single line, trimmed)
  if (summary && summary.trim()) {
    const escapedSummary = escapeYamlString(summary).trim();
    // If summary is long, use folded scalar syntax >
    if (escapedSummary.length > 100) {
      lines.push('summary: >');
      lines.push(`  ${escapedSummary}`);
    } else {
      lines.push(`summary: "${escapedSummary}"`);
    }
  }

  lines.push(`status: ${status || 'published'}`);

  if (canonical_url) {
    lines.push(`canonical_url: ${canonical_url}`);
  }

  lines.push('---');
  lines.push('');

  return lines.join('\n');
}

/**
 * Transform MD content to MDX for blog
 */
function transformForBlog(articlePath: string): void {
  const filename = path.basename(articlePath);
  const { name: articleId, ext } = path.parse(filename);

  if (ext !== '.md') {
    console.log(`  ⏭ Skipped: ${filename} (not a markdown file)`);
    return;
  }

  // Read and parse article
  const fileContent = fs.readFileSync(articlePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);

  // Skip if article is disabled for blog
  if (frontmatter.platforms?.blog?.enabled === false) {
    console.log(`  ⏭ Skipped: ${filename} (blog disabled)`);
    return;
  }

  // Generate blog slug and output filename
  const blogSlug = generateBlogSlug(articleId, frontmatter.date);
  const outputFilename = `${blogSlug}.mdx`;
  const outputPath = path.join(BLOG_OUTPUT_DIR, outputFilename);

  console.log(`Transforming: ${filename} → ${outputFilename}`);

  // Convert frontmatter
  const blogFrontmatter = convertToBlogFrontmatter(frontmatter, blogSlug);

  // Content stays as-is (markdown is compatible with MDX)
  const mdxContent = blogFrontmatter + content;

  // Write MDX file
  fs.writeFileSync(outputPath, mdxContent, 'utf-8');

  console.log(`  ✓ Saved to: ${outputPath}`);
}

/**
 * Transform all articles for blog
 */
function transformAll(): void {
  console.log('🔄 Transforming MD → MDX for blog...\n');

  if (!fs.existsSync(ARTICLES_DIR)) {
    console.error(`❌ Articles directory not found: ${ARTICLES_DIR}`);
    process.exit(1);
  }

  const articleFiles = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.md') && f !== '.gitkeep')
    .map((f) => path.join(ARTICLES_DIR, f))
    .sort();

  console.log(`Found ${articleFiles.length} articles\n`);

  for (const articlePath of articleFiles) {
    transformForBlog(articlePath);
    console.log('');
  }

  console.log('✅ Blog transformation complete!\n');
  console.log(`📁 Output directory: ${BLOG_OUTPUT_DIR}`);
}

// Run transformation
transformAll();
