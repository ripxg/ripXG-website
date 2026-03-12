#!/usr/bin/env tsx
/**
 * Post new blog posts to Twitter/X
 *
 * Usage:
 *   tsx scripts/post-blog-to-twitter.ts content/blog/2026-03-10-my-post.mdx [...]
 *
 * Reads frontmatter from each MDX file, composes a tweet from the summary
 * and canonical URL, and posts via OAuth 1.0a. No LLM required.
 *
 * Required env vars:
 *   TWITTER_API_KEY
 *   TWITTER_API_SECRET
 *   TWITTER_ACCESS_TOKEN
 *   TWITTER_ACCESS_SECRET
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { TwitterApi } from 'twitter-api-v2';

const TRACKER_FILE = path.join(process.cwd(), 'content', 'twitter-posted.json');
const MAX_TWEET_LENGTH = 280;
const MAX_SUMMARY_LENGTH = 200;

// ─── Tracker ────────────────────────────────────────────────────────────────

function readTracker(): Set<string> {
  if (!fs.existsSync(TRACKER_FILE)) return new Set();
  const data = JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf-8'));
  return new Set(data.posted ?? []);
}

function writeTracker(posted: Set<string>): void {
  const data = {
    posted: Array.from(posted).sort(),
    updated_at: new Date().toISOString(),
  };
  fs.writeFileSync(TRACKER_FILE, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

// ─── Tweet composition ───────────────────────────────────────────────────────

function composeTweet(summary: string, canonicalUrl: string, customTweet?: string): string {
  // If custom tweet provided, use it directly (supports X Premium long posts)
  if (customTweet) {
    const text = customTweet.trim();
    return `${text}\n\n${canonicalUrl}`;
  }

  // Strip [&hellip;] / [...] trailing markers
  let text = summary.replace(/\s*\[(&hellip;|\.\.\.)\]\s*$/i, '').trim();

  // Trim to first sentence if very long
  const firstSentenceEnd = text.search(/[.!?]/);
  if (firstSentenceEnd > 40 && firstSentenceEnd < MAX_SUMMARY_LENGTH) {
    text = text.slice(0, firstSentenceEnd + 1).trim();
  } else if (text.length > MAX_SUMMARY_LENGTH) {
    // Trim to last word boundary within limit
    text = text.slice(0, MAX_SUMMARY_LENGTH).replace(/\s+\S*$/, '').trim() + '...';
  }

  const tweet = `${text}\n\n${canonicalUrl}`;

  if (tweet.length > MAX_TWEET_LENGTH) {
    const available = MAX_TWEET_LENGTH - canonicalUrl.length - 4; // 4 = "\n\n" + "..."
    text = text.slice(0, available).replace(/\s+\S*$/, '').trim() + '...';
    return `${text}\n\n${canonicalUrl}`;
  }

  return tweet;
}

// ─── Post ────────────────────────────────────────────────────────────────────

async function postFile(filePath: string, client: TwitterApi, tracker: Set<string>): Promise<boolean> {
  const slug = path.basename(filePath, '.mdx');

  if (tracker.has(slug)) {
    console.log(`  ⏭  ${slug} already posted, skipping`);
    return false;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data: fm } = matter(raw);

  if (!fm.summary || !fm.canonical_url) {
    console.warn(`  ⚠️  ${slug}: missing summary or canonical_url in frontmatter, skipping`);
    return false;
  }

  if (fm.status !== 'published') {
    console.log(`  ⏭  ${slug}: status is "${fm.status}", skipping`);
    return false;
  }

  const tweet = composeTweet(fm.summary, fm.canonical_url, fm.tweet);

  console.log(`  📝 Tweet preview (${tweet.length} chars):`);
  console.log(`     ${tweet.replace(/\n/g, '\n     ')}`);

  const { data } = await client.v2.tweet(tweet);
  console.log(`  ✅ Posted: https://x.com/rip_xg/status/${data.id}`);

  tracker.add(slug);
  return true;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const files = process.argv.slice(2);

  if (files.length === 0) {
    console.error('Usage: tsx scripts/post-blog-to-twitter.ts <file.mdx> [...]');
    process.exit(1);
  }

  const { TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET } = process.env;

  if (!TWITTER_API_KEY || !TWITTER_API_SECRET || !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_SECRET) {
    console.error('Missing Twitter credentials. Set TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET');
    process.exit(1);
  }

  const client = new TwitterApi({
    appKey: TWITTER_API_KEY,
    appSecret: TWITTER_API_SECRET,
    accessToken: TWITTER_ACCESS_TOKEN,
    accessSecret: TWITTER_ACCESS_SECRET,
  });

  const tracker = readTracker();
  let posted = 0;

  for (const file of files) {
    const abs = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
    if (!fs.existsSync(abs)) {
      console.warn(`  ⚠️  File not found: ${file}`);
      continue;
    }
    console.log(`\nProcessing: ${path.basename(abs)}`);
    const ok = await postFile(abs, client, tracker);
    if (ok) posted++;
  }

  if (posted > 0) {
    writeTracker(tracker);
    console.log(`\n💾 Tracker updated (${tracker.size} total posted)`);
  }

  console.log(`\n✅ Done. ${posted} tweet(s) sent.`);
}

main().catch((err) => {
  console.error('Fatal:', err?.message ?? err);
  process.exit(1);
});
