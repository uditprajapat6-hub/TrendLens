import { useMemo } from 'react'

// Deterministic zig-zag path standing in for a live search-interest curve.
// Pure SVG + CSS animation (see tailwind.config.js `drawline` keyframe) —
// no chart library needed for this decorative signature element.
function buildPath(points, width, height) {
  const stepX = width / (points.length - 1)
  const max = Math.max(...points)
  const min = Math.min(...points)
  const coords = points.map((p, i) => {
    const x = i * stepX
    const y = height - ((p - min) / (max - min || 1)) * (height - 24) - 12
    return [x, y]
  })
  const d = coords.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(' ')
  return { d, coords }
}

export default function HeroChart() {
  const width = 560
  const height = 260
  const points = useMemo(
    () => [22, 28, 25, 40, 38, 52, 48, 65, 58, 74, 70, 88, 82, 96],
    []
  )
  const { d, coords } = useMemo(() => buildPath(points, width, height), [points])
  const lastPoint = coords[coords.length - 1]

  return (
    <div className="relative animate-floaty">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-xl"
        role="img"
        aria-label="Rising search interest trend line"
      >
        <defs>
          <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4285F4" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#4285F4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="heroLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4285F4" />
            <stop offset="50%" stopColor="#34A853" />
            <stop offset="100%" stopColor="#FBBC05" />
          </linearGradient>
        </defs>

        {/* Grid lines: quiet, structural, not decorative */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1="0"
            x2={width}
            y1={height * f}
            y2={height * f}
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        ))}

        <path d={`${d} L${width},${height} L0,${height} Z`} fill="url(#heroFill)" />

        <path
          d={d}
          fill="none"
          stroke="url(#heroLine)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="animate-drawline"
        />

        {lastPoint && (
          <g>
            <circle cx={lastPoint[0]} cy={lastPoint[1]} r="6" fill="#4285F4" />
            <circle cx={lastPoint[0]} cy={lastPoint[1]} r="10" fill="#4285F4" opacity="0.25" />
          </g>
        )}
      </svg>
    </div>
  )
}
