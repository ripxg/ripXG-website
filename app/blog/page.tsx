import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

const blogDir = path.join(process.cwd(), 'content', 'blog');

export function generateStaticParams() {
  const filenames = fs.readdirSync(blogDir);
  return filenames.map((filename) => ({
    slug: filename.replace(/\.mdx$/, ''),
  }));
}

async function getBlogPosts() {
  const filenames = fs.readdirSync(blogDir);

  const posts = filenames.map((filename) => {
    const filePath = path.join(blogDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug: filename.replace(/\.mdx$/, ''),
      title: data.title,
      date: data.date,
      summary: data.summary,
      tags: data.tags || [],
    };
  });

  // Sort by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white dark:from-purple-950 dark:via-purple-900 dark:to-purple-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 mb-12 inline-block font-medium"
        >
          ← Back to home
        </Link>

        <h1 className="text-5xl md:text-6xl font-bold mb-12 text-gray-900 dark:text-white">
          Articles
        </h1>

        {posts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No posts yet. Check back soon!
          </p>
        ) : (
          <div className="space-y-10">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white dark:bg-purple-900 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-purple-100 dark:border-purple-800"
              >
                <Link href={`/blog/${post.slug}`} className="block group">
                  <time
                    dateTime={post.date}
                    className="text-sm text-purple-500 dark:text-purple-400 mb-3 block font-medium"
                  >
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight mb-3">
                    {post.title}
                  </h2>
                  {post.summary && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {post.summary}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-sm rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
