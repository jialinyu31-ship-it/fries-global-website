const nodes = [
  { cx: 340, cy: 220, label: "CN", className: "network-node network-node--origin" },
  { cx: 142, cy: 112, label: "NA", className: "network-node" },
  { cx: 275, cy: 98, label: "EU", className: "network-node" },
  { cx: 382, cy: 128, label: "ME", className: "network-node" },
  { cx: 438, cy: 246, label: "SEA", className: "network-node" },
  { cx: 285, cy: 302, label: "AF", className: "network-node" },
];

export function NetworkVisual({ compact = false }: { content?: unknown; compact?: boolean }) {
  return (
    <div className={`network-visual ${compact ? "network-visual--compact" : ""}`} aria-hidden="true">
      <div className="network-visual__glow" />
      <svg viewBox="0 0 560 420" role="presentation">
        <defs>
          <linearGradient id={`arc-gradient-${compact ? "compact" : "hero"}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7ea0ff" stopOpacity="0.15" />
            <stop offset="0.56" stopColor="#002fa7" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ff6b20" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id={`sphere-gradient-${compact ? "compact" : "hero"}`} cx="65%" cy="32%" r="70%">
            <stop offset="0" stopColor="#345dff" stopOpacity="0.3" />
            <stop offset="0.5" stopColor="#081d5d" stopOpacity="0.85" />
            <stop offset="1" stopColor="#020b22" />
          </radialGradient>
          <filter id={`node-glow-${compact ? "compact" : "hero"}`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <circle className="network-sphere" cx="310" cy="205" r="166" fill={`url(#sphere-gradient-${compact ? "compact" : "hero"})`} />
        <g className="network-grid">
          <ellipse cx="310" cy="205" rx="166" ry="58" />
          <ellipse cx="310" cy="205" rx="166" ry="112" />
          <ellipse cx="310" cy="205" rx="68" ry="166" />
          <ellipse cx="310" cy="205" rx="126" ry="166" />
          <circle cx="310" cy="205" r="166" />
        </g>
        <g className="network-arcs" fill="none" stroke={`url(#arc-gradient-${compact ? "compact" : "hero"})`}>
          <path d="M340 220 C260 78 190 58 142 112" />
          <path d="M340 220 C350 115 325 88 275 98" />
          <path d="M340 220 C412 183 416 150 382 128" />
          <path d="M340 220 C384 202 421 208 438 246" />
          <path d="M340 220 C326 255 302 283 285 302" />
        </g>
        <g className="network-dashes">
          <path pathLength="1" d="M340 220 C260 78 190 58 142 112" />
          <path pathLength="1" d="M340 220 C350 115 325 88 275 98" />
          <path pathLength="1" d="M340 220 C412 183 416 150 382 128" />
          <path pathLength="1" d="M340 220 C384 202 421 208 438 246" />
        </g>
        {nodes.map((node, index) => (
          <g className={node.className} key={node.label} transform={`translate(${node.cx} ${node.cy})`} style={{ animationDelay: `${index * 0.4}s` }}>
            <circle r={node.label === "CN" ? 7 : 4} filter={`url(#node-glow-${compact ? "compact" : "hero"})`} />
            <circle className="network-node__ring" r={node.label === "CN" ? 16 : 11} />
            <text x="12" y="-10">{node.label}</text>
          </g>
        ))}
      </svg>
      {!compact && (
        <>
          <div className="network-visual__status"><i />GLOBAL SOURCING NETWORK / LIVE</div>
          <div className="network-visual__coordinates">31.2304° N<br />121.4737° E</div>
          <div className="network-visual__routes"><span>06</span> ACTIVE MARKETS</div>
        </>
      )}
    </div>
  );
}
