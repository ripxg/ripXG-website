import Link from 'next/link';
import { BlogPost } from '@/lib/blog';

export default function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 pt-10 border-t border-purple-100 dark:border-purple-800">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Related articles</h2>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block rounded-lg p-4 bg-purple-50 dark:bg-purple-900/40 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
            >
              <time className="text-xs text-purple-500 dark:text-purple-400 font-medium mb-1 block">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <p className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                {post.title}
              </p>
              {post.summary && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {post.summary}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
