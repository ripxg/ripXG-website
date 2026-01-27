import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { decodeHtmlEntities } from '@/lib/html-entities';
import { markdownToHtml } from '@/lib/markdown';

const blogDir = path.join(process.cwd(), 'content', 'blog');

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
    summary: data.summary ? decodeHtmlEntities(data.summary) : undefined,
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

  return (
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
        </header>

        <div className="article-content prose prose-lg prose-purple dark:prose-invert max-w-none 
          prose-headings:text-balance 
          prose-p:text-pretty
          prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline prose-a:focus-visible:outline-2 prose-a:focus-visible:outline-offset-2 prose-a:focus-visible:outline-gold-500 
          prose-blockquote:border-l-gold-500 prose-blockquote:bg-purple-50 dark:prose-blockquote:bg-purple-900
          prose-strong:font-bold">
          <div dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }} />
        </div>
      </div>
    </article>
  );
}
