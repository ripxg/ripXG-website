#!/usr/bin/env tsx
/**
 * Post to Twitter/X: Publish article promo tweets via Twitter API v2
 *
 * Reads tweet JSONs from /content/transforms/twitter/
 * Posts any article that has twitter.enabled = true and twitter.published_at = null
 * Updates publish-status.json after successful posting
 *
 * Required env vars (OAuth 1.0a with Read+Write permissions):
 *   TWITTER_API_KEY
 *   TWITTER_API_SECRET
 *   TWITTER_ACCESS_TOKEN
 *   TWITTER_ACCESS_SECRET
 *
 * Usage:
 *   bun run scripts/post-to-twitter.ts
 *   bun run scripts/post-to-twitter.ts --dry-run
 *   bun run scripts/post-to-twitter.ts --slug 2026-02-my-article
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

async function postArticleTweet(slug: string, tweetPath: string): Promise<void> {
  const tweetData = JSON.parse(fs.readFileSync(tweetPath, 'utf-8'));
  const tweetText: string = tweetData.tweet;

  console.log(`\n📤 Posting: ${slug}`);
  console.log(`   ${tweetData.char_count} chars`);
  console.log(`\n   ${tweetText}\n`);

  if (DRY_RUN) {
    console.log('   ⏭ Dry run — not posted');
    return;
  }

  const tweetId = await postTweet(tweetText);
  const tweetUrl = `https://x.com/rip_xg/status/${tweetId}`;
  console.log(`   ✅ Posted: ${tweetUrl}`);

  const status = readStatus();
  markPublished(status, slug, tweetUrl);
  console.log(`   📝 Status updated`);
}

async function main(): Promise<void> {
  console.log('🐦 Twitter/X Article Poster\n');
  if (DRY_RUN) console.log('  [DRY RUN — no tweets will be posted]\n');

  if (!DRY_RUN) {
    const required = ['TWITTER_API_KEY', 'TWITTER_API_SECRET', 'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_SECRET'];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length > 0) {
      console.error(`❌ Missing OAuth 1.0a credentials: ${missing.join(', ')}`);
      console.error('   App needs Read+Write permissions. Regenerate access tokens after changing permissions.');
      console.error('   Store in: ~/.clawdbot/credentials/twitter.env');
      process.exit(1);
    }
  }

  if (!fs.existsSync(TWITTER_DIR)) {
    console.error(`❌ Twitter transforms not found. Run: bun run transform:twitter`);
    process.exit(1);
  }

  const articleFiles = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.md'))
    .filter((f) => !SLUG_FILTER || f.includes(SLUG_FILTER));

  let posted = 0;
  let skipped = 0;

  for (const file of articleFiles) {
    const slug = file.replace('.md', '');
    const articlePath = path.join(ARTICLES_DIR, file);
    const tweetPath = path.join(TWITTER_DIR, `${slug}.json`);

    const { data: fm } = matter(fs.readFileSync(articlePath, 'utf-8'));

    if (fm.platforms?.twitter?.enabled === false) {
      console.log(`⏭ ${slug} — Twitter disabled`);
      skipped++;
      continue;
    }

    if (fm.platforms?.twitter?.published_at) {
      console.log(`⏭ ${slug} — already posted`);
      skipped++;
      continue;
    }

    if (!fs.existsSync(tweetPath)) {
      console.log(`⚠️  ${slug} — no tweet JSON (run transform:twitter first)`);
      skipped++;
      continue;
    }

    await postArticleTweet(slug, tweetPath);
    posted++;

    // Small delay between posts
    if (posted < articleFiles.length) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log(`\n✅ Done. Posted: ${posted} | Skipped: ${skipped}`);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
