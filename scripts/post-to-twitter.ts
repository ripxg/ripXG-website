#!/usr/bin/env tsx
/**
 * Post to Twitter/X: Publish generated thread JSONs via Twitter API v2
 *
 * Reads thread JSONs from /content/transforms/twitter/
 * Posts any article that has twitter.enabled = true and twitter.published_at = null
 * Updates publish-status.json after successful posting
 *
 * Required env vars:
 *   TWITTER_API_KEY
 *   TWITTER_API_SECRET
 *   TWITTER_ACCESS_TOKEN
 *   TWITTER_ACCESS_SECRET
 *
 * Usage:
 *   bun run scripts/post-to-twitter.ts
 *   bun run scripts/post-to-twitter.ts --dry-run
 *   bun run scripts/post-to-twitter.ts --slug 2026-03-my-article
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import crypto from 'crypto';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');
const TWITTER_DIR = path.join(process.cwd(), 'content', 'transforms', 'twitter');
const STATUS_FILE = path.join(process.cwd(), 'content', 'publish-status.json');

const DRY_RUN = process.argv.includes('--dry-run');
const SLUG_FILTER = (() => {
  const idx = process.argv.indexOf('--slug');
  return idx !== -1 ? process.argv[idx + 1] : null;
})();

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

async function postTweet(text: string, replyToId?: string): Promise<string> {
  const url = 'https://api.twitter.com/2/tweets';
  const body: Record<string, unknown> = { text };
  if (replyToId) {
    body.reply = { in_reply_to_tweet_id: replyToId };
  }

  const authHeader = oauthSign('POST', url, {});

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Twitter API error ${res.status}: ${err}`);
  }

  const json = (await res.json()) as { data: { id: string } };
  return json.data.id;
}

// ─── Status tracking ─────────────────────────────────────────────────────────

function readStatus(): Record<string, unknown> {
  if (!fs.existsSync(STATUS_FILE)) return { articles: {}, stats: {} };
  return JSON.parse(fs.readFileSync(STATUS_FILE, 'utf-8'));
}

function markPublished(status: Record<string, unknown>, slug: string, tweetUrl: string): void {
  const articles = (status.articles as Record<string, unknown>) || {};
  const article = (articles[slug] as Record<string, unknown>) || {};
  const platforms = (article.platforms as Record<string, unknown>) || {};
  platforms.twitter = {
    status: 'published',
    published_at: new Date().toISOString(),
    url: tweetUrl,
    notes: 'Auto-posted via post-to-twitter.ts',
  };
  article.platforms = platforms;
  articles[slug] = article;
  status.articles = articles;
  fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2), 'utf-8');
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function postThread(slug: string, threadPath: string): Promise<void> {
  const threadData = JSON.parse(fs.readFileSync(threadPath, 'utf-8'));
  const tweets: Array<{ text: string }> = threadData.thread;

  console.log(`\n📤 Posting thread: ${slug}`);
  console.log(`   ${tweets.length} tweets`);

  if (DRY_RUN) {
    tweets.forEach((t, i) => {
      console.log(`\n  [Tweet ${i + 1}/${tweets.length}]`);
      console.log(`  ${t.text.replace(/\n/g, '\n  ')}`);
    });
    console.log('\n  ⏭ Dry run — not posted');
    return;
  }

  let lastTweetId: string | undefined;
  for (let i = 0; i < tweets.length; i++) {
    const tweet = tweets[i];
    console.log(`  Posting tweet ${i + 1}/${tweets.length}...`);
    lastTweetId = await postTweet(tweet.text, lastTweetId);
    console.log(`  ✅ Posted: https://x.com/i/status/${lastTweetId}`);

    // Respect rate limits — short delay between tweets in a thread
    if (i < tweets.length - 1) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  const firstTweetUrl = `https://x.com/rip_xg/status/${lastTweetId}`;
  const status = readStatus();
  markPublished(status, slug, firstTweetUrl);
  console.log(`  📝 Status updated → published`);
}

async function main(): Promise<void> {
  console.log('🐦 Twitter/X Auto-Poster\n');

  if (DRY_RUN) console.log('  [DRY RUN MODE — no tweets will be posted]\n');

  // Validate credentials (skip in dry-run)
  if (!DRY_RUN) {
    const required = ['TWITTER_API_KEY', 'TWITTER_API_SECRET', 'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_SECRET'];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length > 0) {
      console.error(`❌ Missing env vars: ${missing.join(', ')}`);
      console.error('   Set these in Railway/Vercel or your .env file.');
      process.exit(1);
    }
  }

  if (!fs.existsSync(TWITTER_DIR)) {
    console.error(`❌ Twitter transforms dir not found: ${TWITTER_DIR}`);
    console.error('   Run: bun run scripts/transform-twitter.ts first');
    process.exit(1);
  }

  // Get list of articles to post
  const articleFiles = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.md'))
    .filter((f) => !SLUG_FILTER || f.includes(SLUG_FILTER));

  let posted = 0;
  let skipped = 0;

  for (const file of articleFiles) {
    const slug = file.replace('.md', '');
    const articlePath = path.join(ARTICLES_DIR, file);
    const threadPath = path.join(TWITTER_DIR, `${slug}.json`);

    const { data: fm } = matter(fs.readFileSync(articlePath, 'utf-8'));

    // Skip if Twitter disabled in frontmatter
    if (fm.platforms?.twitter?.enabled === false) {
      console.log(`⏭ ${slug} — Twitter disabled`);
      skipped++;
      continue;
    }

    // Skip if already published
    if (fm.platforms?.twitter?.published_at) {
      console.log(`⏭ ${slug} — already published`);
      skipped++;
      continue;
    }

    // Skip if no transform generated yet
    if (!fs.existsSync(threadPath)) {
      console.log(`⚠️  ${slug} — no thread JSON (run transform-twitter.ts first)`);
      skipped++;
      continue;
    }

    await postThread(slug, threadPath);
    posted++;

    // Delay between articles to respect rate limits
    if (posted < articleFiles.length) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  console.log(`\n✅ Done. Posted: ${posted} | Skipped: ${skipped}`);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
