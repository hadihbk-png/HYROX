import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  Play, Flame, Calendar, Footprints, Dumbbell, Target, Quote, Clock, Square, Timer, Flag, ChevronRight,
} from 'lucide-react'
import GlassCard from '../components/GlassCard'
import ProgressRing from '../components/ProgressRing'
import AnimatedCounter from '../components/AnimatedCounter'
import ChartTooltip from '../components/ChartTooltip'
import { Button } from '../components/ui'
import { useToast } from '../components/Toast'
import { nextRace, todaySession, weeklyGoals, weeklyTraining, user, quotes, pastRaces } from '../data/mock'
import { fmt, fmtClock } from '../lib/time'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), interval)
    return () => clearInterval(id)
  }, [interval])
  return now
}

function Countdown() {
  const now = useNow(1000)
  const diff = Math.max(0, nextRace.date.getTime() - now)
  const parts = [
    { v: Math.floor(diff / 86400000), l: 'days' },
    { v: Math.floor((diff / 3600000) % 24), l: 'hrs' },
    { v: Math.floor((diff / 60000) % 60), l: 'min' },
    { v: Math.floor((diff / 1000) % 60), l: 'sec' },
  ]
  return (
    <GlassCard delay={0.1} className="relative overflow-hidden p-6">
      <div className="absolute -right-10 -bottom-12 size-40 rounded-full bg-forge opacity-20 blur-3xl" />
      <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-muted uppercase">
        <Flag className="size-4 text-accent-ink" /> Next race
      </div>
      <div className="mt-2 font-display text-lg font-semibold">{nextRace.name}</div>
      <div className="text-xs text-muted">{nextRace.wave}</div>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {parts.map((p) => (
          <div key={p.l} className="rounded-2xl border border-line bg-[var(--glass)] py-3 text-center">
            <div className="font-mono text-2xl font-bold tabular sm:text-3xl">{String(p.v).padStart(2, '0')}</div>
            <div className="text-[10px] tracking-widest text-muted uppercase">{p.l}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-muted">
        {nextRace.date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })} · {nextRace.venue}
      </div>
    </GlassCard>
  )
}

function TodaySession() {
  const toast = useToast()
  const [startedAt, setStartedAt] = useState(null)
  const now = useNow(100)

  const start = () => {
    setStartedAt(Date.now())
    toast({ title: 'Session started. Let’s go!', desc: `${todaySession.title}: ${todaySession.subtitle}` })
  }
  const finish = () => {
    const elapsed = Date.now() - startedAt
    setStartedAt(null)
    toast({ title: 'Session logged 🔥', desc: `Nice work. ${fmtClock(elapsed, { tenths: false })} added to your week. Streak extended.` })
  }

  return (
    <GlassCard className="relative overflow-hidden p-6 md:p-7 lg:col-span-2">
      <div className="absolute -top-20 -right-20 size-64 rounded-full bg-forge opacity-25 blur-3xl" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-accent-ink uppercase">
            <Calendar className="size-4" /> Today’s session
          </div>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">{todaySession.title}</h2>
          <div className="text-gradient font-display text-2xl font-bold md:text-3xl">{todaySession.subtitle}</div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="glass rounded-full px-3 py-1.5"><Clock className="mr-1 inline size-3.5" />{todaySession.duration} min</span>
            <span className="glass rounded-full px-3 py-1.5"><Flame className="mr-1 inline size-3.5 text-molten" />{todaySession.intensity}</span>
            <span className="glass rounded-full px-3 py-1.5"><Target className="mr-1 inline size-3.5" />{todaySession.focus}</span>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {startedAt ? (
            <motion.div key="running" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
              <div className="font-mono text-3xl font-bold tabular">{fmtClock(now - startedAt)}</div>
              <Button variant="ghost" onClick={finish}><Square className="size-4 fill-current" /> Finish</Button>
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <Button onClick={start} className="w-full px-8 py-4 text-base md:w-auto">
                <Play className="size-5 fill-current" /> Start
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="relative mt-6 grid grid-cols-2 gap-2 md:grid-cols-4">
        {todaySession.blocks.map((b, i) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="rounded-2xl border border-line bg-[var(--glass)] p-3"
          >
            <div className="text-xs font-semibold text-accent-ink">{String(i + 1).padStart(2, '0')} · {b.label}</div>
            <div className="mt-1 text-sm">{b.detail}</div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}

function Streak() {
  return (
    <GlassCard delay={0.15} className="flex items-center gap-5 p-6">
      <div className="relative grid size-20 shrink-0 place-items-center">
        <motion.div
          className="absolute inset-0 rounded-full bg-forge opacity-40 blur-xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        <motion.div animate={{ rotate: [-4, 4, -4], scale: [1, 1.06, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <Flame className="size-14 fill-[#ff8a00] text-molten" />
        </motion.div>
      </div>
      <div>
        <div className="text-xs font-semibold tracking-widest text-muted uppercase">Streak</div>
        <div className="font-display text-4xl font-bold">
          <AnimatedCounter value={user.streak} /> <span className="text-lg text-muted">days</span>
        </div>
        <div className="text-xs text-muted">Best: {user.bestStreak} days. Train tomorrow to keep it alive.</div>
      </div>
    </GlassCard>
  )
}

function QuoteCard() {
  const q = quotes[new Date().getDate() % quotes.length]
  return (
    <GlassCard delay={0.2} className="p-6">
      <Quote className="size-6 text-accent-ink" />
      <p className="mt-3 font-display text-lg leading-snug font-semibold">“{q.text}”</p>
      <div className="mt-2 text-xs text-muted">— {q.author} · Quote of the day</div>
    </GlassCard>
  )
}

function Rings() {
  const { sessions, runKm, stationTargets } = weeklyGoals
  const items = [
    { ...sessions, label: 'Sessions', unit: '', icon: Dumbbell, dec: 0 },
    { ...runKm, label: 'Running', unit: ' km', icon: Footprints, dec: 1 },
    { ...stationTargets, label: 'Station targets', unit: '', icon: Target, dec: 0 },
  ]
  return (
    <GlassCard delay={0.2} className="p-6 lg:col-span-2">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold">This week</h3>
        <span className="text-xs text-muted">Resets Monday</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {items.map((it, i) => (
          <ProgressRing
            key={it.label}
            value={it.done}
            max={it.target}
            size={104}
            stroke={9}
            delay={0.3 + i * 0.15}
            label={it.label}
            sublabel={`${it.done}${it.unit} / ${it.target}${it.unit}`}
          >
            <it.icon className="mb-0.5 size-4 text-accent-ink" />
            <div className="font-display text-xl font-bold">
              <AnimatedCounter value={Math.round((it.done / it.target) * 100)} suffix="%" />
            </div>
          </ProgressRing>
        ))}
      </div>
    </GlassCard>
  )
}

function MiniBars({ dataKey, color, unit, title, total }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="size-2.5 rounded-sm" style={{ background: color }} /> {title}
        </div>
        <div className="font-mono text-sm text-muted">{total}{unit}</div>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyTraining} margin={{ top: 4, right: 0, left: -24, bottom: 0 }} barCategoryGap="22%">
            <CartesianGrid vertical={false} stroke="var(--line)" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: 'var(--c-axis)', fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--c-axis)', fontSize: 11 }} width={44} />
            <Tooltip cursor={{ fill: 'var(--line)' }} content={<ChartTooltip format={(v) => `${v}${unit}`} />} />
            <Bar dataKey={dataKey} name={title} fill={color} radius={[4, 4, 0, 0]} maxBarSize={22} animationDuration={1200} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function WeeklyChart() {
  const runTotal = weeklyTraining.reduce((a, d) => a + d.runKm, 0).toFixed(1)
  const stTotal = weeklyTraining.reduce((a, d) => a + d.stationMin, 0)
  return (
    <GlassCard delay={0.25} hover={false} className="p-6 lg:col-span-2">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Weekly training</h3>
        <span className="text-xs text-muted">Running km vs station volume</span>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <MiniBars dataKey="runKm" color="var(--c-run)" unit=" km" title="Running" total={runTotal} />
        <MiniBars dataKey="stationMin" color="var(--c-station)" unit=" min" title="Station work" total={stTotal} />
      </div>
    </GlassCard>
  )
}

function LastRace() {
  const navigate = useNavigate()
  const last = pastRaces[pastRaces.length - 1]
  const prev = pastRaces[pastRaces.length - 2]
  const delta = prev.total - last.total
  return (
    <GlassCard delay={0.3} className="cursor-pointer p-6" onClick={() => navigate('/progress')}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-muted uppercase">
          <Timer className="size-4 text-accent-ink" /> Last race
        </div>
        <ChevronRight className="size-4 text-muted" />
      </div>
      <div className="mt-3 font-mono text-4xl font-bold tabular">{fmt(last.total)}</div>
      <div className="text-sm text-muted">{last.name}</div>
      <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-500">
        ▼ {fmt(delta)} faster than last time
      </div>
    </GlassCard>
  )
}

export default function Dashboard() {
  const today = useMemo(() => new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }), [])
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
        <div className="text-sm text-muted">{today}</div>
        <h1 className="mt-1 text-3xl font-bold md:text-4xl">
          {greeting()}, <span className="text-gradient pr-1">{user.name.split(' ')[0]}</span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <TodaySession />
        <Countdown />
        <Rings />
        <Streak />
        <WeeklyChart />
        <div className="grid grid-cols-1 gap-4">
          <LastRace />
          <QuoteCard />
        </div>
      </div>
    </div>
  )
}
