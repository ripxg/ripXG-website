import Link from "next/link";
import SecurityDiagram from "./SecurityDiagram";

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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Back nav */}
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <Link
          href="/"
          className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-8 inline-flex items-center font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 min-h-[44px] transition-colors"
        >
          ← Back
        </Link>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-amber-500 rounded-full"></div>
          <p className="text-neutral-500 text-sm font-semibold tracking-wide uppercase">
            Managed AI Service
          </p>
        </div>
        <h1 className="text-6xl md:text-8xl font-black mb-6 text-neutral-900 dark:text-white text-balance tracking-tight">
          Orion AI
        </h1>
        <p className="text-2xl md:text-4xl text-neutral-700 dark:text-neutral-300 font-bold mb-6 text-balance leading-tight">
          Your own AI team.
          <br />
          <span className="text-amber-600 dark:text-amber-500">Zero-trust secured.</span>
        </p>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-10 max-w-2xl text-pretty leading-relaxed">
          For business owners who want AI that actually works — without the
          complexity, the risk, or the need for an IT team.
        </p>
        <Link
          href="/get-started"
          className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-neutral-900 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 min-h-[52px]"
        >
          Get Started →
        </Link>
      </section>

      {/* The Problem */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-neutral-900 dark:bg-neutral-900 rounded-2xl p-8 md:p-10 border border-neutral-800">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white text-balance">
            Cloud AI is leaking your data.
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                emoji: "🔓",
                title: "Your data, their servers",
                desc: "Every prompt you send to ChatGPT, Claude, or Copilot gets processed on external servers. Your business data is now their training data.",
              },
              {
                emoji: "🔗",
                title: "Vendor lock-in",
                desc: "Once you build workflows around one platform, switching costs massive time and money. They know it — that's the business model.",
              },
              {
                emoji: "🚨",
                title: "No accountability",
                desc: "When AI hallucinates or leaks data, there's no support line. No contract. No one to blame. You're on your own.",
              },
            ].map(({ emoji, title, desc }) => (
              <div
                key={title}
                className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700 hover:border-red-500/50 transition-colors"
              >
                <div className="text-3xl mb-3">{emoji}</div>
                <div className="text-white font-bold text-lg mb-2">
                  {title}
                </div>
                <div className="text-neutral-400 text-sm leading-relaxed text-pretty">
                  {desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 md:p-10 shadow-sm border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-neutral-900 dark:text-white text-balance">
            Orion AI runs on{" "}
            <span className="text-amber-600 dark:text-amber-500">YOUR</span>{" "}
            servers.
          </h2>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 font-semibold mb-8 text-balance">
            Zero-trust architecture. Not marketing fluff.
          </p>
          <div className="space-y-5 text-neutral-700 dark:text-neutral-300 text-lg leading-relaxed text-pretty">
            <p>
              <strong className="text-neutral-900 dark:text-white font-bold">Zero-trust</strong> means no external service gets blanket access to your business. Every tool connection is explicit, every permission is scoped, and your data never leaves your environment.
            </p>
            <p>
              Orion AI agents deploy directly onto your infrastructure — your VPS, your network, your control. They don't call home, they don't train on your data, and they're not accessible to anyone outside your organization.
            </p>
            <p className="text-amber-600 dark:text-amber-500 font-semibold">
              This is the only way to genuinely minimize AI data exposure.
            </p>
          </div>
          <div className="mt-8 p-5 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-l-4 border-amber-500">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed text-pretty">
              <strong className="font-bold text-neutral-900 dark:text-white">Reality check:</strong>{" "}
              AI agents that connect to external tools (email, CRMs, APIs) operate within those tools' own security boundaries. Zero-trust architecture minimizes exposure, but can't eliminate all risk from connected workflows. We're transparent about this because your trust depends on it.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-neutral-900 dark:text-white text-balance">
          How it works
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 text-pretty">
          Three steps. No technical skills required.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              emoji: "💬",
              title: "We talk",
              desc: "You tell me what's repetitive, what's annoying, what you wish automated. I design a solution.",
            },
            {
              step: "02",
              emoji: "🚀",
              title: "I build",
              desc: "I deploy Orion AI on your infrastructure. You don't touch code. You don't configure servers.",
            },
            {
              step: "03",
              emoji: "✅",
              title: "It runs",
              desc: "Monitoring, updates, support — I handle it. When something breaks, I fix it. That's 'fully managed'.",
            },
          ].map(({ step, emoji, title, desc }) => (
            <div
              key={step}
              className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="text-7xl font-black text-neutral-100 dark:text-neutral-800 absolute top-3 right-4 leading-none select-none -z-10">
                {step}
              </div>
              <div className="text-3xl mb-3">{emoji}</div>
              <div className="text-neutral-900 dark:text-white font-bold text-xl mb-2">
                {title}
              </div>
              <div className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed text-pretty">
                {desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-neutral-900 dark:text-white text-balance">
          Works with your tools
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 text-pretty">
          Orion AI connects to the software you already use.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {integrations.map(({ slug, label }) => (
            <div
              key={slug}
              className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800 flex flex-col items-center gap-3 shadow-sm hover:border-amber-500 dark:hover:border-amber-500 transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://cdn.simpleicons.org/${slug}`}
                alt={label}
                width={40}
                height={40}
                className="dark:invert opacity-80 hover:opacity-100 transition-opacity"
              />
              <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium text-center leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-500 text-pretty">
          + any tool with an API — if your workflow uses it, we can connect to it.
        </p>
      </section>

      {/* Who It's For */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-neutral-900 dark:text-white text-balance">
          Built for businesses that care about security
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              emoji: "🏦",
              title: "Finance & Accounting",
              desc: "Automate reconciliation, reporting, and client communications without sensitive data leaving your network.",
            },
            {
              emoji: "⚖️",
              title: "Legal & Professional Services",
              desc: "Document processing, deadline tracking, and client updates — all within your control.",
            },
            {
              emoji: "🛒",
              title: "E-commerce & Operations",
              desc: "Inventory alerts, order processing, supplier coordination — handled automatically, 24/7.",
            },
          ].map(({ emoji, title, desc }) => (
            <div
              key={title}
              className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{emoji}</div>
              <div className="text-neutral-900 dark:text-white font-bold text-lg mb-2 text-balance">
                {title}
              </div>
              <div className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed text-pretty">
                {desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Architecture Diagram */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-neutral-900 dark:text-white text-balance">
          How the security works
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 text-pretty">
          Every component has a defined role. Every connection is explicit. Nothing operates outside its boundary.
        </p>
        <div className="bg-neutral-900 rounded-2xl p-4 md:p-6 border border-neutral-800 shadow-xl overflow-x-auto">
          <SecurityDiagram />
        </div>
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-600 text-center text-pretty">
          The Isolated Agent has no access to your tools or data — its only function is escalating technical blockers to IT.
        </p>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-900 dark:bg-neutral-900 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white text-balance">
            Ready to automate without compromise?
          </h2>
          <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto text-pretty leading-relaxed">
            Tell me about your workflow and I'll design the right agent setup for your business.
          </p>
          <Link
            href="/get-started"
            className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-neutral-900 px-10 py-5 rounded-xl font-bold text-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 min-h-[60px]"
          >
            Let's Talk →
          </Link>
          <p className="mt-10 text-sm text-neutral-500">
            Orion AI is a ripXG service.
          </p>
        </div>
      </section>
    </div>
  );
}
