#!/usr/bin/env tsx
/**
 * Post to Twitter/X: Auto-post new blog posts via Twitter API v2
 *
 * Reads frontmatter directly from an MDX blog file and composes a tweet.
 * Tracks posted slugs in content/twitter-posted.json to prevent double-posting.
 * Fetches the OG image from ripxg.com and attaches it to the tweet via
 * Twitter's v1.1 media upload endpoint.
 *
 * Required env vars (OAuth 1.0a with Read+Write permissions):
 *   TWITTER_API_KEY
 *   TWITTER_API_SECRET
 *   TWITTER_ACCESS_TOKEN
 *   TWITTER_ACCESS_SECRET
 *
 * Optional env vars:
 *   SKIP_IMAGE=1   — skip OG image fetch/upload, post text-only
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
const SKIP_IMAGE = !!process.env.SKIP_IMAGE;
const POSTED_FILE = path.join(process.cwd(), 'content', 'twitter-posted.json');
const MAX_TWEET_LENGTH = 280;
const OG_BASE_URL = 'https://ripxg.com/og';
const MEDIA_UPLOAD_URL = 'https://upload.twitter.com/1/media/upload.json';

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

// ─── OG Image: fetch + upload ────────────────────────────────────────────────

/**
 * Fetch the OG image for a blog post from ripxg.com/og.
 * Returns the image buffer and content type on success, or null on failure.
 */
async function fetchOgImage(
  title: string,
  summary: string,
): Promise<{ buffer: Buffer; contentType: string } | null> {
  const ogUrl =
    OG_BASE_URL +
    '?title=' +
    encodeURIComponent(title) +
    '&description=' +
    encodeURIComponent(summary);

  console.log(`🖼  Fetching OG image: ${ogUrl}`);

  try {
    const res = await fetch(ogUrl, { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) {
      console.warn(`⚠️  OG image fetch failed (HTTP ${res.status}) — will post without image`);
      return null;
    }
    const contentType = res.headers.get('content-type') ?? 'image/png';
    const arrayBuffer = await res.arrayBuffer();
    return { buffer: Buffer.from(arrayBuffer), contentType };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`⚠️  OG image fetch error: ${msg} — will post without image`);
    return null;
  }
}

/**
 * Upload binary image data to Twitter's v1.1 media upload endpoint.
 * OAuth signing uses an EMPTY params object (multipart body is excluded
 * from the OAuth signature base string per spec).
 * Returns the media_id_string on success, or null on failure.
 */
async function uploadMediaToTwitter(
  buffer: Buffer,
  contentType: string,
): Promise<string | null> {
  // Sign with empty params — multipart body must NOT be included in signature
  const authHeader = oauthSign('POST', MEDIA_UPLOAD_URL, {});

  const formData = new FormData();
  // Convert Buffer to Uint8Array for Blob compatibility across TS targets
  formData.append('media', new Blob([new Uint8Array(buffer)], { type: contentType }), 'og-image.png');

  try {
    const res = await fetch(MEDIA_UPLOAD_URL, {
      method: 'POST',
      headers: { Authorization: authHeader },
      body: formData,
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn(`⚠️  Media upload failed (HTTP ${res.status}): ${err} — will post without image`);
      return null;
    }

    const json = (await res.json()) as { media_id_string: string };
    console.log(`✅ Media uploaded — id: ${json.media_id_string}`);
    return json.media_id_string;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`⚠️  Media upload error: ${msg} — will post without image`);
    return null;
  }
}

// ─── Tweet posting ───────────────────────────────────────────────────────────

async function postTweet(text: string, mediaId?: string): Promise<string> {
  const url = 'https://api.twitter.com/2/tweets';
  const authHeader = oauthSign('POST', url, {});

  const body: Record<string, unknown> = { text };
  if (mediaId) {
    body.media = { media_ids: [mediaId] };
  }

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

// ─── Slug tracking ───────────────────────────────────────────────────────────

function readPosted(): string[] {
  if (!fs.existsSync(POSTED_FILE)) return [];
  const data = JSON.parse(fs.readFileSync(POSTED_FILE, 'utf-8'));
  // Handle both formats: plain array or {posted: [...]}
  return Array.isArray(data) ? data : (data.posted ?? []);
}

function markPosted(slug: string): void {
  const posted = readPosted();
  if (!posted.includes(slug)) {
    posted.push(slug);
    const data = { posted, updated_at: new Date().toISOString() };
    fs.writeFileSync(POSTED_FILE, JSON.stringify(data, null, 2) + '\n', 'utf-8');
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
  if (SKIP_IMAGE) console.log('  [SKIP_IMAGE set — OG image upload disabled]\n');

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

  const title: string | undefined = fm.title;
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

  // Compose tweet - use custom tweet field if present, otherwise auto-compose
  const customTweet: string | undefined = fm.tweet;
  const tweetText = customTweet
    ? `${customTweet.trim()}\n\n${canonicalUrl}`
    : composeTweet(summary, canonicalUrl);
  console.log(`📝 Tweet (${tweetText.length} chars)${customTweet ? ' [custom]' : ''}:\n`);
  console.log('─'.repeat(60));
  console.log(tweetText);
  console.log('─'.repeat(60) + '\n');

  // OG image
  const ogTitle = title ?? slug;
  const ogDescription = summary;
  const ogUrl =
    OG_BASE_URL +
    '?title=' +
    encodeURIComponent(ogTitle) +
    '&description=' +
    encodeURIComponent(ogDescription);

  if (SKIP_IMAGE) {
    console.log('🖼  OG image: skipped (SKIP_IMAGE set)');
  } else if (DRY_RUN) {
    console.log(`🖼  OG image (dry run — would fetch): ${ogUrl}`);
    console.log('📤 Media upload (dry run — would upload to Twitter v1.1 media endpoint)');
  }

  if (DRY_RUN) {
    console.log('\n⏭ Dry run — not posted');
    return;
  }

  // Fetch and upload OG image (best-effort — falls back to text-only on error)
  let mediaId: string | undefined;
  if (!SKIP_IMAGE) {
    const image = await fetchOgImage(ogTitle, ogDescription);
    if (image) {
      const id = await uploadMediaToTwitter(image.buffer, image.contentType);
      if (id) mediaId = id;
    }
  }

  if (mediaId) {
    console.log(`📎 Attaching media_id: ${mediaId}`);
  } else if (!SKIP_IMAGE) {
    console.log('📎 No media attached — posting text-only');
  }

  // Post
  const tweetId = await postTweet(tweetText, mediaId);
  const tweetUrl = `https://x.com/rip_xg/status/${tweetId}`;
  console.log(`\n✅ Posted: ${tweetUrl}`);

  // Track
  markPosted(slug);
  console.log(`📝 Slug recorded in ${POSTED_FILE}`);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
