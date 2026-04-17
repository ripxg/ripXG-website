import Link from "next/link";
import SecurityDiagram from "./SecurityDiagram";

// Demo agents data
const agents = [
  {
    id: "orion",
    name: "Orion",
    role: "Team Coordinator",
    emoji: "🌌",
    color: "from-purple-600 to-purple-800",
    description: "Technical coordinator and architect. Plans, delegates, reviews, and ships. The team executes; Orion makes sure they're executing the right things.",
    capabilities: ["Project planning", "Team coordination", "Code review", "Deployment management"],
  },
  {
    id: "nova",
    name: "Nova",
    role: "Marketing Lead",
    emoji: "✨",
    color: "from-gold-500 to-gold-700",
    description: "Owns marketing, content strategy, social media, growth, and developer relations across ripXG properties.",
    capabilities: ["Content strategy", "Social media", "Brand presence", "Growth marketing"],
  },
  {
    id: "backend-engineer",
    name: "Backend Engineer",
    role: "API & Database",
    emoji: "⚙️",
    color: "from-blue-600 to-blue-800",
    description: "Builds robust APIs, designs database schemas, and implements server-side business logic.",
    capabilities: ["API development", "Database design", "Authentication", "Performance optimization"],
  },
  {
    id: "frontend-engineer",
    name: "Frontend Engineer",
    role: "UI & UX",
    emoji: "🎨",
    color: "from-pink-600 to-pink-800",
    description: "Creates polished user interfaces, implements responsive designs, and ensures smooth user experiences.",
    capabilities: ["React/Next.js", "UI components", "Responsive design", "Accessibility"],
  },
  {
    id: "security-reviewer",
    name: "Security Reviewer",
    role: "Security & Compliance",
    emoji: "🔒",
    color: "from-red-600 to-red-800",
    description: "Reviews code for security vulnerabilities, implements best practices, and ensures compliance.",
    capabilities: ["Security audits", "Vulnerability detection", "OWASP compliance", "Penetration testing"],
  },
  {
    id: "content-engineer",
    name: "Content Engineer",
    role: "Documentation & Content",
    emoji: "📝",
    color: "from-green-600 to-green-800",
    description: "Creates technical documentation, writes blog content, and maintains knowledge bases.",
    capabilities: ["Technical writing", "Documentation", "Blog content", "Tutorials"],
  },
];

// Demo use cases
const useCases = [
  {
    id: "customer-support",
    emoji: "💬",
    title: "Handle customer support tickets",
    description: "Automatically triage, categorize, and respond to customer inquiries across email and chat.",
    estimatedTime: "2-3 hours/week saved",
    complexity: "Medium",
  },
  {
    id: "weekly-reports",
    emoji: "📊",
    title: "Draft weekly reports",
    description: "Aggregate data from multiple sources and generate comprehensive weekly business reports.",
    estimatedTime: "4 hours/week saved",
    complexity: "Low",
  },
  {
    id: "social-monitoring",
    emoji: "👀",
    title: "Monitor social mentions",
    description: "Track brand mentions, analyze sentiment, and flag important conversations for follow-up.",
    estimatedTime: "1-2 hours/day saved",
    complexity: "Low",
  },
  {
    id: "invoice-processing",
    emoji: "🧾",
    title: "Process invoices and expenses",
    description: "Extract data from invoices, categorize expenses, and update accounting systems automatically.",
    estimatedTime: "3-4 hours/week saved",
    complexity: "Medium",
  },
  {
    id: "lead-qualification",
    emoji: "🎯",
    title: "Qualify incoming leads",
    description: "Score leads based on custom criteria, research prospects, and update CRM with insights.",
    estimatedTime: "5-6 hours/week saved",
    complexity: "High",
  },
  {
    id: "content-calendar",
    emoji: "📅",
    title: "Manage content calendar",
    description: "Plan blog posts, schedule social content, and coordinate publishing across channels.",
    estimatedTime: "2-3 hours/week saved",
    complexity: "Medium",
  },
];

