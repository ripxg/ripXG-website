import Link from "next/link";
import { getRecentPosts } from "@/lib/blog";

export default async function HomePage() {
  const recentPosts = getRecentPosts(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-purple-950 dark:via-purple-900 dark:to-purple-950">
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-32">
        <div className="max-w-2xl">
          <div className="inline-block mb-6">
            <span className="text-8xl md:text-9xl font-black tracking-tighter text-neutral-900 dark:text-white">
              ripXG
            </span>
          </div>
          <p className="text-2xl md:text-3xl text-neutral-600 dark:text-neutral-400 mb-8 font-medium leading-tight text-pretty">
            AI that works for you.
            <br />
            <span className="text-gold-600 dark:text-gold-400">Not the other way around.</span>
          </p>

          {/* Services Section */}
          <div className="bg-neutral-900 dark:bg-neutral-900 rounded-2xl p-8 md:p-10 mb-8 border border-neutral-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-purple-600 rounded-full"></div>
              <p className="text-neutral-400 text-sm font-semibold tracking-wide uppercase">
                Learn
              </p>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white text-balance">
              How to leverage AI
              <br />
              <span className="text-gold-600 dark:text-gold-400">for your business</span>
            </h2>
            
            <p className="text-neutral-300 mb-10 text-lg leading-relaxed max-w-2xl text-pretty">
              Most AI tools are overpriced chatbots. Real leverage comes from systems —
              agents that connect to your tools, automate your workflows,
              and run on your own infrastructure. No vendor lock-in, no data leakage.
            </p>

            <div className="grid gap-5 md:grid-cols-3 mb-10">
              {[
                {
                  emoji: "🏗️",
                  title: "Custom Agents",
                  desc: "Built for your specific workflows, not generic templates",
                },
                {
                  emoji: "🔐",
                  title: "Zero-Trust",
                  desc: "Highly secure, protected environment",
                },
                {
                  emoji: "⚙️",
                  title: "Fully Managed",
                  desc: "I handle setup, updates, and support",
                },
              ].map(({ emoji, title, desc }) => (
                <div
                  key={title}
                  className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700 hover:border-purple-500/50 transition-colors"
                >
                  <div className="text-3xl mb-3">{emoji}</div>
                  <div className="text-white font-bold text-lg mb-2">{title}</div>
                  <div className="text-neutral-400 text-sm leading-relaxed">
                    {desc}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/get-started"
                className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-gold-500 hover:from-purple-700 hover:to-gold-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 min-h-[52px]"
              >
                Let's talk →
              </Link>
              <Link
                href="/orion-ai"
                className="inline-flex items-center justify-center border-2 border-neutral-600 hover:border-neutral-500 text-neutral-300 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:bg-neutral-800 min-h-[52px]"
              >
                See Orion AI
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-white dark:bg-purple-900 rounded-2xl p-8 mb-12 shadow-sm border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📮</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 text-neutral-900 dark:text-white text-balance">
                  Weekly breakdown
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 text-base leading-relaxed text-pretty">
                  What I'm building, what's working, what isn't.
                  <br />
                  <span className="text-gold-600 dark:text-gold-400 font-medium">No spam. Unsubscribe anytime.</span>
                </p>
                <Link
                  href="/newsletter"
                  className="inline-flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 min-h-[48px]"
                >
                  Subscribe →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav className="max-w-4xl mx-auto px-6 py-8 border-t border-neutral-200 dark:border-neutral-800">
        <ul className="flex flex-wrap gap-3">
          <li>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 min-h-[48px] min-w-[48px]"
            >
              Articles
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="inline-flex items-center justify-center bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white border-2 border-neutral-200 dark:border-neutral-700 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 min-h-[48px] min-w-[48px]"
            >
              About
            </Link>
          </li>
        </ul>
      </nav>

      {/* Recent Posts Preview */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-neutral-900 dark:text-white text-balance">
          Writing
        </h2>
        {recentPosts.length === 0 ? (
          <p className="text-neutral-600 dark:text-neutral-400 text-lg text-pretty">
            Nothing yet. Check back soon.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-white dark:bg-purple-900 rounded-xl p-6 border border-purple-200 dark:border-purple-800 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg transition-all block group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              >
                <time
                  dateTime={post.date}
                  className="text-xs text-neutral-500 dark:text-neutral-500 mb-3 block font-semibold tracking-wide uppercase"
                >
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight mb-3 text-balance">
                  {post.title}
                </h3>
                {post.summary && (
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed line-clamp-3 text-pretty">
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
