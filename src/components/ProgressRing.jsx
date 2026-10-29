import { motion } from 'framer-motion'
import { useId } from 'react'

export default function ProgressRing({
  value, max = 100, size = 112, stroke = 10, label, sublabel, colors, children, delay = 0.2, trackColor = 'var(--line)',
}) {
  const id = useId().replace(/:/g, '')
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(1, Math.max(0, value / max))
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={`ring-${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={colors?.[0] ?? '#ff4d00'} />
              <stop offset="1" stopColor={colors?.[1] ?? '#ffd600'} />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={`url(#ring-${id})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c * (1 - pct) }}
            transition={{ duration: delay === 0 ? 0.3 : 1.6, delay, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(255,140,0,0.45))' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
      </div>
      {label && (
        <div className="text-center">
          <div className="text-sm font-semibold">{label}</div>
          {sublabel && <div className="text-xs text-muted">{sublabel}</div>}
        </div>
      )}
    </div>
  )
}