// Demo board items
const boardItems = [
  {
    id: "task-1",
    title: "Implement customer support automation",
    status: "in-progress",
    agent: "Nova",
    priority: "high",
    dueDate: "2026-04-20",
    assigneeAvatar: "✨",
  },
  {
    id: "task-2",
    title: "Design database schema for invoices",
    status: "todo",
    agent: "Backend Engineer",
    priority: "medium",
    dueDate: "2026-04-21",
    assigneeAvatar: "⚙️",
  },
  {
    id: "task-3",
    title: "Review security implementation",
    status: "in-review",
    agent: "Security Reviewer",
    priority: "high",
    dueDate: "2026-04-18",
    assigneeAvatar: "🔒",
  },
  {
    id: "task-4",
    title: "Create documentation for API endpoints",
    status: "done",
    agent: "Content Engineer",
    priority: "low",
    dueDate: "2026-04-15",
    assigneeAvatar: "📝",
  },
  {
    id: "task-5",
    title: "Build lead qualification workflow",
    status: "todo",
    agent: "Orion",
    priority: "high",
    dueDate: "2026-04-22",
    assigneeAvatar: "🌌",
  },
  {
    id: "task-6",
    title: "Design responsive dashboard UI",
    status: "in-progress",
    agent: "Frontend Engineer",
    priority: "medium",
    dueDate: "2026-04-19",
    assigneeAvatar: "🎨",
  },
];

const statusColors = {
  todo: "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300",
  "in-progress": "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  "in-review": "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  done: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
};

const priorityColors = {
  high: "text-red-600 dark:text-red-400",
  medium: "text-gold-600 dark:text-gold-400",
  low: "text-green-600 dark:text-green-400",
};

