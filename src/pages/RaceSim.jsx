import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  Play, Pause, SkipForward, RotateCcw, Flag, Footprints, Trophy, Timer, ArrowRightLeft, Coffee, Save, TrendingUp, Check,
} from 'lucide-react'
import { PageHeader, Button } from '../components/ui'
import GlassCard from '../components/GlassCard'
import ProgressRing from '../components/ProgressRing'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'
import { raceStations, user } from '../data/mock'
import { fmt, fmtClock, parseTime, sum, targetSplits } from '../lib/time'
import { saveSim } from '../lib/storage'

const typeStyle = {
  run: { label: 'Run', color: '#ff6a1a', Icon: Footprints },
  station: { label: 'Station', color: '#ffd23f', Icon: Flag },
  roxzone: { label: 'Roxzone', color: '#38bdf8', Icon: ArrowRightLeft },
  rest: { label: 'Rest', color: '#a78bfa', Icon: Coffee },
}

function buildSegments({ roxzone, rest, goal }) {
  const plan = targetSplits(goal)
  const transitions = 15
  const rzTarget = plan.roxzone / transitions
  const segs = []
  raceStations.forEach((st, i) => {
    segs.push({ type: 'run', i, label: `Run ${i + 1}`, sub: '1 km', target: plan.runs[i] })
    if (roxzone) segs.push({ type: 'roxzone', i, label: 'Roxzone', sub: `Into ${st.name}`, target: rzTarget })
    segs.push({ type: 'station', i, label: st.name, sub: st.spec, icon: st.icon, target: plan.stations[i].split })
    if (i < raceStations.length - 1) {
      if (rest) segs.push({ type: 'rest', i, label: 'Planned rest', sub: `${rest} s recovery`, target: rest })
      if (roxzone) segs.push({ type: 'roxzone', i, label: 'Roxzone', sub: 'Out to the run', target: rzTarget })
    }
  })
  return segs
}

