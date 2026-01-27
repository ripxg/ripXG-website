import Link from "next/link";
import { getRecentPosts } from "@/lib/blog";

export default async function HomePage() {
  const recentPosts = getRecentPosts(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white dark:from-purple-950 dark:via-purple-900 dark:to-purple-950">
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-32">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white text-balance">
            ripXG
          </h1>
          <p className="text-2xl md:text-3xl text-purple-600 dark:text-purple-400 mb-6 font-medium text-pretty">
            AI for everyone. Do more (and fast) with tech hacks.
          </p>

          {/* Newsletter CTA */}
          <div className="bg-white dark:bg-purple-900 rounded-xl p-8 mb-12 shadow-lg border-2 border-purple-200 dark:border-purple-800">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white text-balance">
              Join the newsletter
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg leading-relaxed text-pretty">
              Weekly insights on observability, AI agents, and what I'm building. Exploring observability, AI agents, and systems that scale. Building in public and sharing what I learn along the way. No spam, just signal.
            </p>
            <Link
              href="/newsletter"
              className="inline-block bg-gradient-to-r from-purple-600 to-gold-500 hover:from-purple-700 hover:to-gold-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 min-h-[44px] min-w-[44px]"
            >
              Subscribe →
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav className="max-w-4xl mx-auto px-6 py-6 border-t border-purple-200 dark:border-purple-800">
        <ul className="flex flex-wrap gap-4 text-lg">
          <li>
            <Link
              href="/blog"
              className="inline-block bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
            >
              Articles
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="inline-block bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
            >
              About
            </Link>
          </li>
        </ul>
      </nav>

      {/* Recent Posts Preview */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-balance">
          Recent Articles
        </h2>
        {recentPosts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-lg text-pretty">
            No posts yet. Check back soon!
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-white dark:bg-purple-900 rounded-lg p-6 border border-purple-100 dark:border-purple-800 hover:shadow-md transition-shadow block group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              >
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
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-gold-500 dark:group-hover:text-gold-400 transition-colors leading-tight mb-2 text-balance">
                  {post.title}
                </h3>
                {post.summary && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 text-pretty">
                    {post.summary}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
