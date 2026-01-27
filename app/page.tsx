import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white dark:from-purple-950 dark:via-purple-900 dark:to-purple-950">
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-32">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
            Jeff Chau
          </h1>
          <p className="text-2xl md:text-3xl text-purple-600 dark:text-purple-400 mb-6 font-medium">
            Observability Advisor · AI Agent Specialist · Builder
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-12 leading-relaxed">
            Exploring observability, AI agents, and systems that scale.
            Building in public and sharing what I learn along the way.
          </p>

          {/* Newsletter CTA */}
          <div className="bg-white dark:bg-purple-900 rounded-xl p-8 mb-12 shadow-lg border-2 border-purple-200 dark:border-purple-800">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Join the newsletter
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
              Weekly insights on observability, AI agents, and what I'm building. No spam, just signal.
            </p>
            <Link
              href="/newsletter"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white dark:hover:bg-purple-500 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg"
            >
              Subscribe →
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav className="max-w-4xl mx-auto px-6 py-12 border-t border-purple-200 dark:border-purple-800">
        <ul className="space-y-4 text-lg">
          <li>
            <Link
              href="/blog"
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
            >
              Articles
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
            >
              About
            </Link>
          </li>
        </ul>
      </nav>

      {/* Recent Posts Preview */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Recent Articles
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-purple-900 rounded-lg p-6 border border-purple-100 dark:border-purple-800"
            >
              <div className="h-4 w-32 bg-gray-200 dark:bg-purple-800 rounded animate-pulse mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 dark:bg-purple-800 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-purple-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
