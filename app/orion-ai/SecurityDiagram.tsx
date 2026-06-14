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
          viewBox="0 0 800 400"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          style={{ minWidth: 480 }}
          aria-label="Fully managed Orion AI architecture"
          role="img"
        >
          <defs>
            <marker id="arrow-purple" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#a855f7" />
            </marker>
            <marker id="arrow-cyan" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#22d3ee" />
            </marker>
            <marker id="arrow-green" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#10b981" />
            </marker>
          </defs>

          {/* ── SaaS Platform Container ── */}
          <rect
            x="50" y="20" width="700" height="240"
            rx="20"
            fill="rgba(139,92,246,0.06)"
            stroke="#8b5cf6"
            strokeWidth="2"
          />
          <text
            x="400" y="50"
            textAnchor="middle"
            fill="#a855f7"
            fontSize="14"
            fontWeight="700"
            letterSpacing="2"
          >
            ORION AI SAAS
          </text>

          {/* ── Dashboard Box ── */}
          <rect
            x="80" y="70" width="160" height="100"
            rx="12"
            fill="rgba(234,179,8,0.1)"
            stroke="#ca8a04"
            strokeWidth="2"
          />
          <text x="160" y="105" textAnchor="middle" fill="#fbbf24" fontSize="16" fontWeight="700">
            📊
          </text>
          <text x="160" y="128" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="600">
            Your Dashboard
          </text>
          <text x="160" y="148" textAnchor="middle" fill="#c4b5fd" fontSize="10">
            Monitor & manage
          </text>

          {/* ── AI Service Box ── */}
          <rect
            x="280" y="70" width="240" height="160"
            rx="12"
            fill="rgba(139,92,246,0.12)"
            stroke="#a855f7"
            strokeWidth="2.5"
          />
          <text x="400" y="105" textAnchor="middle" fill="#e9d5ff" fontSize="16" fontWeight="700">
            🤖
          </text>
          <text x="400" y="128" textAnchor="middle" fill="#e9d5ff" fontSize="13" fontWeight="700">
            AI Agents
          </text>
          <text x="400" y="148" textAnchor="middle" fill="#c4b5fd" fontSize="10">
            Your automated team
          </text>

          {/* Scoped Access Badge */}
          <rect x="310" y="165" width="180" height="50" rx="8" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="1.5" />
          <text x="400" y="185" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="600">
            🔒 Scoped Access
          </text>
          <text x="400" y="202" textAnchor="middle" fill="#c4b5fd" fontSize="9">
            Authorize per tool
          </text>

          {/* ── Integrations Box ── */}
          <rect
            x="560" y="70" width="160" height="160"
            rx="12"
            fill="rgba(30,10,60,0.6)"
            stroke="#4c1d95"
            strokeWidth="2"
          />
          <text x="640" y="105" textAnchor="middle" fill="#e9d5ff" fontSize="16" fontWeight="700">
            🔌
          </text>
          <text x="640" y="128" textAnchor="middle" fill="#e9d5ff" fontSize="12" fontWeight="600">
            Your Tools
          </text>
          <text x="640" y="148" textAnchor="middle" fill="#c4b5fd" fontSize="10">
            Gmail • Slack
          </text>
          <text x="640" y="163" textAnchor="middle" fill="#c4b5fd" fontSize="10">
            Notion • HubSpot
          </text>
          <text x="640" y="178" textAnchor="middle" fill="#c4b5fd" fontSize="10">
            Stripe • +20 more
          </text>

          {/* ── User Box ── */}
          <rect
            x="80" y="280" width="180" height="80"
            rx="12"
            fill="rgba(34,211,238,0.1)"
            stroke="#22d3ee"
            strokeWidth="2"
          />
          <text x="170" y="315" textAnchor="middle" fill="#22d3ee" fontSize="15" fontWeight="700">
            👤 You
          </text>
          <text x="170" y="338" textAnchor="middle" fill="#c4b5fd" fontSize="10">
            WhatsApp / Telegram
          </text>
          <text x="170" y="353" textAnchor="middle" fill="#c4b5fd" fontSize="9">
            Direct & authenticated
          </text>

          {/* ── Support Box ── */}
          <rect
            x="540" y="280" width="180" height="80"
            rx="12"
            fill="rgba(99,102,241,0.1)"
            stroke="#6366f1"
            strokeWidth="2"
          />
          <text x="630" y="315" textAnchor="middle" fill="#a5b4fc" fontSize="15" fontWeight="700">
            🛠 Support
          </text>
          <text x="630" y="338" textAnchor="middle" fill="#c4b5fd" fontSize="10">
            Technical issues only
          </text>
          <text x="630" y="353" textAnchor="middle" fill="#c4b5fd" fontSize="9">
            Via secure channel
          </text>

          {/* ── Arrows (smaller, corrected directions) ── */}
          {/* Dashboard → AI */}
          <line x1="240" y1="120" x2="279" y2="120" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#arrow-purple)" />

          {/* AI → Tools */}
          <line x1="520" y1="150" x2="559" y2="150" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#arrow-purple)" />

          {/* You → Dashboard (straight up) */}
          <line x1="170" y1="280" x2="170" y2="171" stroke="#22d3ee" strokeWidth="1.5" markerEnd="url(#arrow-cyan)" />

          {/* You → AI (up and right) */}
          <line x1="260" y1="280" x2="340" y2="231" stroke="#22d3ee" strokeWidth="1.5" markerEnd="url(#arrow-cyan)" />

          {/* AI → Support (shortened, facing right) */}
          <line x1="520" y1="320" x2="539" y2="320" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arrow-green)" />

          {/* Legend/Note */}
          <rect x="290" y="285" width="220" height="70" rx="10" fill="rgba(139,92,246,0.04)" stroke="#8b5cf6" strokeWidth="1" />
          <text x="400" y="308" textAnchor="middle" fill="#e9d5ff" fontSize="10" fontWeight="600">
            ✨ Fully Managed
          </text>
          <text x="400" y="326" textAnchor="middle" fill="#c4b5fd" fontSize="9">
            We handle infrastructure
          </text>
          <text x="400" y="342" textAnchor="middle" fill="#c4b5fd" fontSize="9">
            You focus on your business
          </text>
        </svg>
      )}

      {/* Self-Hosted Mode */}
      {deploymentMode === "self-hosted" && (
        <div className="text-center py-16">
          <svg
            viewBox="0 0 800 400"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto opacity-40"
            style={{ minWidth: 480 }}
          >
            <rect x="100" y="100" width="600" height="200" rx="16" fill="#666" stroke="#666" strokeWidth="2" strokeDasharray="8,4" />
            <text x="400" y="210" textAnchor="middle" fill="#666" fontSize="18" fontWeight="600">
              Self-hosted option coming soon
            </text>
          </svg>
        </div>
      )}
    </div>
  );
}
