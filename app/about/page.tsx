import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-purple-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="text-purple-600 dark:text-purple-400 hover:text-gold-500 dark:hover:text-gold-400 mb-8 inline-block font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 min-h-[44px] inline-flex items-center"
        >
          ← Back to home
        </Link>

        <h1 className="text-5xl font-bold mb-10 text-gray-900 dark:text-white text-balance">
          About
        </h1>

        <div className="prose prose-lg prose-purple dark:prose-invert max-w-none prose-headings:text-balance prose-p:text-pretty">
          <p className="text-xl mb-8 leading-relaxed text-pretty">
            I'm ripXG (Jeff Chau), a tech enthusiast focused on making technology simple -
            so that anyone can do more (and fast) with tech hacks.
          </p>

          <div className="bg-purple-50 dark:bg-purple-900 rounded-xl p-8 my-10 border-l-4 border-gold-500">
            <h2 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-300 text-balance">
              What I Do
            </h2>
            <ul className="space-y-3 mb-0">
              <li className="flex items-start">
                <span className="text-gold-500 dark:text-gold-400 mr-3 text-xl font-semibold">✓</span>
                <span>Talk about technology every day</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold-500 dark:text-gold-400 mr-3 text-xl font-semibold">✓</span>
                <span>Build tools and systems that scale</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold-500 dark:text-gold-400 mr-3 text-xl font-semibold">✓</span>
                <span>Experiment with AI agents and automation everywhere</span>
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-purple-700 dark:text-purple-300 mt-10 text-balance">
            Writing
          </h2>
          <p className="mb-4 text-lg text-pretty">
            This blog is where I write about:
          </p>
          <ul className="space-y-2">
            <li className="pl-6 border-l-2 border-gold-400 dark:border-gold-600">
              Using technology to make life 2-10x better
            </li>
            <li className="pl-6 border-l-2 border-gold-400 dark:border-gold-600">
              AI agent development and monitoring
            </li>
            <li className="pl-6 border-l-2 border-gold-400 dark:border-gold-600">
              Building systems in public
            </li>
            <li className="pl-6 border-l-2 border-gold-400 dark:border-gold-600">
              Writing itself
            </li>
          </ul>

          <div className="bg-gradient-to-r from-purple-600 to-gold-500 rounded-xl p-8 my-10 text-white shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-balance">
              Professionally? Also a tech enthusiast (currently: Observability Sales at Splunk)
            </h2>
            <p className="text-lg mb-4 text-pretty">
              Feel free to reach out via LinkedIn.
            </p>
            <a
              href="https://www.linkedin.com/in/jeff-chau/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-purple-700 hover:bg-purple-50 px-6 py-3 rounded-lg font-semibold transition-colors shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
            >
              Connect on LinkedIn →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
