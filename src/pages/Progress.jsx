import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from 'recharts'
import { Trophy, AlertTriangle, TrendingDown, Medal, Crown, LineChart as LineIcon } from 'lucide-react'
import { PageHeader, Chip, EmptyState, Button } from '../components/ui'
import GlassCard from '../components/GlassCard'
import ChartTooltip from '../components/ChartTooltip'
import Icon from '../components/Icon'
import { pastRaces, raceStations, user } from '../data/mock'
import { loadSims } from '../lib/storage'
import { fmt } from '../lib/time'
import { useNavigate } from 'react-router-dom'

const axisTick = { fill: 'var(--c-axis)', fontSize: 11 }
const shortDate = (d) => new Date(d).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
const shortName = { 'Burpee Broad Jumps': 'BBJ', 'Farmers Carry': 'Farmers', 'Sandbag Lunges': 'Lunges', 'Wall Balls': 'Wall Balls' }

export default function Progress() {
  const navigate = useNavigate()
  const [kind, setKind] = useState('all')
  const all = useMemo(
    () => [...pastRaces, ...loadSims()].sort((a, b) => a.date.localeCompare(b.date)),
    []
  )
  const races = all.filter((r) => kind === 'all' || r.type === kind)
  const [selectedId, setSelectedId] = useState(null)
  const selected = races.find((r) => r.id === selectedId) ?? races[races.length - 1]

  const lineData = races.map((r) => ({ id: r.id, date: shortDate(r.date), name: r.name, total: r.total }))

  const splitData = selected
    ? raceStations.map((s, i) => ({ name: shortName[s.name] ?? s.name, full: s.name, split: selected.stations[i], target: s.target }))
    : []

  const weakest = useMemo(() => {
    if (!selected) return null
    return raceStations
      .map((s, i) => ({ ...s, actual: selected.stations[i], over: (selected.stations[i] - s.target) / s.target }))
      .sort((a, b) => b.over - a.over)[0]
  }, [selected])

  const prs = useMemo(() => {
    const stationPRs = raceStations.map((s, i) => {
      const best = all.reduce((m, r) => (r.stations[i] < m.time ? { time: r.stations[i], race: r } : m), { time: Infinity, race: null })
      return { ...s, ...best }
    })
    const overall = all.reduce((m, r) => (r.total < m.total ? r : m), all[0])
    const bestRun = Math.min(...all.flatMap((r) => r.runs))
    return { stationPRs, overall, bestRun }
  }, [all])

  const first = races[0]
  const last = races[races.length - 1]

  return (
    <div>
      <PageHeader
        eyebrow="Progress & Splits"
        title="Every second, accounted for."
        desc="Track total race time, compare each station to your target and see where the next PR is hiding."
        action={
          <div className="flex gap-2">
            {[['all', 'All'], ['Race', 'Races'], ['Simulation', 'Sims']].map(([k, l]) => (
              <Chip group="kind" key={k} active={kind === k} onClick={() => { setKind(k); setSelectedId(null) }}>{l}</Chip>
            ))}
          </div>
        }
      />

      {races.length === 0 ? (
        <EmptyState
          icon={LineIcon}
          title="No results here yet"
          desc="Finish a race simulation and your times will start building a story right here."
          action={<Button onClick={() => navigate('/race')}>Start a simulation</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Total time line */}
          <GlassCard hover={false} className="p-6 lg:col-span-2">
            <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold">Total race time</h3>
              {races.length > 1 && (
                <span className="flex items-center gap-1 text-sm font-semibold text-emerald-500">
                  <TrendingDown className="size-4" /> {fmt(first.total - last.total)} faster since {shortDate(first.date)}
                </span>
              )}
            </div>
            <p className="mb-4 text-xs text-muted">Lower is better · tap a point to inspect its splits</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineData}
                  margin={{ top: 10, right: 12, left: -6, bottom: 0 }}
                  onClick={(e) => e?.activePayload && setSelectedId(e.activePayload[0].payload.id)}
                >
                  <CartesianGrid vertical={false} stroke="var(--line)" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={axisTick} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={axisTick}
                    domain={[(min) => Math.floor((Math.min(min, user.targetFinish) - 120) / 300) * 300, (max) => Math.ceil((max + 60) / 300) * 300]}
                    tickFormatter={(v) => fmt(v)}
                    width={62}
                  />
                  <Tooltip
                    cursor={{ stroke: 'var(--c-axis)', strokeDasharray: '3 3' }}
                    content={<ChartTooltip format={(v) => fmt(v)} labelFormat={(l, p) => `${p?.name ?? ''} · ${l}`} />}
                  />
                  <ReferenceLine
                    y={user.targetFinish}
                    stroke="var(--c-axis)"
                    strokeDasharray="5 5"
                    label={{ value: `Target ${fmt(user.targetFinish)}`, position: 'insideBottomRight', fill: 'var(--c-axis)', fontSize: 11 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Finish time"
                    stroke="var(--c-run)"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: 'var(--c-run)', stroke: 'var(--bg-2)', strokeWidth: 2 }}
                    activeDot={{ r: 7, stroke: 'var(--bg-2)', strokeWidth: 2 }}
                    animationDuration={1600}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Weakest station */}
          {weakest && (
            <GlassCard delay={0.1} className="relative overflow-hidden p-6">
              <div className="absolute -right-16 -bottom-16 size-48 rounded-full bg-rose-500 opacity-15 blur-3xl" />
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-rose-400 uppercase">
                <AlertTriangle className="size-4" /> Weakest station
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-rose-500/15 text-rose-400">
                  <Icon name={weakest.icon} className="size-6" />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold">{weakest.name}</div>
                  <div className="text-xs text-muted">in {selected.name}</div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-line p-3">
                  <div className="text-xs text-muted">Your split</div>
                  <div className="font-mono text-xl font-bold">{fmt(weakest.actual)}</div>
                </div>
                <div className="rounded-2xl border border-line p-3">
                  <div className="text-xs text-muted">Target</div>
                  <div className="font-mono text-xl font-bold">{fmt(weakest.target)}</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted">
                <span className="font-semibold text-ink">{Math.round(weakest.over * 100)}% over target</span>, the biggest gap in this race.
                Focus tip: {weakest.tips[0]}
              </p>
            </GlassCard>
          )}

          {/* Station splits vs target */}
          <GlassCard hover={false} delay={0.15} className="p-6 lg:col-span-3">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">Station splits vs target</h3>
                <p className="text-xs text-muted">{selected.name} · {new Date(selected.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {fmt(selected.total)}</p>
              </div>
              <select
                value={selected.id}
                onChange={(e) => setSelectedId(e.target.value)}
                className="glass rounded-xl px-3 py-2 text-sm outline-none"
                aria-label="Choose race"
              >
                {[...races].reverse().map((r) => (
                  <option key={r.id} value={r.id} className="bg-bg-2 text-ink">
                    {shortDate(r.date)} · {r.name} · {fmt(r.total)}
                  </option>
                ))}
              </select>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={splitData} margin={{ top: 6, right: 4, left: -6, bottom: 0 }} barGap={2} barCategoryGap="24%">
                  <CartesianGrid vertical={false} stroke="var(--line)" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={axisTick} interval={0} />
                  <YAxis tickLine={false} axisLine={false} tick={axisTick} tickFormatter={(v) => fmt(v)} width={52} />
                  <Tooltip cursor={{ fill: 'var(--line)' }} content={<ChartTooltip format={(v) => fmt(v)} labelFormat={(l, p) => p?.full ?? l} />} />
                  <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12, color: 'var(--muted)', paddingTop: 8 }} />
                  <Bar dataKey="split" name="Your split" fill="var(--c-run)" radius={[4, 4, 0, 0]} maxBarSize={26} animationDuration={1200} />
                  <Bar dataKey="target" name="Target" fill="var(--c-target)" radius={[4, 4, 0, 0]} maxBarSize={26} animationDuration={1200} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* PRs */}
          <GlassCard hover={false} delay={0.2} className="relative overflow-hidden p-6 lg:col-span-1">
            <div className="absolute -top-20 -left-20 size-56 rounded-full bg-forge opacity-25 blur-3xl" />
            <div className="relative flex items-center gap-2 text-xs font-semibold tracking-widest text-accent-ink uppercase">
              <Crown className="size-4" /> Overall PR
            </div>
            <div className="text-gradient relative mt-3 font-mono text-5xl font-bold tabular">{fmt(prs.overall.total)}</div>
            <div className="relative text-sm text-muted">{prs.overall.name}</div>
            <div className="relative mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-line p-3">
                <div className="text-xs text-muted">Fastest 1 km</div>
                <div className="font-mono text-lg font-bold">{fmt(prs.bestRun)}</div>
              </div>
              <div className="rounded-2xl border border-line p-3">
                <div className="text-xs text-muted">To target</div>
                <div className="font-mono text-lg font-bold">{prs.overall.total > user.targetFinish ? `−${fmt(prs.overall.total - user.targetFinish)}` : 'Done ✓'}</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard hover={false} delay={0.25} className="p-6 lg:col-span-2">
            <h3 className="mb-4 text-lg font-semibold">Station PRs</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {prs.stationPRs.map((s, i) => {
                const recent = s.race?.id === all[all.length - 1]?.id
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-3 rounded-2xl border border-line p-3"
                  >
                    <div className={`grid size-10 place-items-center rounded-xl ${recent ? 'bg-forge text-[#140a00]' : 'bg-[var(--line)] text-muted'}`}>
                      {recent ? <Trophy className="size-5" /> : <Medal className="size-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{s.name}</div>
                      <div className="truncate text-xs text-muted">{shortDate(s.race.date)} · {s.race.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold tabular">{fmt(s.time)}</div>
                      {recent && <div className="text-[10px] font-semibold tracking-wider text-accent-ink uppercase">New PR</div>}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
