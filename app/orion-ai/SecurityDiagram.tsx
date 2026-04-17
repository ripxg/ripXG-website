"use client";

import { useState } from "react";

export default function SecurityDiagram() {
  const [deploymentMode, setDeploymentMode] = useState<"managed" | "self-hosted">("managed");

  return (
    <div className="w-full">
      {/* Toggle Switch */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
          <button
            onClick={() => setDeploymentMode("managed")}
            className={`px-6 py-2.5 rounded-md font-semibold text-sm transition-all ${
              deploymentMode === "managed"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            Fully Managed
          </button>
          <button
            onClick={() => setDeploymentMode("self-hosted")}
            disabled
            className={`px-6 py-2.5 rounded-md font-semibold text-sm transition-all ${
              deploymentMode === "self-hosted"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50"
            }`}
          >
            Self-Managed (Coming Soon)
          </button>
        </div>
      </div>

      {/* Managed Mode Diagram */}
      {deploymentMode === "managed" && (
        <svg
          viewBox="0 0 800 480"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          style={{ minWidth: 480 }}
          aria-label="Fully managed Orion AI SaaS architecture showing service, user channels, support escalation"
          role="img"
        >
          <defs>
            <marker id="arrow-gold" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#ca8a04" />
            </marker>
            <marker id="arrow-green" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#10b981" />
            </marker>
            <marker id="arrow-indigo" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#6366f1" />
            </marker>
            <marker id="arrow-telegram" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#38bdf8" />
            </marker>
            <marker id="arrow-purple" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#a855f7" />
            </marker>
          </defs>

          {/* ── SaaS Platform outer boundary ── */}
          <rect
            x="10" y="8" width="780" height="265" rx="16"
            fill="rgba(139,92,246,0.08)"
            stroke="#8b5cf6"
            strokeWidth="2"
          />
          <text
            x="400" y="36"
            textAnchor="middle"
            fill="#a855f7"
            fontSize="13"
            fontWeight="700"
            letterSpacing="2"
            fontFamily="sans-serif"
          >
            ORION AI SAAS PLATFORM
          </text>

          {/* ── User Dashboard UI box ── */}
          <rect
            x="28" y="52" width="200" height="160" rx="12"
            fill="rgba(234,179,8,0.08)"
            stroke="#ca8a04"
            strokeWidth="1.5"
          />
          <text x="128" y="80" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="700">
            📊 Your Dashboard
          </text>
          {[
            "View agents & tasks",
            "Monitor progress",
            "Manage integrations",
            "Track costs",
          ].map((item, i) => (
            <text
              key={i}
              x="48"
              y={104 + i * 22}
              fill="#c4b5fd"
              fontSize="11"
              fontFamily="sans-serif"
            >
              • {item}
            </text>
          ))}

          {/* ── Orion AI Service box ── */}
          <rect
            x="260" y="52" width="280" height="210" rx="12"
            fill="rgba(139,92,246,0.15)"
            stroke="#a855f7"
            strokeWidth="2"
          />
          <text x="400" y="80" textAnchor="middle" fill="#e9d5ff" fontSize="14" fontWeight="700">
            🤖 Orion AI Service
          </text>
          <text x="400" y="100" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontStyle="italic">
            Your team of AI agents
          </text>

          {/* Agent Teams */}
          <rect x="280" y="115" width="240" height="75" rx="8" fill="rgba(88,28,135,0.3)" stroke="#7c3aed" strokeWidth="1" />
          <text x="400" y="135" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="600">
            Agent Teams
          </text>
          <text x="400" y="152" textAnchor="middle" fill="#c4b5fd" fontSize="10">
            • Backend Engineers
          </text>
          <text x="400" y="166" textAnchor="middle" fill="#c4b5fd" fontSize="10">
            • Frontend Engineers
          </text>
          <text x="400" y="180" textAnchor="middle" fill="#c4b5fd" fontSize="10">
            • Security Reviewers
          </text>

          {/* Scoped Tool Access */}
          <rect x="280" y="200" width="240" height="52" rx="8" fill="rgba(16,185,129,0.1)" stroke="#10b981" strokeWidth="1" />
          <text x="400" y="220" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="600">
            🔒 Scoped Tool Access
          </text>
          <text x="400" y="238" textAnchor="middle" fill="#c4b5fd" fontSize="10">
            Agents only access authorized integrations
          </text>

          {/* ── Integrations box ── */}
          <rect
            x="572" y="52" width="200" height="210" rx="12"
            fill="rgba(30,10,60,0.5)"
            stroke="#4c1d95"
            strokeWidth="1.5"
          />
          <text x="672" y="80" textAnchor="middle" fill="#e9d5ff" fontSize="13" fontWeight="700">
            🔌 Your Integrations
          </text>
          {[
            "Gmail • Slack",
            "Notion • Airtable",
            "HubSpot • Stripe",
            "Shopify • QuickBooks",
            "+ 20+ more tools",
          ].map((item, i) => (
            <text
              key={i}
              x="592"
              y={104 + i * 22}
              fill="#c4b5fd"
              fontSize="11"
              fontFamily="sans-serif"
            >
              • {item}
            </text>
          ))}

          {/* ── User Channel box ── */}
          <rect
            x="28" y="295" width="200" height="90" rx="12"
            fill="rgba(56,189,248,0.1)"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          <text x="128" y="323" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="700">
            💬 Your Channel
          </text>
          <text x="128" y="343" textAnchor="middle" fill="#c4b5fd" fontSize="11">
    WhatsApp or Telegram
          </text>
          <text x="128" y="360" textAnchor="middle" fill="#c4b5fd" fontSize="11">
            Authenticated • Direct
          </text>
          <text x="128" y="377" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontStyle="italic">
            Talk to your AI team
          </text>

          {/* ── Tailscale Secure Channel box ── */}
          <rect
            x="300" y="295" width="200" height="90" rx="12"
            fill="rgba(16,185,129,0.1)"
            stroke="#10b981"
            strokeWidth="1.5"
          />
          <text x="400" y="323" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="700">
            🔒 Secure Channel
          </text>
          <text x="400" y="343" textAnchor="middle" fill="#34d399" fontSize="11">
            Tailscale Private Network
          </text>
          <text x="400" y="360" textAnchor="middle" fill="#c4b5fd" fontSize="10">
            Support escalation only
          </text>
          <text x="400" y="377" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontStyle="italic">
    Encrypted • Zero-trust
          </text>

          {/* ── Support Team box ── */}
          <rect
            x="572" y="295" width="200" height="90" rx="12"
            fill="rgba(99,102,241,0.1)"
            stroke="#6366f1"
            strokeWidth="1.5"
          />
          <text x="672" y="323" textAnchor="middle" fill="#a5b4fc" fontSize="13" fontWeight="700">
            🛠 Orion AI Support
          </text>
          <text x="672" y="343" textAnchor="middle" fill="#c4b5fd" fontSize="11">
            Technical issues only
          </text>
          <text x="672" y="360" textAnchor="middle" fill="#c4b5fd" fontSize="10">
    No data access • Stack only
          </text>
          <text x="672" y="377" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontStyle="italic">
            Via secure channel
          </text>

          {/* ── Arrow 1: Dashboard → SaaS (purple) ── */}
          <line
            x1="228" y1="132" x2="259" y2="132"
            stroke="#a855f7"
            strokeWidth="1.5"
            markerEnd="url(#arrow-purple)"
          />
          <text x="235" y="125" fill="#a855f7" fontSize="9" fontStyle="italic">
            access
          </text>

          {/* ── Arrow 2: SaaS → Integrations (purple) ── */}
          <line
            x1="540" y1="132" x2="571" y2="132"
            stroke="#a855f7"
            strokeWidth="1.5"
            markerEnd="url(#arrow-purple)"
          />
          <text x="545" y="125" fill="#a855f7" fontSize="9" fontStyle="italic">
            scoped
          </text>

          {/* ── Arrow 3: User Channel → SaaS (telegram) ── */}
          <path
            d="M 128,295 L 128,270 L 300,270 L 300,200 L 320,200"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            markerEnd="url(#arrow-telegram)"
          />
          <text x="145" y="265" fill="#38bdf8" fontSize="9" fontStyle="italic">
            Your messages
          </text>

          {/* ── Arrow 4: SaaS → Secure Channel (indigo) ── */}
          <path
            d="M 400,262 L 400,294"
            fill="none"
            stroke="#6366f1"
            strokeWidth="1.5"
            markerEnd="url(#arrow-indigo)"
          />
          <text x="410" y="285" fill="#6366f1" fontSize="9" fontStyle="italic">
    escalation
          </text>

          {/* ── Arrow 5: Secure Channel → Support (green) ── */}
          <line
            x1="500" y1="340" x2="571" y2="340"
            stroke="#10b981"
            strokeWidth="1.5"
            markerEnd="url(#arrow-green)"
          />
          <text x="515" y="335" fill="#10b981" fontSize="9" fontStyle="italic">
            encrypted
          </text>

          {/* ── Note box ── */}
          <rect
            x="28" y="420" width="744" height="50" rx="8"
            fill="rgba(139,92,246,0.05)"
            stroke="#8b5cf6"
            strokeWidth="1"
          />
          <text x="400" y="440" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontWeight="600">
            💡 Fully Managed: We handle infrastructure, updates, and security. You focus on your business.
          </text>
          <text x="400" y="458" textAnchor="middle" fill="#a5b4fc" fontSize="10">
    Your agents work within our secure SaaS platform with scoped access to your tools.
          </text>
        </svg>
      )}

      {/* Self-Hosted Mode Diagram (placeholder) */}
      {deploymentMode === "self-hosted" && (
        <div className="text-center py-16">
          <svg
            viewBox="0 0 800 480"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto opacity-50"
            style={{ minWidth: 480 }}
            aria-label="Self-hosted deployment coming soon"
            role="img"
          >
            {/* Same diagram as original, but greyed out */}
            <rect
              x="10" y="8" width="780" height="265" rx="16"
              fill="rgba(100,100,100,0.1)"
              stroke="#666"
              strokeWidth="1"
              strokeDasharray="8,4"
            />
            <text
              x="400" y="36"
              textAnchor="middle"
              fill="#666"
              fontSize="12"
              fontWeight="700"
              letterSpacing="3"
              fontFamily="monospace"
            >
              YOUR VPS / LINUX SERVER — SELF-HOSTED
            </text>
            <text x="400" y="240" textAnchor="middle" fill="#666" fontSize="16" fontWeight="600">
              Self-hosted deployment option coming soon
            </text>
          </svg>
        </div>
      )}
    </div>
  );
}
