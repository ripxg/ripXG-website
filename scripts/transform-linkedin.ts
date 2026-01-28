#!/usr/bin/env tsx
/**
 * Transform: MD → LinkedIn Format
 *
 * Reads MD files from /content/articles/ and generates plain text
 * formatted for LinkedIn posts in /content/transforms/linkedin/
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');
const LINKEDIN_TRANSFORM_DIR = path.join(process.cwd(), 'content', 'transforms', 'linkedin');

// Ensure transform directory exists
if (!fs.existsSync(LINKEDIN_TRANSFORM_DIR)) {
  fs.mkdirSync(LINKEDIN_TRANSFORM_DIR, { recursive: true });
}

/**
 * Convert markdown to LinkedIn-friendly plain text
 */
function markdownToLinkedIn(text: string): string {
  let result = text;

  // Remove markdown headers, keep content
  result = result.replace(/^#+\s+(.+)$/gm, '$1');

  // Remove code blocks (LinkedIn doesn't render them well)
  result = result.replace(/```[\s\S]*?```/g, '[Code block omitted]');

  // Remove inline code
  result = result.replace(/`([^`]+)`/g, '$1');

  // Convert bold markdown to CAPS for emphasis (or remove)
  result = result.replace(/\*\*([^*]+)\*\*/g, (match, content) => {
    // CAPS only for short phrases
    return content.length <= 20 ? content.toUpperCase() : content;
  });

  // Convert italic markdown
  result = result.replace(/\*([^*]+)\*/g, '$1');

  // Convert markdown lists to bullet points
  result = result.replace(/^[\s]*-[\s]+(.+)$/gm, '→ $1');
  result = result.replace(/^[\s]*\d+\.[\s]+(.+)$/gm, '• $1');

  // Convert markdown links to plain text format
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1\n$2');

  // Clean up multiple consecutive newlines
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim();
}

/**
 * Generate hashtags from tags array
 */
function generateHashtags(tags: string[]): string {
  if (!tags || tags.length === 0) return '';

  const validTags = tags
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .slice(0, 5); // Max 5 hashtags recommended

  if (validTags.length === 0) return '';

  return '\n\n' + validTags.map((tag) => `#${tag.replace(/\s+/g, '')}`).join(' ');
}

/**
 * Transform article to LinkedIn format
 */
function transformForLinkedIn(articlePath: string): void {
  const filename = path.basename(articlePath);
  const slug = filename.replace('.md', '');
  const outputPath = path.join(LINKEDIN_TRANSFORM_DIR, `${slug}.txt`);

  console.log(`Transforming: ${filename} → LinkedIn format`);

  // Read and parse article
  const fileContent = fs.readFileSync(articlePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);

  // Skip if article is disabled for LinkedIn
  if (frontmatter.platforms?.linkedin?.enabled === false) {
    console.log(`  ⏭ Skipped (LinkedIn disabled)`);
    return;
  }

  const { title, tags = [], canonical_url, summary } = frontmatter;

  // Convert markdown to LinkedIn format
  const formattedContent = markdownToLinkedIn(content);

  // Build LinkedIn post
  let linkedinPost = '';

  // Add title as header
  if (title) {
    linkedinPost += `${title.toUpperCase()}\n\n`;
  }

  // Add summary if available and different from content
  if (summary && summary.length > 0) {
    linkedinPost += `${summary.trim()}\n\n`;
  }

  // Add main content
  linkedinPost += formattedContent;

  // Add link to canonical URL
  if (canonical_url) {
    linkedinPost += `\n\n---\n🔗 Read more: ${canonical_url}`;
  }

  // Add hashtags
  linkedinPost += generateHashtags(tags);

  // Add image reference if featured image exists
  if (frontmatter.featured_image) {
    linkedinPost += `\n\n📷 Image: ${frontmatter.featured_image}`;
  }

  // LinkedIn posts should be under 3000 characters for regular posts
  const charCount = linkedinPost.length;
  if (charCount > 3000) {
    console.log(`  ⚠ Warning: Post is ${charCount} characters (limit: ~3000)`);
    console.log(`     Consider using LinkedIn Article format for longer content`);
  }

  // Write to file
  fs.writeFileSync(outputPath, linkedinPost, 'utf-8');

  console.log(`  ✓ Saved to: ${outputPath} (${charCount} chars)`);
}

/**
 * Transform all articles for LinkedIn
 */
function transformAll(): void {
  console.log('🔄 Transforming MD → LinkedIn format...\n');

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
    transformForLinkedIn(articlePath);
    console.log('');
  }

  console.log('✅ LinkedIn transformation complete!\n');
  console.log(`📁 Output directory: ${LINKEDIN_TRANSFORM_DIR}`);
}

// Run transformation
transformAll();