export default function OrionAIPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-purple-950 dark:via-purple-900 dark:to-purple-950">
      {/* Back nav */}
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <Link
          href="/"
          className="text-purple-600 dark:text-purple-400 hover:text-gold-500 dark:hover:text-gold-400 mb-8 inline-flex items-center font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 min-h-[44px] transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-gold-500 rounded-full"></div>
          <p className="text-purple-600 dark:text-purple-400 text-sm font-semibold tracking-wide uppercase">
            Interactive Demo
          </p>
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 text-neutral-900 dark:text-white text-balance tracking-tight">
          See Your AI Team in Action
        </h1>
        <p className="text-xl md:text-2xl text-neutral-700 dark:text-neutral-300 font-semibold mb-8 max-w-3xl text-balance leading-relaxed">
          Explore how an agency of AI agents works together to automate your business operations.
          Select agents, add use cases, and watch tasks progress on your project board.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/get-started"
            className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-gold-500 hover:from-purple-700 hover:to-gold-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 min-h-[52px]"
          >
            Start Free Trial →
          </Link>
          <a
            href="#agents"
            className="inline-flex items-center justify-center bg-white dark:bg-purple-900 hover:bg-neutral-50 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-400 px-8 py-4 rounded-xl font-bold text-lg transition-all border-2 border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 min-h-[52px]"
          >
            Meet the Agents
          </a>
        </div>
      </section>

      {/* Agency of Agents Section */}
      <section id="agents" className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-white text-balance">
            Your Agency of Agents
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl text-pretty">
            Each AI agent has specialized skills, a clear role, and works collaboratively with the team.
            Click on any agent to see their capabilities.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="group bg-white dark:bg-purple-900 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                {agent.emoji}
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                {agent.name}
              </h3>
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-3 uppercase tracking-wide">
                {agent.role}
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-4">
                {agent.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full"
                  >
                    {cap}
                  </span>
                ))}
              </div>
              <button className="mt-4 w-full py-2 bg-gradient-to-r from-purple-600 to-gold-500 hover:from-purple-700 hover:to-gold-600 text-white rounded-lg font-semibold text-sm transition-all opacity-0 group-hover:opacity-100">
                Select Agent
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases Board */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-white text-balance">
            Ready-to-Use Business Cases
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl text-pretty">
            Browse curated use cases that solve real business problems. Add them to your backlog with one click.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <div
              key={useCase.id}
              className="bg-white dark:bg-purple-900 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{useCase.emoji}</div>
                <div className="flex flex-col gap-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    useCase.complexity === "Low" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" :
                    useCase.complexity === "Medium" ? "bg-gold-100 dark:bg-gold-900 text-gold-700 dark:text-gold-300" :
                    "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                  }`}>
                    {useCase.complexity}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 text-balance">
                {useCase.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-4">
                {useCase.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-purple-100 dark:border-purple-800">
                <span className="text-sm font-semibold text-gold-600 dark:text-gold-400">
                  ⏱️ {useCase.estimatedTime}
                </span>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm transition-colors">
                  + Add to Backlog
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Project Board */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-white text-balance">
            Live Project Board
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl text-pretty">
            Watch your AI agents work through tasks in real-time. Track progress, review work, and ship faster.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {[
            { status: "todo", label: "To Do", items: boardItems.filter(i => i.status === "todo") },
            { status: "in-progress", label: "In Progress", items: boardItems.filter(i => i.status === "in-progress") },
            { status: "in-review", label: "In Review", items: boardItems.filter(i => i.status === "in-review") },
            { status: "done", label: "Done", items: boardItems.filter(i => i.status === "done") },
          ].map((column) => (
            <div key={column.status} className="bg-neutral-50 dark:bg-purple-950 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-neutral-900 dark:text-white">{column.label}</h3>
                <span className="px-2 py-1 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-bold rounded-full">
                  {column.items.length}
                </span>
              </div>
              <div className="space-y-3">
                {column.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-purple-900 rounded-lg p-4 border border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${statusColors[item.status as keyof typeof statusColors]}`}>
                        {item.status.replace("-", " ").toUpperCase()}
                      </span>
                      <span className={`text-xs font-bold ${priorityColors[item.priority as keyof typeof priorityColors]}`}>
                        {item.priority.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-semibold text-neutral-900 dark:text-white text-sm mb-2 leading-tight">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.assigneeAvatar}</span>
                        <span className="text-neutral-600 dark:text-neutral-400">{item.agent}</span>
                      </div>
                      <span className="text-neutral-500 dark:text-neutral-500">
                        {new Date(item.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                ))}
                {column.items.length === 0 && (
                  <div className="text-center py-8 text-neutral-400 dark:text-neutral-600 text-sm">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Architecture */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-white text-balance">
            Secure by Design
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl text-pretty">
            Every component has a defined role. Every connection is explicit. Nothing operates outside its boundary.
          </p>
        </div>
        <div className="bg-neutral-900 rounded-2xl p-4 md:p-6 border border-purple-800 shadow-xl overflow-x-auto">
          <SecurityDiagram />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-900 dark:bg-neutral-900 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white text-balance">
            Ready to Build Your AI Team?
          </h2>
          <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto text-pretty leading-relaxed">
            Start with a free consultation. We'll design the right agent setup for your business and deploy it on our secure infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/get-started"
              className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-gold-500 hover:from-purple-700 hover:to-gold-600 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 min-h-[60px]"
            >
              Get Started Free →
            </Link>
            <a
              href="https://github.com/ripxg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white dark:bg-purple-900 hover:bg-neutral-50 dark:hover:bg-purple-800 text-neutral-900 dark:text-white px-10 py-5 rounded-xl font-bold text-xl transition-all border-2 border-neutral-300 dark:border-purple-700 hover:border-neutral-400 dark:hover:border-purple-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white min-h-[60px]"
            >
              View on GitHub →
            </a>
          </div>
          <p className="mt-10 text-sm text-neutral-500">
            Powered by Orion AI from ripXG. Fully managed. Secure.
          </p>
        </div>
      </section>
    </div>
  );
}
