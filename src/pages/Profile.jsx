import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Pencil, Lock, Flag, Timer, Award, Check } from 'lucide-react'
import { PageHeader, Button } from '../components/ui'
import GlassCard from '../components/GlassCard'
import Icon from '../components/Icon'
import AnimatedCounter from '../components/AnimatedCounter'
import { useToast } from '../components/Toast'
import { user, achievements, pastRaces, nextRace } from '../data/mock'
import { fmt, parseTime } from '../lib/time'

const divisionOptions = ['Open', 'Pro', 'Doubles', 'Relay']

export default function Profile() {
  const toast = useToast()
  const [division, setDivision] = useState(user.division)
  const [targetStr, setTargetStr] = useState(fmt(user.targetFinish, { forceHours: true }))
  const [editing, setEditing] = useState(false)
  const target = parseTime(targetStr)
  const earned = achievements.filter((a) => a.earned).length
  const best = Math.min(...pastRaces.map((r) => r.total))

  const save = () => {
    if (!target || target < 45 * 60 || target > 4 * 3600) {
      toast({ type: 'error', title: 'That target time looks off', desc: 'Use h:mm:ss, between 0:45:00 and 4:00:00.' })
      return
    }
    setEditing(false)
    toast({ title: 'Profile updated', desc: `${division} division · target ${fmt(target, { forceHours: true })}` })
  }

  return (
    <div>
      <PageHeader eyebrow="Profile" title="Your race identity." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard hover={false} className="relative overflow-hidden p-6 md:p-8 lg:col-span-2">
          <div className="absolute -top-24 -right-24 size-72 rounded-full bg-forge opacity-20 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative">
              <motion.div
                className="absolute -inset-1.5 rounded-[2rem] bg-forge opacity-70 blur-md"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="relative grid size-24 place-items-center rounded-[1.7rem] bg-forge font-display text-4xl font-bold text-[#140a00]">
                {user.initials}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold">{user.name}</h2>
              <div className="text-sm text-muted">{user.handle} · Member since {user.memberSince}</div>
              <div className="mt-2 flex items-center gap-1 text-sm text-muted"><MapPin className="size-4" /> {user.homeGym}</div>
            </div>
            <Button variant="ghost" onClick={() => (editing ? save() : setEditing(true))}>
              {editing ? <><Check className="size-4" /> Save</> : <><Pencil className="size-4" /> Edit</>}
            </Button>
          </div>

          <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-line p-4">
              <div className="text-xs text-muted">Division</div>
              {editing ? (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {divisionOptions.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDivision(d)}
                      className={`rounded-lg py-1.5 text-xs font-semibold ${division === d ? 'bg-forge text-[#140a00]' : 'bg-[var(--line)] text-muted'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-1 font-display text-xl font-bold">{division} · {user.category}</div>
              )}
            </div>
            <div className="rounded-2xl border border-line p-4">
              <div className="flex items-center gap-1 text-xs text-muted"><Flag className="size-3.5" /> Target race</div>
              <div className="mt-1 font-semibold">{user.targetRace}</div>
              <div className="text-xs text-muted">{nextRace.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
            <div className="rounded-2xl border border-line p-4">
              <div className="flex items-center gap-1 text-xs text-muted"><Timer className="size-3.5" /> Target finish</div>
              {editing ? (
                <input
                  value={targetStr}
                  onChange={(e) => setTargetStr(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-[var(--line)] px-2 py-1.5 font-mono text-lg font-bold outline-none"
                />
              ) : (
                <div className="text-gradient mt-1 font-mono text-2xl font-bold">{fmt(target ?? user.targetFinish, { forceHours: true })}</div>
              )}
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false} delay={0.1} className="grid grid-cols-2 gap-4 p-6 lg:grid-cols-1">
          {[
            { l: 'Races & sims', v: pastRaces.length },
            { l: 'Best finish', v: null, s: fmt(best) },
            { l: 'Day streak', v: user.streak },
            { l: 'Badges earned', v: earned, suffix: `/${achievements.length}` },
          ].map((x) => (
            <div key={x.l}>
              <div className="text-xs text-muted">{x.l}</div>
              <div className="font-display text-3xl font-bold">
                {x.v != null ? <AnimatedCounter value={x.v} suffix={x.suffix ?? ''} /> : <span className="font-mono">{x.s}</span>}
              </div>
            </div>
          ))}
        </GlassCard>

        <GlassCard hover={false} delay={0.15} className="p-6 md:p-8 lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold"><Award className="size-5 text-accent-ink" /> Achievements</h3>
            <span className="text-sm text-muted">{earned} of {achievements.length} unlocked</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {achievements.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.06, type: 'spring', bounce: 0.4 }}
                whileHover={a.earned ? { y: -6, rotate: -1 } : {}}
                className={`relative flex flex-col items-center rounded-3xl border p-5 text-center ${
                  a.earned ? 'border-[rgba(255,170,0,0.3)] bg-[rgba(255,150,0,0.06)]' : 'border-line opacity-55'
                }`}
              >
                <div className={`relative grid size-16 place-items-center rounded-full ${a.earned ? 'bg-forge text-[#140a00] glow-accent' : 'bg-[var(--line)] text-muted'}`}>
                  <Icon name={a.icon} className="size-7" />
                  {!a.earned && (
                    <span className="absolute -right-1 -bottom-1 grid size-6 place-items-center rounded-full bg-bg-2 text-muted"><Lock className="size-3" /></span>
                  )}
                </div>
                <div className="mt-3 text-sm font-bold">{a.name}</div>
                <div className="mt-1 text-xs text-muted">{a.desc}</div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
