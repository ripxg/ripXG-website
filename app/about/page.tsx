import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-purple-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 mb-8 inline-block font-medium"
        >
          ← Back to home
        </Link>

        <h1 className="text-5xl font-bold mb-10 text-gray-900 dark:text-white">
          About
        </h1>

        <div className="prose prose-lg prose-purple dark:prose-invert max-w-none">
          <p className="text-xl mb-8 leading-relaxed">
            I'm Jeff Chau, an Observability Advisor focused on helping teams
            understand what's happening in their systems before problems occur.
          </p>

          <div className="bg-purple-50 dark:bg-purple-900 rounded-xl p-8 my-10 border-l-4 border-purple-600">
            <h2 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-300">
              What I Do
            </h2>
            <ul className="space-y-3 mb-0">
              <li className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-3 text-xl font-semibold">✓</span>
                <span>Help SRE and monitoring teams implement observability best practices</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-3 text-xl font-semibold">✓</span>
                <span>Build tools and systems that scale</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-3 text-xl font-semibold">✓</span>
                <span>Experiment with AI agents and automation</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-3 text-xl font-semibold">✓</span>
                <span>Share learnings publicly</span>
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-purple-700 dark:text-purple-300 mt-10">
            Writing
          </h2>
          <p className="mb-4 text-lg">
            This blog is where I write about:
          </p>
          <ul className="space-y-2">
            <li className="pl-6 border-l-2 border-purple-400 dark:border-purple-600">
              Observability patterns and practices
            </li>
            <li className="pl-6 border-l-2 border-purple-400 dark:border-purple-600">
              AI agent development and monitoring
            </li>
            <li className="pl-6 border-l-2 border-purple-400 dark:border-purple-600">
              SRE and monitoring strategies
            </li>
            <li className="pl-6 border-l-2 border-purple-400 dark:border-purple-600">
              Building systems in public
            </li>
          </ul>

          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-8 my-10 text-white shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              Get in Touch
            </h2>
            <p className="text-lg mb-4">
              Feel free to reach out via LinkedIn.
            </p>
            <a
              href="https://linkedin.com/in/jeffchau"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-purple-700 hover:bg-purple-50 px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
            >
              Connect on LinkedIn →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