/* ---------- Setup ---------- */
function Setup({ onStart }) {
  const [goalStr, setGoalStr] = useState(fmt(user.targetFinish))
  const [roxzone, setRoxzone] = useState(true)
  const [rest, setRest] = useState(0)
  const goal = parseTime(goalStr)
  const valid = goal && goal >= 45 * 60 && goal <= 4 * 3600

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr]">
      <GlassCard hover={false} className="p-6 md:p-8">
        <h2 className="text-xl font-bold">Race settings</h2>
        <label className="mt-6 block text-sm font-medium">Target finish time</label>
        <input
          value={goalStr}
          onChange={(e) => setGoalStr(e.target.value)}
          inputMode="numeric"
          className={`glass mt-2 w-full rounded-2xl px-4 py-3.5 font-mono text-2xl font-bold outline-none ${valid ? 'focus:border-[rgba(255,170,0,0.5)]' : 'border-rose-500/60'}`}
          placeholder="1:20:00"
        />
        <p className={`mt-2 text-xs ${valid ? 'text-muted' : 'text-rose-400'}`}>
          {valid ? 'Used for split targets and your projected finish.' : 'Hmm, that doesn’t look right. Use h:mm:ss between 0:45:00 and 4:00:00.'}
        </p>

        <button
          role="switch"
          aria-checked={roxzone}
          onClick={() => setRoxzone((v) => !v)}
          className="mt-6 flex w-full items-center justify-between gap-4 rounded-2xl border border-line p-4 text-left transition hover:border-[rgba(255,170,0,0.35)]"
        >
          <div>
            <div className="text-sm font-semibold">Track Roxzone transitions</div>
            <div className="text-xs text-muted">Separate timer for every run ↔ station change</div>
          </div>
          <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${roxzone ? 'bg-forge' : 'bg-[var(--line)]'}`}>
            <motion.span layout className={`absolute top-1 size-5 rounded-full bg-white shadow ${roxzone ? 'right-1' : 'left-1'}`} />
          </span>
        </button>

        <div className="mt-4 rounded-2xl border border-line p-4">
          <div className="text-sm font-semibold">Planned rest after each station</div>
          <div className="text-xs text-muted">Training mode: rest isn’t counted in race time</div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[0, 30, 60, 90].map((r) => (
              <button
                key={r}
                onClick={() => setRest(r)}
                className={`rounded-xl py-2 text-sm font-semibold transition ${rest === r ? 'bg-forge text-[#140a00]' : 'bg-[var(--line)] text-muted hover:text-ink'}`}
              >
                {r ? `${r}s` : 'Off'}
              </button>
            ))}
          </div>
        </div>

        <Button disabled={!valid} onClick={() => onStart({ goal, roxzone, rest })} className="mt-6 w-full py-4 text-base">
          <Play className="size-5 fill-current" /> Start Race Simulation
        </Button>
      </GlassCard>

      <GlassCard hover={false} delay={0.1} className="p-6 md:p-8">
        <h2 className="text-xl font-bold">Race order</h2>
        <p className="text-sm text-muted">8 × 1 km run, each followed by one station.</p>
        <ol className="mt-5 space-y-2">
          {raceStations.map((s, i) => (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="flex items-center gap-3 rounded-2xl border border-line p-3"
            >
              <span className="w-6 font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
              <Footprints className="size-4 text-[#ff6a1a]" />
              <span className="text-xs text-muted">1 km</span>
              <span className="text-muted">→</span>
              <Icon name={s.icon} className="size-4 text-accent-ink" />
              <span className="flex-1 text-sm font-semibold">{s.name}</span>
              <span className="font-mono text-xs text-muted">{s.spec}</span>
            </motion.li>
          ))}
        </ol>
      </GlassCard>
    </div>
  )
}

/* ---------- Finish ---------- */
function fireConfetti() {
  const colors = ['#ff4d00', '#ff8a00', '#ffd600', '#ffffff']
  const end = Date.now() + 1800
  confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 }, colors })
  const frame = () => {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors })
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

function Finish({ log, goal, onReset }) {
  const toast = useToast()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const raced = log.filter((l) => l.type !== 'rest')
  const total = sum(raced.map((l) => l.duration))
  const runs = log.filter((l) => l.type === 'run')
  const stationsLog = log.filter((l) => l.type === 'station')
  const rz = sum(log.filter((l) => l.type === 'roxzone').map((l) => l.duration))
  const beat = total <= goal

  useEffect(() => {
    fireConfetti()
  }, [])

  const save = () => {
    const ok = saveSim({
      id: `sim-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      name: 'Sim · RoxForge Live',
      type: 'Simulation',
      runs: runs.map((r) => Math.round(r.duration)),
      stations: stationsLog.map((s) => Math.round(s.duration)),
      roxzone: Math.round(rz),
      total: Math.round(total),
    })
    if (ok) {
      setSaved(true)
      toast({ title: 'Simulation saved', desc: 'It’s now on your Progress & Splits charts.' })
    } else {
      toast({ type: 'error', title: 'Couldn’t save this one', desc: 'Your browser blocked storage. Your splits are still on screen.' })
    }
  }

  const maxRow = Math.max(...runs.map((r, i) => r.duration + (stationsLog[i]?.duration ?? 0)))

  return (
    <div className="space-y-4">
      <GlassCard hover={false} className="relative overflow-hidden p-8 text-center md:p-12">
        <div className="absolute inset-x-0 -top-32 mx-auto size-80 rounded-full bg-forge opacity-30 blur-3xl" />
        <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.5 }}>
          <Trophy className="relative mx-auto size-16 text-accent-ink" />
        </motion.div>
        <div className="relative mt-4 text-xs font-semibold tracking-[0.3em] text-muted uppercase">Finish line</div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gradient relative mt-2 font-mono text-6xl font-bold tabular md:text-8xl"
        >
          {fmt(total, { forceHours: true })}
        </motion.div>
        <div className={`relative mt-3 inline-flex rounded-full px-4 py-1.5 text-sm font-semibold ${beat ? 'bg-emerald-500/15 text-emerald-500' : 'bg-[var(--line)] text-muted'}`}>
          {beat ? `🔥 ${fmt(goal - total)} under your ${fmt(goal)} target` : `${fmt(total - goal)} over target. Next one’s yours`}
        </div>
        <div className="relative mt-8 grid grid-cols-3 gap-3 text-left">
          {[
            { l: 'Running', v: sum(runs.map((r) => r.duration)) },
            { l: 'Stations', v: sum(stationsLog.map((s) => s.duration)) },
            { l: 'Roxzone', v: rz },
          ].map((x) => (
            <div key={x.l} className="rounded-2xl border border-line p-4">
              <div className="text-xs text-muted">{x.l}</div>
              <div className="font-mono text-xl font-bold">{fmt(x.v)}</div>
            </div>
          ))}
        </div>
        <div className="relative mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={save} disabled={saved}>{saved ? <Check className="size-4" /> : <Save className="size-4" />}{saved ? 'Saved' : 'Save to progress'}</Button>
          <Button variant="ghost" onClick={() => navigate('/progress')}><TrendingUp className="size-4" /> View progress</Button>
          <Button variant="ghost" onClick={onReset}><RotateCcw className="size-4" /> New simulation</Button>
        </div>
      </GlassCard>

      <GlassCard hover={false} delay={0.2} className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Split summary</h3>
        <div className="space-y-3">
          {runs.map((r, i) => {
            const st = stationsLog[i]
            if (!st) return null
            const delta = st.duration - st.target
            return (
              <div key={i}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">
                    <span className="font-mono text-muted">{String(i + 1).padStart(2, '0')}</span> Run + {st.label}
                  </span>
                  <span className="font-mono text-xs">
                    {fmt(r.duration)} + {fmt(st.duration)}{' '}
                    <span className={delta <= 0 ? 'text-emerald-500' : 'text-rose-400'}>({delta <= 0 ? '−' : '+'}{fmt(Math.abs(delta))})</span>
                  </span>
                </div>
                <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full">
                  <motion.div
                    className="h-full rounded-l-full bg-[#ff6a1a]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(r.duration / maxRow) * 100}%` }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <motion.div
                    className="h-full rounded-r-full bg-[#ffd23f]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(st.duration / maxRow) * 100}%` }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#ff6a1a]" /> Run</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#ffd23f]" /> Station (Δ vs target)</span>
        </div>
      </GlassCard>
    </div>
  )
}

/* ---------- Live ---------- */
export default function RaceSim() {
  const toast = useToast()
  const [config, setConfig] = useState(null)
  const [segments, setSegments] = useState([])
  const [idx, setIdx] = useState(0)
  const [log, setLog] = useState([])
  const [segBase, setSegBase] = useState(0) // ms banked before last resume
  const [segStart, setSegStart] = useState(null) // timestamp when running, null when paused
  const [now, setNow] = useState(() => performance.now())
  const [finished, setFinished] = useState(false)
  const advancing = useRef(false)

  const running = segStart !== null
  useEffect(() => {
    if (!running) return
    let raf
    const tick = () => {
      setNow(performance.now())
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running])

  const seg = segments[idx]
  const segMs = segBase + (segStart !== null ? now - segStart : 0)
  const loggedRaceMs = sum(log.filter((l) => l.type !== 'rest').map((l) => l.duration * 1000))
  const raceMs = loggedRaceMs + (seg && seg.type !== 'rest' ? segMs : 0)

  const start = (cfg) => {
    setConfig(cfg)
    setSegments(buildSegments(cfg))
    setIdx(0)
    setLog([])
    setSegBase(0)
    setSegStart(performance.now())
    setNow(performance.now())
    setFinished(false)
  }

  const reset = () => {
    setConfig(null)
    setSegments([])
    setLog([])
    setIdx(0)
    setSegBase(0)
    setSegStart(null)
    setFinished(false)
  }

  const next = useCallback(() => {
    if (!seg || advancing.current) return
    advancing.current = true
    const t = performance.now()
    const dur = (segBase + (segStart !== null ? t - segStart : 0)) / 1000
    const entry = { ...seg, duration: seg.type === 'rest' ? Math.min(dur, seg.target) : dur }
    setLog((l) => [...l, entry])
    if (idx + 1 >= segments.length) {
      setSegStart(null)
      setFinished(true)
    } else {
      setIdx(idx + 1)
      setSegBase(0)
      setSegStart(t)
      setNow(t)
    }
    requestAnimationFrame(() => (advancing.current = false))
  }, [seg, segBase, segStart, idx, segments.length])

  const togglePause = () => {
    const t = performance.now()
    if (running) {
      setSegBase((b) => b + (t - segStart))
      setSegStart(null)
      toast({ type: 'info', title: 'Paused', desc: 'Clock stopped. Tap resume when you’re ready.' })
    } else {
      setSegStart(t)
      setNow(t)
    }
  }

  // Auto-advance when planned rest runs out
  useEffect(() => {
    if (seg?.type === 'rest' && running && segMs >= seg.target * 1000) next()
  }, [seg, running, segMs, next])

  // Keyboard: N or → logs the split
  useEffect(() => {
    if (!config || finished) return
    const onKey = (e) => {
      if (e.key === 'n' || e.key === 'N' || e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [config, finished, next])

  // Projection: scale remaining targets by how you’re tracking so far
  const projection = useMemo(() => {
    if (!segments.length) return null
    const done = log.filter((l) => l.type !== 'rest')
    const rawRatio = done.length ? sum(done.map((l) => l.duration)) / sum(done.map((l) => l.target)) : 1
    // Clamp so one fumbled tap early on doesn't wreck the projection
    const ratio = Math.min(1.5, Math.max(0.75, rawRatio))
    const remaining = segments.slice(idx).filter((s) => s.type !== 'rest')
    const curTarget = seg && seg.type !== 'rest' ? seg.target : 0
    const curSec = seg && seg.type !== 'rest' ? segMs / 1000 : 0
    const restTargets = sum(remaining.map((s) => s.target)) - curTarget
    return loggedRaceMs / 1000 + Math.max(curSec, curTarget * ratio) + restTargets * ratio
  }, [segments, log, idx, seg, segMs, loggedRaceMs])

  const runLogs = log.filter((l) => l.type === 'run')
  const avgPace = runLogs.length ? sum(runLogs.map((r) => r.duration)) / runLogs.length : null

  if (!config) {
    return (
      <div>
        <PageHeader
          eyebrow="Live Race Simulation"
          title="Full race. Real clock."
          desc="Run the whole HYROX-style format: 8 × 1 km, 8 stations, every split and transition logged with one big button."
        />
        <Setup onStart={start} />
      </div>
    )
  }

  if (finished) {
    return (
      <div>
        <PageHeader eyebrow="Race complete" title="You did the thing." />
        <Finish log={log} goal={config.goal} onReset={reset} />
      </div>
    )
  }

  const style = typeStyle[seg.type]
  const delta = segMs / 1000 - seg.target
  const isRest = seg.type === 'rest'
  const nextSeg = segments[idx + 1]

  return (
    <div className="space-y-4">
      {/* Progress track */}
      <div className="flex items-center gap-1">
        {segments.map((s, i) => (
          <div key={i} className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--line)]" title={s.label}>
            {i < idx && <motion.div layoutId={undefined} className="absolute inset-0" style={{ background: typeStyle[s.type].color }} />}
            {i === idx && (
              <motion.div
                className="absolute inset-0"
                style={{ background: style.color }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Main clock card */}
        <GlassCard hover={false} className="relative overflow-hidden p-6 md:p-8">
          <div className="absolute -top-24 -right-24 size-72 rounded-full opacity-25 blur-3xl transition-colors duration-700" style={{ background: style.color }} />
          <div className="relative flex items-center justify-between">
            <div className="text-xs font-semibold tracking-[0.25em] text-muted uppercase">Race time</div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              {running ? (
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="relative flex size-2"><span className="absolute size-full animate-ping rounded-full bg-rose-500 opacity-75" /><span className="relative size-2 rounded-full bg-rose-500" /></span>
                  LIVE
                </span>
              ) : (
                <span className="text-muted">PAUSED</span>
              )}
            </div>
          </div>
          <div className="relative mt-1 font-mono text-[3.4rem] leading-none font-bold tracking-tight tabular sm:text-7xl md:text-8xl">
            {fmtClock(raceMs)}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="relative mt-8 flex items-center gap-5"
            >
              {isRest ? (
                <ProgressRing
                  value={Math.max(0, seg.target * 1000 - segMs)}
                  max={seg.target * 1000}
                  size={128}
                  stroke={10}
                  delay={0}
                  colors={['#7c3aed', '#a78bfa']}
                >
                  <div className="font-mono text-3xl font-bold tabular">{Math.ceil(Math.max(0, seg.target - segMs / 1000))}</div>
                  <div className="text-[10px] tracking-widest text-muted uppercase">sec rest</div>
                </ProgressRing>
              ) : (
                <div className="grid size-20 shrink-0 place-items-center rounded-3xl text-[#140a00] md:size-24" style={{ background: style.color }}>
                  {seg.icon ? <Icon name={seg.icon} className="size-10" /> : <style.Icon className="size-10" />}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-muted uppercase">
                  <span className="size-2 rounded-full" style={{ background: style.color }} />
                  {style.label} · {idx + 1}/{segments.length}
                </div>
                <div className="truncate font-display text-2xl font-bold md:text-3xl">{seg.label}</div>
                <div className="text-sm text-muted">{seg.sub}</div>
                {!isRest && (
                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="font-mono text-3xl font-bold tabular md:text-4xl">{fmtClock(segMs)}</span>
                    <span className={`font-mono text-sm font-semibold ${delta <= 0 ? 'text-emerald-500' : 'text-rose-400'}`}>
                      {delta <= 0 ? '−' : '+'}{fmt(Math.abs(delta))}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="relative mt-8 grid grid-cols-[auto_1fr] gap-3">
            <Button variant="ghost" onClick={togglePause} className="size-16 rounded-2xl p-0" aria-label={running ? 'Pause' : 'Resume'}>
              {running ? <Pause className="size-6" /> : <Play className="size-6 fill-current" />}
            </Button>
            <Button onClick={next} className="h-16 text-lg">
              {isRest ? 'Skip rest' : idx === segments.length - 1 ? 'Finish race' : 'Next'}
              {idx === segments.length - 1 ? <Flag className="size-5" /> : <SkipForward className="size-5 fill-current" />}
            </Button>
          </div>
          <div className="relative mt-3 flex justify-between text-xs text-muted">
            <span>Up next: <span className="font-semibold text-ink">{nextSeg ? `${nextSeg.label}${nextSeg.type === 'run' ? '' : ` · ${nextSeg.sub}`}` : 'Finish line 🏁'}</span></span>
            <span className="hidden sm:inline">Press N to log split</span>
          </div>
        </GlassCard>

        {/* Stats column */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          <GlassCard hover={false} delay={0.05} className="col-span-2 p-5 lg:col-span-1">
            <div className="text-xs font-semibold tracking-widest text-muted uppercase">Projected finish</div>
            <div className="mt-1 font-mono text-4xl font-bold tabular">{fmt(projection, { forceHours: true })}</div>
            <div className={`mt-1 text-xs font-semibold ${projection <= config.goal ? 'text-emerald-500' : 'text-rose-400'}`}>
              {projection <= config.goal ? `On track for ${fmt(config.goal)} ✓` : `${fmt(projection - config.goal)} behind ${fmt(config.goal)} target`}
            </div>
          </GlassCard>
          <GlassCard hover={false} delay={0.1} className="p-5">
            <div className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-muted uppercase"><Footprints className="size-3.5" /> Live pace</div>
            <div className="mt-1 font-mono text-2xl font-bold tabular">
              {seg.type === 'run' ? fmt(segMs / 1000) : avgPace ? fmt(avgPace) : '--:--'}
              <span className="text-sm text-muted">/km</span>
            </div>
            <div className="text-xs text-muted">{seg.type === 'run' ? 'Current km' : 'Average so far'}</div>
          </GlassCard>
          <GlassCard hover={false} delay={0.15} className="p-5">
            <div className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-muted uppercase"><Timer className="size-3.5" /> Avg pace</div>
            <div className="mt-1 font-mono text-2xl font-bold tabular">
              {avgPace ? fmt(avgPace) : '--:--'}
              <span className="text-sm text-muted">/km</span>
            </div>
            <div className="text-xs text-muted">{runLogs.length}/8 km done</div>
          </GlassCard>
          <GlassCard hover={false} delay={0.2} className="col-span-2 max-h-72 overflow-y-auto p-5 lg:col-span-1">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-widest text-muted uppercase">Splits</span>
              <button onClick={() => window.confirm('Abandon this simulation? Your splits will be lost.') && reset()} className="text-xs text-muted hover:text-rose-400">
                Abandon
              </button>
            </div>
            {log.length === 0 ? (
              <p className="text-sm text-muted">Your splits will appear here as you hit Next. First km: easy does it.</p>
            ) : (
              <ul className="space-y-1.5">
                <AnimatePresence initial={false}>
                  {[...log].reverse().map((l, i) => (
                    <motion.li
                      key={log.length - i}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="size-2 rounded-full" style={{ background: typeStyle[l.type].color }} />
                      <span className="flex-1 truncate">{l.label}</span>
                      <span className="font-mono font-semibold tabular">{fmt(l.duration)}</span>
                      <span className={`w-12 text-right font-mono text-xs ${l.duration <= l.target ? 'text-emerald-500' : 'text-rose-400'}`}>
                        {l.type === 'rest' ? '' : `${l.duration <= l.target ? '−' : '+'}${fmt(Math.abs(l.duration - l.target))}`}
                      </span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
