export default function SecurityDiagram() {
  return (
    <svg
      viewBox="0 0 800 480"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      style={{ minWidth: 480 }}
      aria-label="Security architecture diagram showing VPS, OpenClaw, Isolated Agent, Tailscale, User, and IT/On-Call relationships"
      role="img"
    >
      <defs>
        <marker id="arrow-gold" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#ca8a04" />
        </marker>
        <marker id="arrow-green" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#10b981" />
        </marker>
        <marker id="arrow-indigo-dash" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#6366f1" />
        </marker>
      </defs>

      {/* ── VPS outer boundary ── */}
      <rect
        x="10" y="8" width="780" height="265" rx="16"
        fill="rgba(88,28,135,0.15)"
        stroke="#7c3aed"
        strokeWidth="1.5"
        strokeDasharray="8,4"
      />
      <text
        x="400" y="36"
        textAnchor="middle"
        fill="#a855f7"
        fontSize="12"
        fontWeight="700"
        letterSpacing="3"
        fontFamily="monospace"
      >
        YOUR VPS / LINUX SERVER — HARDENED OS
      </text>

      {/* ── OpenClaw box ── */}
      <rect
        x="28" y="52" width="340" height="210" rx="12"
        fill="rgba(88,28,135,0.4)"
        stroke="#a855f7"
        strokeWidth="1.5"
      />
      <text x="198" y="82" textAnchor="middle" fill="#e9d5ff" fontSize="14" fontWeight="700">
        OpenClaw
      </text>
      {[
        "🔄  Auto-updates security patches",
        "🛠  Tool access via CLI",
        "📖  Read-only by default",
        "🔐  Scoped permissions per task",
        "💬  Responds on Telegram (paired)",
      ].map((item, i) => (
        <text
          key={i}
          x="48"
          y={108 + i * 28}
          fill="#c4b5fd"
          fontSize="12"
          fontFamily="sans-serif"
        >
          {item}
        </text>
      ))}

      {/* ── Isolated Agent box ── */}
      <rect
        x="432" y="52" width="340" height="210" rx="12"
        fill="rgba(30,10,60,0.5)"
        stroke="#4c1d95"
        strokeWidth="1.5"
        strokeDasharray="6,3"
      />
      <text x="602" y="82" textAnchor="middle" fill="#e9d5ff" fontSize="14" fontWeight="700">
        Isolated Agent
      </text>

      {/* NO TOOL ACCESS badge */}
      <rect x="502" y="90" width="200" height="26" rx="13" fill="#dc2626" />
      <text x="602" y="107" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" letterSpacing="1">
        🚫 NO TOOL ACCESS
      </text>

      {[
        "Handles technical escalations only",
        "Cannot access data or systems",
        "Bridges to IT when agents are blocked",
      ].map((item, i) => (
        <text
          key={i}
          x="452"
          y={128 + i * 28}
          fill="#c4b5fd"
          fontSize="12"
          fontFamily="sans-serif"
        >
          {item}
        </text>
      ))}

      {/* ── Tailscale box ── */}
      <rect
        x="282" y="325" width="236" height="90" rx="14"
        fill="rgba(16,185,129,0.1)"
        stroke="#10b981"
        strokeWidth="1.5"
      />
      <text x="400" y="356" textAnchor="middle" fill="#34d399" fontSize="14" fontWeight="700">
        🔒 Tailscale
      </text>
      <text x="400" y="378" textAnchor="middle" fill="#34d399" fontSize="11">
        Zero-trust VPN / Gateway
      </text>
      <text x="400" y="396" textAnchor="middle" fill="#34d399" fontSize="11">
        All traffic encrypted
      </text>

      {/* ── User box ── */}
      <rect
        x="20" y="335" width="180" height="80" rx="12"
        fill="rgba(234,179,8,0.08)"
        stroke="#ca8a04"
        strokeWidth="1.5"
      />
      <text x="110" y="363" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700">
        👤 You
      </text>
      <text x="110" y="383" textAnchor="middle" fill="#c4b5fd" fontSize="11">
        Telegram (paired auth)
      </text>
      <text x="110" y="400" textAnchor="middle" fill="#c4b5fd" fontSize="11">
        Authenticated channel
      </text>

      {/* ── IT / On-Call box ── */}
      <rect
        x="600" y="325" width="190" height="100" rx="12"
        fill="rgba(99,102,241,0.1)"
        stroke="#6366f1"
        strokeWidth="1.5"
      />
      <text x="695" y="352" textAnchor="middle" fill="#a5b4fc" fontSize="14" fontWeight="700">
        🛡 IT / On-Call
      </text>
      <text x="695" y="372" textAnchor="middle" fill="#c4b5fd" fontSize="11">
        Technical ops only
      </text>
      <text x="695" y="390" textAnchor="middle" fill="#c4b5fd" fontSize="11">
        No data access
      </text>
      <text x="695" y="408" textAnchor="middle" fill="#c4b5fd" fontSize="11">
        Escalation target
      </text>

      {/* ── Arrow 1: User → Tailscale (gold) ── */}
      <line
        x1="200" y1="375" x2="281" y2="375"
        stroke="#ca8a04"
        strokeWidth="1.5"
        markerEnd="url(#arrow-gold)"
      />

      {/* ── Arrow 2: Tailscale → VPS bottom (green) ── */}
      <line
        x1="400" y1="325" x2="400" y2="274"
        stroke="#10b981"
        strokeWidth="1.5"
        markerEnd="url(#arrow-green)"
      />
      <text
        x="345" y="305"
        fill="#10b981"
        fontSize="10"
        fontStyle="italic"
        fontFamily="sans-serif"
      >
        only access vector
      </text>

      {/* ── Arrow 3: Isolated Agent → IT (indigo dashed) ── */}
      <path
        d="M 602,262 L 602,315 L 600,325"
        fill="none"
        stroke="#6366f1"
        strokeWidth="1.5"
        strokeDasharray="5,3"
        markerEnd="url(#arrow-indigo-dash)"
      />
      <text
        x="618" y="295"
        fill="#6366f1"
        fontSize="10"
        fontStyle="italic"
        fontFamily="sans-serif"
      >
        escalation only
      </text>
    </svg>
  );
}
