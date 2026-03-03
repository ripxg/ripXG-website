import Link from "next/link";

const integrations = [
  { slug: "gmail", label: "Gmail" },
  { slug: "slack", label: "Slack" },
  { slug: "whatsapp", label: "WhatsApp" },
  { slug: "googlesheets", label: "Google Sheets" },
  { slug: "googledrive", label: "Google Drive" },
  { slug: "googlecalendar", label: "Google Calendar" },
  { slug: "hubspot", label: "HubSpot" },
  { slug: "stripe", label: "Stripe" },
  { slug: "shopify", label: "Shopify" },
  { slug: "notion", label: "Notion" },
  { slug: "airtable", label: "Airtable" },
  { slug: "trello", label: "Trello" },
  { slug: "quickbooks", label: "QuickBooks" },
  { slug: "linkedin", label: "LinkedIn" },
  { slug: "telegram", label: "Telegram" },
  { slug: "calendly", label: "Calendly" },
];

export default function OrionAIPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white dark:from-purple-950 dark:via-purple-900 dark:to-purple-950">
      {/* Back nav */}
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <Link
          href="/"
          className="text-purple-600 dark:text-purple-400 hover:text-gold-500 dark:hover:text-gold-400 mb-8 inline-flex items-center font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 min-h-[44px]"
        >
          ← Back to home
        </Link>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-4">
          Managed AI Service
        </p>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white text-balance">
          Orion AI
        </h1>
        <p className="text-2xl md:text-3xl text-purple-600 dark:text-purple-300 font-semibold mb-6 text-balance">
          Your own AI team. Zero-trust secured. Fully managed.
        </p>
        <p className="text-lg text-gray-600 dark:text-purple-200 mb-10 max-w-2xl text-pretty leading-relaxed">
          For business owners who want the power of AI without the complexity,
          the risk, or the IT team.
        </p>
        <Link
          href="/get-started"
          className="inline-flex items-center justify-center bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-purple-950 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 min-h-[44px]"
        >
          Get Started →
        </Link>
      </section>

      {/* The Problem */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-purple-900 dark:bg-purple-950 rounded-xl p-8 shadow-xl border-2 border-gold-500">
          <h2 className="text-3xl font-bold mb-8 text-white text-balance">
            Cloud AI isn&apos;t built for your data.
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                emoji: "🔒",
                title: "Your data, their servers",
                desc: "Most AI tools send your business data to third-party servers. Contracts, client details, financials — all of it.",
              },
              {
                emoji: "🤯",
                title: "Complex to set up",
                desc: "Connecting AI to your actual workflows requires technical expertise most businesses don't have.",
              },
              {
                emoji: "🕳️",
                title: "No safety net",
                desc: "When something breaks, you're on your own. No support, no accountability.",
              },
            ].map(({ emoji, title, desc }) => (
              <div
                key={title}
                className="bg-purple-800/50 rounded-lg p-6 border border-purple-700/50"
              >
                <div className="text-3xl mb-3">{emoji}</div>
                <div className="text-white font-semibold text-lg mb-2">
                  {title}
                </div>
                <div className="text-purple-300 text-sm leading-relaxed text-pretty">
                  {desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-purple-900 rounded-xl p-8 shadow-lg border border-purple-100 dark:border-purple-800">
          <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white text-balance">
            Orion AI runs on{" "}
            <span className="text-gold-500 dark:text-gold-400">YOUR</span>{" "}
            infrastructure.
          </h2>
          <p className="text-xl text-purple-600 dark:text-purple-300 font-semibold mb-6 text-balance">
            The zero-trust approach to AI agents.
          </p>
          <div className="space-y-4 text-gray-700 dark:text-purple-200 text-lg leading-relaxed text-pretty">
            <p>
              Zero-trust means no external service gets blanket access to your
              business. Every tool connection is explicit, every permission is
              scoped, and your data never leaves your environment. Orion AI
              agents are deployed directly onto your own server — they don&apos;t
              call home, they don&apos;t share your data, and they&apos;re not
              accessible to anyone outside your network.
            </p>
            <p>
              This is the only architecture that can genuinely minimise AI data
              exposure — because true security starts with controlling where
              your data lives.
            </p>
          </div>
          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-800/50 rounded-lg border border-purple-200 dark:border-purple-700">
            <p className="text-sm text-gray-500 dark:text-purple-400 italic leading-relaxed text-pretty">
              <strong className="not-italic font-semibold text-gray-600 dark:text-purple-300">
                Important:
              </strong>{" "}
              AI agents that connect to external tools (email, CRMs, APIs)
              operate within those tools&apos; own security boundaries.
              Zero-trust architecture minimises exposure, but it cannot
              eliminate all risk inherent to connected workflows. We&apos;re
              transparent about this because your trust depends on it.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white text-balance">
          Simple for you. Powerful underneath.
        </h2>
        <div className="grid gap-6 md:grid-cols-3 mt-8">
          {[
            {
              step: "01",
              emoji: "🗣️",
              title: "Consult",
              desc: "We learn your workflow, identify repetitive tasks, and design the right agent setup for your business.",
            },
            {
              step: "02",
              emoji: "🚀",
              title: "Deploy",
              desc: "We set up Orion AI on your own infrastructure (or a dedicated server). You don't touch a line of code.",
            },
            {
              step: "03",
              emoji: "🛠️",
              title: "Manage",
              desc: "Ongoing monitoring, updates, and support. If something breaks, we fix it. That's what fully managed means.",
            },
          ].map(({ step, emoji, title, desc }) => (
            <div
              key={step}
              className="bg-white dark:bg-purple-900 rounded-xl p-6 border border-purple-100 dark:border-purple-800 shadow-md relative overflow-hidden"
            >
              <div className="text-6xl font-black text-purple-100 dark:text-purple-800 absolute top-4 right-4 leading-none select-none">
                {step}
              </div>
              <div className="text-3xl mb-3">{emoji}</div>
              <div className="text-gray-900 dark:text-white font-bold text-xl mb-2">
                {title}
              </div>
              <div className="text-gray-600 dark:text-purple-300 text-sm leading-relaxed text-pretty">
                {desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white text-balance">
          Works with your tools.
        </h2>
        <p className="text-lg text-gray-600 dark:text-purple-300 mb-8 text-pretty">
          Orion AI connects to the software your business already uses.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {integrations.map(({ slug, label }) => (
            <div
              key={slug}
              className="bg-white dark:bg-purple-900 rounded-xl p-4 border border-purple-100 dark:border-purple-800 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://cdn.simpleicons.org/${slug}`}
                alt={label}
                width={40}
                height={40}
                className="dark:invert"
              />
              <span className="text-xs text-gray-600 dark:text-purple-300 font-medium text-center leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-gray-500 dark:text-purple-400 italic text-pretty">
          + any tool with an API — if your workflow uses it, we can connect to
          it.
        </p>
      </section>

      {/* Who It's For */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-balance">
          Built for businesses that take security seriously.
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              emoji: "🏦",
              title: "Finance & Accounting",
              desc: "Automate reconciliation, reporting, and client comms without sensitive data leaving your network.",
            },
            {
              emoji: "⚖️",
              title: "Legal & Professional Services",
              desc: "Document processing, deadline tracking, and client updates — all within your control.",
            },
            {
              emoji: "🛍️",
              title: "E-commerce & Operations",
              desc: "Inventory alerts, order processing, supplier emails — handled automatically, 24/7.",
            },
          ].map(({ emoji, title, desc }) => (
            <div
              key={title}
              className="bg-white dark:bg-purple-900 rounded-xl p-6 border border-purple-100 dark:border-purple-800 shadow-md"
            >
              <div className="text-3xl mb-3">{emoji}</div>
              <div className="text-gray-900 dark:text-white font-bold text-lg mb-2 text-balance">
                {title}
              </div>
              <div className="text-gray-600 dark:text-purple-300 text-sm leading-relaxed text-pretty">
                {desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-900 dark:bg-purple-950 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white text-balance">
            Ready to automate without compromise?
          </h2>
          <p className="text-xl text-purple-200 mb-10 max-w-2xl mx-auto text-pretty leading-relaxed">
            Tell us about your workflow and we&apos;ll design the right agent
            setup for your business.
          </p>
          <Link
            href="/get-started"
            className="inline-flex items-center justify-center bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-purple-950 px-10 py-5 rounded-lg font-bold text-xl transition-all shadow-lg hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 min-h-[44px]"
          >
            Let&apos;s Talk →
          </Link>
          <p className="mt-10 text-sm text-purple-400 italic">
            Orion AI is a ripXG service.
          </p>
        </div>
      </section>
    </div>
  );
}
