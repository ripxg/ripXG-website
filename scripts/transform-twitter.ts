#!/usr/bin/env tsx
/**
 * Transform: Article → Twitter/X promo tweet
 *
 * Reads MD files from /content/articles/ and generates a single
 * promo tweet JSON per article in /content/transforms/twitter/
 *
 * Tweet format:
 *   <hook from first paragraph or summary>
 *
 *   <canonical_url>
 *
 * Max 280 chars. Prefers summary over first paragraph if it fits cleanly.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');
const TWITTER_TRANSFORM_DIR = path.join(process.cwd(), 'content', 'transforms', 'twitter');

if (!fs.existsSync(TWITTER_TRANSFORM_DIR)) {
  fs.mkdirSync(TWITTER_TRANSFORM_DIR, { recursive: true });
}

const MAX_TWEET_LENGTH = 280;
// Twitter counts URLs as 23 chars regardless of actual length
const TWITTER_URL_LENGTH = 23;

/**
 * Strip markdown formatting for plain tweet text
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/^#+\s+/gm, '')           // headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
    .replace(/\*([^*]+)\*/g, '$1')     // italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text only
    .replace(/`([^`]+)`/g, '$1')       // inline code
    .replace(/\n{2,}/g, ' ')           // collapse newlines
    .replace(/\[&hellip;\]/g, '')      // strip WordPress hellip
    .trim();
}

/**
 * Build tweet text: hook + URL, within 280 chars
 * URL counts as 23 chars on Twitter regardless of length.
 */
function buildTweet(summary: string | undefined, content: string, canonicalUrl: string): string {
  // Available chars for hook text = 280 - 1 (newline) - 23 (URL)
  const maxHookLength = MAX_TWEET_LENGTH - 1 - TWITTER_URL_LENGTH;

  // Try summary first, then first paragraph of content
  const candidates = [
    summary ? stripMarkdown(summary) : null,
    stripMarkdown(content.split('\n\n')[0]),
  ].filter(Boolean) as string[];

  let hook = '';
  for (const candidate of candidates) {
    if (candidate.length <= maxHookLength) {
      hook = candidate;
      break;
    }
    // Truncate at last sentence boundary within limit
    const truncated = candidate.substring(0, maxHookLength - 1);
    const lastPeriod = Math.max(
      truncated.lastIndexOf('. '),
      truncated.lastIndexOf('? '),
      truncated.lastIndexOf('! ')
    );
    hook = lastPeriod > 80
      ? truncated.substring(0, lastPeriod + 1)
      : truncated.substring(0, maxHookLength - 3) + '...';
    break;
  }

  return `${hook}\n\n${canonicalUrl}`;
}

function transformForTwitter(articlePath: string): void {
  const filename = path.basename(articlePath);
  const slug = filename.replace('.md', '');
  const outputPath = path.join(TWITTER_TRANSFORM_DIR, `${slug}.json`);

  console.log(`Transforming: ${filename} → tweet`);

  const fileContent = fs.readFileSync(articlePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);

  if (frontmatter.platforms?.twitter?.enabled === false) {
    console.log(`  ⏭ Skipped (Twitter disabled)`);
    return;
  }

  const { canonical_url, summary } = frontmatter;
  if (!canonical_url) {
    console.log(`  ⚠️  No canonical_url — skipped`);
    return;
  }

  const tweetText = buildTweet(summary, content, canonical_url);
  // Effective length: actual text minus URL length + Twitter URL length
  const effectiveLength = tweetText.length - canonical_url.length + TWITTER_URL_LENGTH;

  const output = {
    article_id: slug,
    tweet: tweetText,
    char_count: effectiveLength,
    canonical_url,
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`  ✓ Saved (${effectiveLength} chars): ${outputPath}`);
  console.log(`  Preview: ${tweetText.substring(0, 100)}...`);
}

function transformAll(): void {
  console.log('🔄 Transforming articles → Twitter promo tweets...\n');

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
    transformForTwitter(articlePath);
    console.log('');
  }

  console.log('✅ Twitter transform complete!');
  console.log(`📁 Output: ${TWITTER_TRANSFORM_DIR}`);
}

transformAll();
