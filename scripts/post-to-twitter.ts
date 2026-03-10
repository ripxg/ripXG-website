#!/usr/bin/env tsx
/**
 * Post to Twitter/X: Auto-post new blog posts via Twitter API v2
 *
 * Reads frontmatter directly from an MDX blog file and composes a tweet.
 * Tracks posted slugs in content/twitter-posted.json to prevent double-posting.
 *
 * Required env vars (OAuth 1.0a with Read+Write permissions):
 *   TWITTER_API_KEY
 *   TWITTER_API_SECRET
 *   TWITTER_ACCESS_TOKEN
 *   TWITTER_ACCESS_SECRET
 *
 * Usage:
 *   npx tsx scripts/post-to-twitter.ts content/blog/2026-03-10-my-post.mdx
 *   npx tsx scripts/post-to-twitter.ts content/blog/2026-03-10-my-post.mdx --dry-run
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import crypto from 'crypto';

const DRY_RUN = process.argv.includes('--dry-run');
const POSTED_FILE = path.join(process.cwd(), 'content', 'twitter-posted.json');
const MAX_TWEET_LENGTH = 280;

// ─── Twitter OAuth 1.0a ──────────────────────────────────────────────────────

function oauthSign(method: string, url: string, params: Record<string, string>): string {
  const apiKey = process.env.TWITTER_API_KEY!;
  const apiSecret = process.env.TWITTER_API_SECRET!;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN!;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET!;

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: '1.0',
  };

  const allParams = { ...params, ...oauthParams };
  const sortedParams = Object.keys(allParams)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(allParams[k])}`)
    .join('&');

  const signatureBase = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams),
  ].join('&');

  const signingKey = `${encodeURIComponent(apiSecret)}&${encodeURIComponent(accessSecret)}`;
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBase)
    .digest('base64');

  oauthParams['oauth_signature'] = signature;

  return (
    'OAuth ' +
    Object.keys(oauthParams)
      .sort()
      .map((k) => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
      .join(', ')
  );
}

async function postTweet(text: string): Promise<string> {
  const url = 'https://api.twitter.com/2/tweets';
  const authHeader = oauthSign('POST', url, {});

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Twitter API error ${res.status}: ${err}`);
  }

  const json = (await res.json()) as { data: { id: string } };
  return json.data.id;
}

// ─── Slug tracking ───────────────────────────────────────────────────────────

function readPosted(): string[] {
  if (!fs.existsSync(POSTED_FILE)) return [];
  return JSON.parse(fs.readFileSync(POSTED_FILE, 'utf-8'));
}

function markPosted(slug: string): void {
  const posted = readPosted();
  if (!posted.includes(slug)) {
    posted.push(slug);
    fs.writeFileSync(POSTED_FILE, JSON.stringify(posted, null, 2) + '\n', 'utf-8');
  }
}

// ─── Tweet composition ───────────────────────────────────────────────────────

function composeTweet(summary: string, canonicalUrl: string): string {
  // Strip HTML entities and trailing ellipsis markers
  const cleanSummary = summary
    .replace(/\[&hellip;\]/g, '')
    .replace(/&hellip;/g, '…')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

  const url = canonicalUrl.trim();
  const separator = '\n\n';
  const maxSummaryLength = MAX_TWEET_LENGTH - url.length - separator.length;

  let truncated = cleanSummary;
  if (truncated.length > maxSummaryLength) {
    truncated = truncated.slice(0, maxSummaryLength - 1).trimEnd() + '…';
  }

  return `${truncated}${separator}${url}`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('🐦 Twitter/X Blog Poster\n');
  if (DRY_RUN) console.log('  [DRY RUN — no tweets will be posted]\n');

  // Get file path from args (first non-flag arg)
  const filePath = process.argv.slice(2).find((a) => !a.startsWith('--'));
  if (!filePath) {
    console.error('❌ Usage: npx tsx scripts/post-to-twitter.ts <path-to-mdx> [--dry-run]');
    process.exit(1);
  }

  const absPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absPath)) {
    console.error(`❌ File not found: ${absPath}`);
    process.exit(1);
  }

  // Derive slug from filename (strip date prefix and extension)
  const slug = path.basename(absPath, path.extname(absPath));
  console.log(`📄 File: ${filePath}`);
  console.log(`🔖 Slug: ${slug}\n`);

  // Check for double-posting
  const posted = readPosted();
  if (posted.includes(slug)) {
    console.log(`⏭ Already posted — skipping (${slug})`);
    process.exit(0);
  }

  // Read frontmatter
  const raw = fs.readFileSync(absPath, 'utf-8');
  const { data: fm } = matter(raw);

  const summary: string | undefined = fm.summary;
  const canonicalUrl: string | undefined = fm.canonical_url;

  if (!summary) {
    console.error('❌ Missing frontmatter field: summary');
    process.exit(1);
  }
  if (!canonicalUrl) {
    console.error('❌ Missing frontmatter field: canonical_url');
    process.exit(1);
  }

  // Check credentials (skip for dry run)
  if (!DRY_RUN) {
    const required = ['TWITTER_API_KEY', 'TWITTER_API_SECRET', 'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_SECRET'];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length > 0) {
      console.error(`❌ Missing OAuth credentials: ${missing.join(', ')}`);
      process.exit(1);
    }
  }

  // Compose tweet
  const tweetText = composeTweet(summary, canonicalUrl);
  console.log(`📝 Tweet (${tweetText.length} chars):\n`);
  console.log('─'.repeat(60));
  console.log(tweetText);
  console.log('─'.repeat(60) + '\n');

  if (DRY_RUN) {
    console.log('⏭ Dry run — not posted');
    return;
  }

  // Post
  const tweetId = await postTweet(tweetText);
  const tweetUrl = `https://x.com/rip_xg/status/${tweetId}`;
  console.log(`✅ Posted: ${tweetUrl}`);

  // Track
  markPosted(slug);
  console.log(`📝 Slug recorded in ${POSTED_FILE}`);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
