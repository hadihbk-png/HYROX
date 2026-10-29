// Glass tooltip for Recharts. `format` maps (value, dataKey) → display string.
export default function ChartTooltip({ active, payload, label, format = (v) => v, labelFormat = (l) => l }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl bg-bg-2/90 px-3 py-2 text-xs shadow-xl">
      <div className="mb-1 font-semibold text-ink">{labelFormat(label, payload[0]?.payload)}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-muted">
          <span className="size-2 rounded-sm" style={{ background: p.color }} />
          <span>{p.name}</span>
          <span className="ml-auto pl-3 font-mono font-semibold text-ink">{format(p.value, p.dataKey)}</span>
        </div>
      ))}
    </div>
  )
}
