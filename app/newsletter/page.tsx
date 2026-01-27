import Link from "next/link";

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-purple-950 dark:via-purple-900 dark:to-purple-950">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 mb-8 inline-block font-medium"
        >
          ← Back to home
        </Link>

        <div className="bg-white dark:bg-purple-900 rounded-2xl p-8 md:p-12 shadow-xl border-2 border-purple-200 dark:border-purple-800 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Newsletter
          </h1>

          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            Subscribe to get weekly insights on observability, AI agents, and what I'm building.
            No spam, unsubscribe anytime.
          </p>

          <div className="bg-purple-50 dark:bg-purple-950 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-800 dark:text-purple-200">
              Subscribe via Substack
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
              The newsletter is hosted on Substack. Click below to subscribe directly on their platform.
            </p>
            <a
              href="https://substack.com/@jeffchau"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white dark:hover:bg-purple-500 px-8 py-4 rounded-lg font-semibold text-xl transition-colors shadow-md hover:shadow-lg text-center"
            >
              Subscribe on Substack →
            </a>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              What you'll get:
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Weekly analysis of observability trends and AI agent development",
                "Practical insights from real-world implementations",
                "Updates on what I'm building and learning",
                "Curated resources and tools"
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start bg-purple-50 dark:bg-purple-950 rounded-lg p-4"
                >
                  <span className="text-purple-600 dark:text-purple-400 mr-3 text-2xl font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ready to start getting these insights in your inbox?
          </p>
          <a
            href="https://substack.com/@jeffchau"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Subscribe Now - It's Free
          </a>
        </div>
      </div>
    </div>
  );
}
