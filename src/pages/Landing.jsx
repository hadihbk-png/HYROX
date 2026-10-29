import { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Timer, Footprints, Dumbbell, Flame, Trophy, Calendar, Flag, ArrowRight, Play, Activity, Gauge, Sparkles,
} from 'lucide-react'
import Logo from '../components/Logo'
import { ThemeToggle } from '../components/Theme'
import Footer from '../components/Footer'
import AnimatedCounter from '../components/AnimatedCounter'
import ProgressRing from '../components/ProgressRing'
import Icon from '../components/Icon'
import { Button } from '../components/ui'
import { communityStats, raceStations } from '../data/mock'
import { fmtClock } from '../lib/time'

const words = ['Run.', 'Push.', 'Pull.', 'Repeat.']

function HeroPreview() {
  const [ms, setMs] = useState(47 * 60 * 1000 + 12_300)
  useEffect(() => {
    const id = setInterval(() => setMs((m) => m + 100), 100)
    return () => clearInterval(id)
  }, [])
  const bars = [
    { name: 'SkiErg', v: 0.92, t: '4:44' },
    { name: 'Sled Push', v: 0.78, t: '3:18' },
    { name: 'Sled Pull', v: 0.86, t: '4:28' },
    { name: 'Burpee BJ', v: 0.7, t: '4:39' },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-md [perspective:1200px]"
    >
      <div className="absolute -inset-6 rounded-[2.5rem] bg-forge opacity-25 blur-3xl" />
      <div className="glass relative rounded-[2rem] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-muted uppercase">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-rose-500" />
            </span>
            Live simulation
          </div>
          <span className="rounded-full bg-[rgba(255,170,0,0.15)] px-3 py-1 text-xs font-semibold text-accent-ink">Run 5 / 8</span>
        </div>
        <div className="mt-5 font-mono text-5xl font-bold tracking-tight tabular sm:text-6xl">{fmtClock(ms)}</div>
        <div className="mt-1 text-sm text-muted">Projected finish <span className="font-mono font-semibold text-ink">1:21:08</span></div>

        <div className="mt-6 flex items-center gap-5">
          <ProgressRing value={62} size={92} stroke={8} delay={1}>
            <div className="font-mono text-lg font-bold">4:41</div>
            <div className="text-[10px] text-muted uppercase">/km</div>
          </ProgressRing>
          <div className="flex-1 space-y-3">
            {bars.map((b, i) => (
              <div key={b.name}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted">{b.name}</span>
                  <span className="font-mono font-semibold">{b.t}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
                  <motion.div
                    className="h-full rounded-full bg-forge"
                    initial={{ width: 0 }}
                    animate={{ width: `${b.v * 100}%` }}
                    transition={{ delay: 1.1 + i * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6 }}
        className="glass absolute -right-2 -bottom-6 flex items-center gap-3 rounded-2xl px-4 py-3 sm:-right-8"
      >
        <div className="grid size-9 place-items-center rounded-xl bg-forge text-[#140a00]"><Trophy className="size-5" /></div>
        <div>
          <div className="text-xs text-muted">New PR · Wall Balls</div>
          <div className="font-mono text-sm font-bold">4:52</div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8 }}
        className="glass absolute -top-5 -left-2 flex items-center gap-2 rounded-2xl px-3 py-2 sm:-left-8"
      >
        <Flame className="size-4 text-molten" />
        <span className="text-sm font-semibold">17-day streak</span>
      </motion.div>
    </motion.div>
  )
}

const features = [
  { icon: Timer, title: 'Live race simulation', desc: '8 × 1 km + 8 stations in race order with a big clock, split timers, Roxzone tracking and live projected finish.' },
  { icon: Activity, title: 'Station splits that teach', desc: 'Every split is compared to your target, so you can find your weakest station and fix it.' },
  { icon: Gauge, title: 'Target time calculator', desc: 'Pick a goal like sub-80 and get your run pace, every station split and a Roxzone budget.' },
  { icon: Calendar, title: 'Book classes in one tap', desc: 'Engine Builder, Strength, Run Club and Mock Races, with live spots left.' },
]

export default function Landing() {
  const navigate = useNavigate()
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="ambient" />
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[900px]" />

      {/* Navbar */}
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          <a href="#features" className="hover:text-ink">Features</a>
          <a href="#race" className="hover:text-ink">The Race</a>
          <Link to="/classes" className="hover:text-ink">Classes</Link>
          <Link to="/calculator" className="hover:text-ink">Calculator</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/dashboard" className="hidden rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-bg transition hover:opacity-90 sm:inline-flex">
            Open app
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-4 pt-8 pb-20 md:px-8 lg:grid-cols-[1.15fr_1fr] lg:pt-16">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
          >
            <Sparkles className="size-3.5 text-accent-ink" />
            Built for HYROX-style racing
          </motion.div>
          <h1 className="text-[3.2rem] leading-[0.95] font-bold tracking-tighter sm:text-7xl lg:text-[5.4rem]">
            {words.map((w, i) => (
              <Fragment key={w}>
                <motion.span
                  initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.1 + i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={`inline-block ${i === 3 ? 'text-gradient pr-2 italic' : ''}`}
                >
                  {w}
                </motion.span>{' '}
              </Fragment>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 max-w-lg text-base text-muted sm:text-lg"
          >
            <span className="font-semibold text-ink">RoxForge</span> is your race-prep HQ. Plan sessions, simulate full
            races, log every station split and walk into race day knowing your numbers.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button onClick={() => navigate('/race')} className="px-7 py-4 text-base">
              <Play className="size-5 fill-current" /> Start Race Simulation
            </Button>
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="px-7 py-4 text-base">
              View dashboard <ArrowRight className="size-4" />
            </Button>
          </motion.div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-6">
            {[
              { v: communityStats.athletes, l: 'athletes training', icon: Dumbbell },
              { v: communityStats.simulations, l: 'race sims completed', icon: Flag },
              { v: communityStats.kmThisWeek, l: 'km run this week', icon: Footprints },
            ].map(({ v, l, icon: I }, i) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <I className="mb-2 size-4 text-accent-ink" />
                <AnimatedCounter value={v} className="font-display text-2xl font-bold sm:text-4xl" duration={2.2} />
                <div className="mt-1 text-xs text-muted sm:text-sm">{l}</div>
              </motion.div>
            ))}
          </div>
        </div>
        <HeroPreview />
      </section>

      {/* Marquee */}
      <div className="relative z-10 overflow-hidden border-y border-line py-5">
        <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-10">
          {[...raceStations, ...raceStations, ...raceStations].map((s, i) => (
            <div key={i} className="flex items-center gap-3 font-display text-xl font-semibold whitespace-nowrap text-muted">
              <Icon name={s.icon} className="size-5 text-accent-ink" />
              {s.name} <span className="font-mono text-sm">{s.spec}</span>
              <span className="text-line">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-6xl px-4 py-24 md:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold tracking-[0.2em] text-accent-ink uppercase">Why RoxForge</div>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">Train like it’s race day. Every day.</h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: I, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="glass group relative overflow-hidden rounded-3xl p-7"
            >
              <div className="absolute -top-16 -right-16 size-40 rounded-full bg-forge opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30" />
              <div className="grid size-12 place-items-center rounded-2xl bg-[rgba(255,170,0,0.12)] text-accent-ink">
                <I className="size-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Race format */}
      <section id="race" className="relative z-10 mx-auto max-w-6xl px-4 pb-24 md:px-8">
        <div className="glass relative overflow-hidden rounded-[2rem] p-6 md:p-10">
          <div className="absolute -top-24 -left-24 size-72 rounded-full bg-forge opacity-20 blur-3xl" />
          <div className="relative flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold tracking-[0.2em] text-accent-ink uppercase">The format</div>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">8 km. 8 stations. One clock.</h2>
            </div>
            <p className="max-w-sm text-sm text-muted">Every station is preceded by a 1 km run. RoxForge times all 16 splits plus your Roxzone transitions.</p>
          </div>
          <div className="relative mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {raceStations.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-line bg-[var(--glass)] p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted">1 km run → {String(i + 1).padStart(2, '0')}</span>
                  <Icon name={s.icon} className="size-4 text-accent-ink" />
                </div>
                <div className="mt-3 font-semibold">{s.name}</div>
                <div className="font-mono text-sm text-muted">{s.spec}</div>
              </motion.div>
            ))}
          </div>
          <div className="relative mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-muted">
              <Trophy className="size-5 text-accent-ink" /> Average finish times range from 60 to 120 minutes.
            </div>
            <Button onClick={() => navigate('/race')}>
              <Timer className="size-4" /> Start Race Simulation
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
