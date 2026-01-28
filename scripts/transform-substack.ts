#!/usr/bin/env tsx
/**
 * Transform: MD → Substack Newsletter Format
 *
 * Reads MD files from /content/articles/ and generates markdown
 * formatted for Substack in /content/transforms/substack/
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');
const SUBSTACK_TRANSFORM_DIR = path.join(process.cwd(), 'content', 'transforms', 'substack');

// Ensure transform directory exists
if (!fs.existsSync(SUBSTACK_TRANSFORM_DIR)) {
  fs.mkdirSync(SUBSTACK_TRANSFORM_DIR, { recursive: true });
}

const SUBSTACK_URL = 'https://ripxg.substack.com';

/**
 * Convert relative image URLs to absolute URLs
 */
function convertImageUrls(text: string, articleId: string): string {
  // Convert /images/ to full URL
  return text.replace(/!\[([^\]]*)\]\((\/images\/[^)]+)\)/g, (match, alt, url) => {
    return `![${alt}](https://ripxg.com${url})`;
  });
}

/**
 * Transform article to Substack format
 */
function transformForSubstack(articlePath: string): void {
  const filename = path.basename(articlePath);
  const slug = filename.replace('.md', '');
  const outputPath = path.join(SUBSTACK_TRANSFORM_DIR, `${slug}.md`);

  console.log(`Transforming: ${filename} → Substack format`);

  // Read and parse article
  const fileContent = fs.readFileSync(articlePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);

  // Skip if article is disabled for Substack
  if (frontmatter.platforms?.substack?.enabled === false) {
    console.log(`  ⏭ Skipped (Substack disabled)`);
    return;
  }

  const { title, canonical_url, summary } = frontmatter;

  // Convert image URLs to absolute
  let substackContent = convertImageUrls(content, slug);

  // Build Substack post
  let substackPost = '';

  // Add title (substack uses first line as title)
  if (title) {
    substackPost += `# ${title}\n\n`;
  }

  // Add summary as intro if available
  if (summary && summary.length > 0) {
    substackPost += `${summary.trim()}\n\n---\n\n`;
  }

  // Add main content
  substackPost += substackContent;

  // Add footer with canonical link and subscribe CTA
  substackPost += `\n\n---\n\n`;
  substackPost += `*Originally published at [ripxg.com](${canonical_url})*\n\n`;
  substackPost += `**[Subscribe to get articles like this in your inbox →](${SUBSTACK_URL})**`;

  // Write to file
  fs.writeFileSync(outputPath, substackPost, 'utf-8');

  console.log(`  ✓ Saved to: ${outputPath}`);
}

/**
 * Transform all articles for Substack
 */
function transformAll(): void {
  console.log('🔄 Transforming MD → Substack format...\n');

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
    transformForSubstack(articlePath);
    console.log('');
  }

  console.log('✅ Substack transformation complete!\n');
  console.log(`📁 Output directory: ${SUBSTACK_TRANSFORM_DIR}`);
}

// Run transformation
transformAll();
