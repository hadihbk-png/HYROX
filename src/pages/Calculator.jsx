import { useState } from 'react'
import { motion } from 'framer-motion'
import { Footprints, ArrowRightLeft, Gauge, AlertCircle } from 'lucide-react'
import { PageHeader, Chip } from '../components/ui'
import GlassCard from '../components/GlassCard'
import Icon from '../components/Icon'
import { fmt, parseTime, targetSplits } from '../lib/time'

const presets = [
  ['Sub-60', '59:59'],
  ['Sub-75', '1:14:59'],
  ['Sub-80', '1:19:59'],
  ['Sub-90', '1:29:59'],
  ['Sub-2h', '1:59:59'],
]

export default function CalculatorPage() {
  const [input, setInput] = useState('1:19:59')
  const goal = parseTime(input)
  const valid = goal && goal >= 50 * 60 && goal <= 4 * 3600
  const plan = valid ? targetSplits(goal) : null
  const maxSplit = plan ? Math.max(...plan.stations.map((s) => s.split)) : 1

  return (
    <div>
      <PageHeader
        eyebrow="Target Time Calculator"
        title="Reverse-engineer your race."
        desc="Enter a goal finish time and get your run pace, every station split and a Roxzone budget."
      />

      <GlassCard hover={false} className="p-6 md:p-8">
        <label htmlFor="goal" className="text-sm font-medium">Goal finish time</label>
        <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-center">
          <input
            id="goal"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            inputMode="numeric"
            placeholder="1:20:00"
            className={`glass w-full rounded-2xl px-5 py-4 font-mono text-4xl font-bold outline-none md:w-72 ${valid ? 'focus:border-[rgba(255,170,0,0.5)]' : 'border-rose-500/60'}`}
          />
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
            {presets.map(([l, v]) => (
              <Chip group="preset" key={l} active={input === v} onClick={() => setInput(v)}>{l}</Chip>
            ))}
          </div>
        </div>
        {!valid && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-center gap-2 text-sm text-rose-400">
            <AlertCircle className="size-4" /> Enter a time like 1:20:00 or 85:00, between 0:50:00 and 4:00:00.
          </motion.p>
        )}
      </GlassCard>

      {plan && (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <GlassCard delay={0.05} className="relative overflow-hidden p-6">
            <div className="absolute -top-16 -right-16 size-48 rounded-full bg-forge opacity-25 blur-3xl" />
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-muted uppercase"><Footprints className="size-4 text-accent-ink" /> Run pace</div>
            <div className="text-gradient mt-2 font-mono text-5xl font-bold">{fmt(plan.avgPace)}<span className="text-lg text-muted">/km</span></div>
            <div className="mt-1 text-sm text-muted">{fmt(plan.runTotal)} total running · 8 km</div>
            <div className="mt-5 grid grid-cols-4 gap-1.5">
              {plan.runs.map((r, i) => (
                <div key={i} className="rounded-xl border border-line py-2 text-center">
                  <div className="text-[10px] text-muted">km {i + 1}</div>
                  <div className="font-mono text-sm font-semibold">{fmt(r)}</div>
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard delay={0.1} className="p-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-muted uppercase"><Gauge className="size-4 text-accent-ink" /> Station total</div>
            <div className="mt-2 font-mono text-5xl font-bold">{fmt(plan.stationTotal)}</div>
            <div className="mt-1 text-sm text-muted">≈ 42% of your race on the stations</div>
            <div className="mt-5 flex h-3 overflow-hidden rounded-full">
              {[
                ['Running', plan.runTotal, 'var(--c-run)'],
                ['Stations', plan.stationTotal, 'var(--c-station)'],
                ['Roxzone', plan.roxzone, '#38bdf8'],
              ].map(([l, v, c], i) => (
                <motion.div
                  key={l}
                  title={`${l}: ${fmt(v)}`}
                  className="h-full border-r-2 border-bg-2 last:border-0"
                  style={{ background: c }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(v / goal) * 100}%` }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted">
              <span>Run {Math.round((plan.runTotal / goal) * 100)}%</span>
              <span>Stations {Math.round((plan.stationTotal / goal) * 100)}%</span>
              <span>Roxzone {Math.round((plan.roxzone / goal) * 100)}%</span>
            </div>
          </GlassCard>
          <GlassCard delay={0.15} className="p-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-muted uppercase"><ArrowRightLeft className="size-4 text-sky-400" /> Roxzone budget</div>
            <div className="mt-2 font-mono text-5xl font-bold">{fmt(plan.roxzone)}</div>
            <div className="mt-1 text-sm text-muted">≈ {Math.round(plan.roxzone / 15)} s per transition (15 total)</div>
            <p className="mt-5 rounded-2xl border border-line p-3 text-sm text-muted">
              Walk-in, jog-out. Know your lane before you arrive and never stop to “recover” in the Roxzone.
            </p>
          </GlassCard>

          <GlassCard hover={false} delay={0.2} className="p-6 lg:col-span-3">
            <h3 className="mb-5 text-lg font-semibold">Station splits</h3>
            <div className="space-y-3">
              {plan.stations.map((s, i) => (
                <div key={s.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                  <div className="flex w-40 items-center gap-2 sm:w-52">
                    <Icon name={s.icon} className="size-4 shrink-0 text-accent-ink" />
                    <span className="truncate text-sm font-medium">{s.name}</span>
                    <span className="hidden font-mono text-xs text-muted sm:inline">{s.spec}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[var(--line)]">
                    <motion.div
                      className="h-full rounded-full bg-forge"
                      initial={{ width: 0 }}
                      animate={{ width: `${(s.split / maxSplit) * 100}%` }}
                      transition={{ delay: 0.25 + i * 0.06, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <div className="w-14 text-right font-mono font-bold tabular">{fmt(s.split)}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
