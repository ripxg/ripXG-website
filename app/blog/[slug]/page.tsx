import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { decodeHtmlEntities } from '@/lib/html-entities';
import { markdownToHtml } from '@/lib/markdown';
import { getRelatedPosts } from '@/lib/blog';
import ShareButtons from './ShareButtons';
import RelatedPosts from './RelatedPosts';

const blogDir = path.join(process.cwd(), 'content', 'blog');
const SITE_URL = 'https://ripxg.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const description = post.summary
    ? post.summary.replace(/\[&hellip;\]/g, '…').trim()
    : `${post.title} — ripXG`;

  const ogImageUrl = post.featuredImage
    ? post.featuredImage.startsWith('http')
      ? post.featuredImage
      : `${SITE_URL}${post.featuredImage}`
    : `${SITE_URL}/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(description.substring(0, 120))}`;

  return {
    title: `${post.title} | ripXG`,
    description,
    openGraph: {
      title: post.title,
      description,
      url: `${SITE_URL}/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: ['Jeff'],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [ogImageUrl],
      site: '@rip_xg',
      creator: '@rip_xg',
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const filenames = fs.readdirSync(blogDir);
  return filenames.map((filename) => ({
    slug: filename.replace(/\.mdx$/, ''),
  }));
}

function getBlogPost(slug: string) {
  const filePath = path.join(blogDir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: decodeHtmlEntities(data.title || ''),
    date: data.date,
    dateModified: data.date_modified || data.date,
    author: data.author || 'Jeff Chau',
    summary: data.summary ? decodeHtmlEntities(data.summary) : undefined,
    featuredImage: data.featured_image || null,
    tags: data.tags || [],
    content,
    wordpressUrl: data.wordpressUrl,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, post.tags);

  const description = post.summary
    ? post.summary.replace(/\[&hellip;\]/g, '…').trim()
    : `${post.title} — ripXG`;

  const imageUrl = post.featuredImage
    ? post.featuredImage.startsWith('http')
      ? post.featuredImage
      : `${SITE_URL}${post.featuredImage}`
    : `${SITE_URL}/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(description.substring(0, 120))}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.dateModified).toISOString(),
    author: {
      '@type': 'Person',
      name: post.author,
    },
    image: imageUrl,
    url: `${SITE_URL}/blog/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'ripXG',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.ico`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="min-h-screen bg-white dark:bg-purple-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link href="/blog" className="text-purple-600 dark:text-purple-400 hover:text-gold-500 dark:hover:text-gold-400 mb-8 inline-block font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 min-h-[44px] inline-flex items-center">
          ← Back to articles
        </Link>

        <header className="mb-8">
          <time
            dateTime={post.date}
            className="text-sm text-purple-500 dark:text-purple-400 mb-4 block font-medium"
          >
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight text-balance">
            {post.title}
          </h1>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.wordpressUrl && (
            <a
              href={post.wordpressUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-purple-600 dark:text-purple-400 hover:text-gold-500 dark:hover:text-gold-400 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 min-h-[44px] inline-flex items-center"
            >
              Original post on WordPress →
            </a>
          )}

          <div className="mt-6">
            <ShareButtons url={`${SITE_URL}/blog/${slug}`} title={post.title} />
          </div>
        </header>

          <div className="article-content prose prose-lg prose-purple dark:prose-invert max-w-none
            prose-headings:text-balance
            prose-p:text-pretty
            prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline prose-a:focus-visible:outline-2 prose-a:focus-visible:outline-offset-2 prose-a:focus-visible:outline-gold-500
            prose-blockquote:border-l-gold-500 prose-blockquote:bg-purple-50 dark:prose-blockquote:bg-purple-900
            prose-strong:font-bold">
            <div dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }} />
          </div>

          <div className="mt-10 pt-8 border-t border-purple-100 dark:border-purple-800">
            <ShareButtons url={`${SITE_URL}/blog/${slug}`} title={post.title} />
          </div>

          <RelatedPosts posts={relatedPosts} />
        </div>
      </article>
    </>
  );
}
