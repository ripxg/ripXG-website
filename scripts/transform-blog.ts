#!/usr/bin/env tsx
/**
 * Transform: MD → MDX for Blog
 *
 * Reads MD files from /content/articles/ and generates MDX files
 * for the Next.js blog in /content/transforms/blog/
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');
const BLOG_TRANSFORM_DIR = path.join(process.cwd(), 'content', 'transforms', 'blog');

// Ensure transform directory exists
if (!fs.existsSync(BLOG_TRANSFORM_DIR)) {
  fs.mkdirSync(BLOG_TRANSFORM_DIR, { recursive: true });
}

/**
 * Extract original date from raw file content (before gray-matter parsing)
 */
function extractOriginalDate(fileContent: string): string | null {
  // Find the YAML frontmatter section
  const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;

  const yamlContent = frontmatterMatch[1];
  const dateMatch = yamlContent.match(/^date:\s*(.+)$/m);
  return dateMatch ? dateMatch[1].trim() : null;
}

/**
 * Convert unified frontmatter to blog-specific MDX format
 */
function convertToBlogFrontmatter(
  frontmatter: Record<string, any>,
  originalDate: string | null
): string {
  const {
    id,
    title,
    updated,
    tags = [],
    summary = '',
    status,
    canonical_url,
  } = frontmatter;

  // Use original date if available, otherwise fall back to parsed date
  const dateValue = originalDate || frontmatter.date;

  // Build YAML frontmatter for blog MDX
  const summaryLines = summary
    .split('\n')
    .map((line: string) => `  ${line.trim()}`)
    .filter((line: string) => line.trim() !== '' || line.length > 2);

  // Quote title to handle special characters like brackets, quotes, etc.
  const quotedTitle = title.includes("'") ? `"${title}"` : `'${title}'`;

  const blogFrontmatter = [
    '---',
    `title: ${quotedTitle}`,
    `date: '${dateValue}'`,
    `tags: [${tags.join(', ')}]`,
    `summary: >`,
    ...summaryLines,
    '',
    `status: ${status}`,
    `canonical_url: ${canonical_url}`,
    '',
    // Legacy fields for backward compatibility with existing blog code
    `wordpressId: ${frontmatter.legacy?.wordpress_id || ''}`,
    `wordpressUrl: '${frontmatter.legacy?.wordpress_url || ''}'`,
    '---',
    '',
  ];

  return blogFrontmatter.join('\n');
}

/**
 * Transform MD content to MDX for blog
 */
function transformForBlog(articlePath: string): void {
  const filename = path.basename(articlePath);
  const outputPath = path.join(BLOG_TRANSFORM_DIR, filename.replace('.md', '.mdx'));

  console.log(`Transforming: ${filename} → blog MDX`);

  // Read article content
  const fileContent = fs.readFileSync(articlePath, 'utf-8');

  // Extract original date before gray-matter parsing
  const originalDate = extractOriginalDate(fileContent);

  // Parse article with gray-matter
  const { data: frontmatter, content } = matter(fileContent);

  // Skip if article is disabled for blog
  if (frontmatter.platforms?.blog?.enabled === false) {
    console.log(`  ⏭ Skipped (blog disabled)`);
    return;
  }

  // Convert frontmatter
  const blogFrontmatter = convertToBlogFrontmatter(frontmatter, originalDate);

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
  console.log(`📁 Output directory: ${BLOG_TRANSFORM_DIR}`);
}

// Run transformation
transformAll();
