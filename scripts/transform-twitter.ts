#!/usr/bin/env tsx
/**
 * Transform: MD → Twitter Thread
 *
 * Reads MD files from /content/articles/ and generates thread JSON
 * for Twitter/X in /content/transforms/twitter/
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');
const TWITTER_TRANSFORM_DIR = path.join(process.cwd(), 'content', 'transforms', 'twitter');

// Ensure transform directory exists
if (!fs.existsSync(TWITTER_TRANSFORM_DIR)) {
  fs.mkdirSync(TWITTER_TRANSFORM_DIR, { recursive: true });
}

const MAX_TWEET_LENGTH = 280;

/**
 * Convert markdown to Twitter-friendly text
 */
function markdownToTwitter(text: string): string {
  let result = text;

  // Remove markdown headers, keep content
  result = result.replace(/^#+\s+(.+)$/gm, '$1');

  // Remove code blocks
  result = result.replace(/```[\s\S]*?```/g, '');

  // Remove inline code
  result = result.replace(/`([^`]+)`/g, '$1');

  // Remove markdown formatting (bold, italic)
  result = result.replace(/\*\*([^*]+)\*\*/g, '$1');
  result = result.replace(/\*([^*]+)\*/g, '$1');

  // Convert markdown lists
  result = result.replace(/^[\s]*-[\s]+(.+)$/gm, '• $1');
  result = result.replace(/^[\s]*\d+\.[\s]+(.+)$/gm, '• $1');

  // Convert markdown links to plain text
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 $2');

  // Clean up multiple consecutive newlines
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim();
}

/**
 * Create a compelling hook for the first tweet
 */
function createHook(content: string, summary?: string): string {
  if (summary && summary.length > 0) {
    // Try to use first sentence of summary
    const firstSentence = summary.split(/[.!?]/)[0];
    if (firstSentence.length > 20 && firstSentence.length <= 200) {
      return firstSentence + ' 🧵';
    }
  }

  // Get first paragraph of content
  const firstParagraph = content.split('\n\n')[0];
  if (firstParagraph.length <= 250) {
    return firstParagraph + ' 🧵';
  }

  // Fallback: truncate first paragraph
  return firstParagraph.substring(0, 240) + '... 🧵';
}

/**
 * Create final CTA tweet
 */
function createCtaTweet(canonicalUrl: string): string {
  return `Read the full article:\n${canonicalUrl}`;
}

/**
 * Smart chunking for Twitter thread
 * Breaks text into tweets while respecting sentence boundaries
 */
function chunkIntoTweets(
  text: string,
  firstTweet: string,
  lastTweet: string
): string[] {
  const tweets: string[] = [];
  let remainingContent = text;

  // Remove first paragraph from content if it was used in hook
  const firstPara = remainingContent.split('\n\n')[0];
  if (firstTweet.replace(' 🧵', '').includes(firstPara.substring(0, 50))) {
    remainingContent = remainingContent.substring(firstPara.length).trim();
  }

  // Split into paragraphs
  const paragraphs = remainingContent.split('\n\n').filter(p => p.trim().length > 0);

  let currentTweet = '';

  for (const para of paragraphs) {
    const trimmedPara = para.trim();

    // If paragraph fits in current tweet
    if ((currentTweet + '\n\n' + trimmedPara).length <= MAX_TWEET_LENGTH) {
      currentTweet = currentTweet ? currentTweet + '\n\n' + trimmedPara : trimmedPara;
      continue;
    }

    // Save current tweet if it exists
    if (currentTweet) {
      tweets.push(currentTweet);
      currentTweet = '';
    }

    // If paragraph fits alone
    if (trimmedPara.length <= MAX_TWEET_LENGTH) {
      tweets.push(trimmedPara);
      continue;
    }

    // Paragraph is too long, need to split by sentences
    const sentences = trimmedPara.split(/(?<=[.!?])\s+/);
    let currentSentence = '';

    for (const sentence of sentences) {
      if ((currentSentence + ' ' + sentence).trim().length <= MAX_TWEET_LENGTH) {
        currentSentence = (currentSentence + ' ' + sentence).trim();
      } else {
        if (currentSentence) {
          tweets.push(currentSentence);
        }
        currentSentence = sentence.trim();

        // Sentence itself is too long, force split
        if (currentSentence.length > MAX_TWEET_LENGTH) {
          const parts = [];
          while (currentSentence.length > 0) {
            const part = currentSentence.substring(0, MAX_TWEET_LENGTH - 1) + '-';
            parts.push(part);
            currentSentence = currentSentence.substring(MAX_TWEET_LENGTH - 1).trim();
          }
          tweets.push(...parts.slice(0, -1));
          currentSentence = parts[parts.length - 1];
        }
      }
    }

    if (currentSentence) {
      currentTweet = currentSentence;
    }
  }

  // Add final partial tweet
  if (currentTweet) {
    tweets.push(currentTweet);
  }

  // Add first and last tweets
  const fullThread = [firstTweet, ...tweets, lastTweet];

  // Filter out empty tweets
  return fullThread.filter(t => t.trim().length > 0);
}

/**
 * Transform article to Twitter thread
 */
function transformForTwitter(articlePath: string): void {
  const filename = path.basename(articlePath);
  const slug = filename.replace('.md', '');
  const outputPath = path.join(TWITTER_TRANSFORM_DIR, `${slug}.json`);

  console.log(`Transforming: ${filename} → Twitter thread`);

  // Read and parse article
  const fileContent = fs.readFileSync(articlePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);

  // Skip if article is disabled for Twitter
  if (frontmatter.platforms?.twitter?.enabled === false) {
    console.log(`  ⏭ Skipped (Twitter disabled)`);
    return;
  }

  const { canonical_url, summary, featured_image } = frontmatter;

  // Convert markdown to Twitter format
  const twitterContent = markdownToTwitter(content);

  // Create hook and CTA
  const hook = createHook(twitterContent, summary);
  const cta = createCtaTweet(canonical_url);

  // Chunk into tweets
  const tweets = chunkIntoTweets(twitterContent, hook, cta);

  // Build thread object
  const thread = tweets.map((text, index) => ({
    index: index + 1,
    text,
    // Add image to first tweet if featured image exists
    image: index === 0 && featured_image ? featured_image : null,
  }));

  const threadObject = {
    article_id: slug,
    thread,
    total_tweets: thread.length,
    canonical_url,
  };

  // Write to JSON file
  fs.writeFileSync(outputPath, JSON.stringify(threadObject, null, 2), 'utf-8');

  console.log(`  ✓ Saved to: ${outputPath} (${thread.length} tweets)`);
}

/**
 * Transform all articles for Twitter
 */
function transformAll(): void {
  console.log('🔄 Transforming MD → Twitter thread...\n');

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

  console.log('✅ Twitter transformation complete!\n');
  console.log(`📁 Output directory: ${TWITTER_TRANSFORM_DIR}`);
}

// Run transformation
transformAll();
