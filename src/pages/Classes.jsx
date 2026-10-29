import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock, User, Users, CalendarX, Check, CalendarCheck } from 'lucide-react'
import { PageHeader, Chip, EmptyState, Button } from '../components/ui'
import { useToast } from '../components/Toast'
import { classes as initialClasses, classTypes } from '../data/mock'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const todayKey = days[(new Date().getDay() + 6) % 7]

export default function Classes() {
  const toast = useToast()
  const [day, setDay] = useState(todayKey)
  const [type, setType] = useState('all')
  const [list, setList] = useState(initialClasses)
  const [booked, setBooked] = useState(() => new Set())
  const [waitlist, setWaitlist] = useState(() => new Set())

  const visible = list.filter((c) => c.day === day && (type === 'all' || c.type === type))

  const book = (c) => {
    if (booked.has(c.id)) {
      setBooked((b) => { const n = new Set(b); n.delete(c.id); return n })
      setList((l) => l.map((x) => (x.id === c.id ? { ...x, spots: x.spots + 1 } : x)))
      toast({ type: 'info', title: 'Booking cancelled', desc: `${c.name} · ${c.day} ${c.time}. Your spot has been released.` })
      return
    }
    if (c.spots === 0) {
      setWaitlist((w) => new Set(w).add(c.id))
      toast({ type: 'info', title: 'You’re on the waitlist', desc: `We’ll ping you if a spot opens in ${c.name}.` })
      return
    }
    setBooked((b) => new Set(b).add(c.id))
    setList((l) => l.map((x) => (x.id === c.id ? { ...x, spots: x.spots - 1 } : x)))
    toast({ title: 'You’re booked in! 💪', desc: `${c.name} with ${c.coach} · ${c.day} ${c.time}` })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Class Booking"
        title="Train with the pack."
        desc="HYROX-style classes, engine work, strength, run club and full mock races. Grab a spot before they’re gone."
        action={
          <div className="glass inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm">
            <CalendarCheck className="size-4 text-accent-ink" />
            <span className="font-semibold">{booked.size}</span> <span className="text-muted">booked this week</span>
          </div>
        }
      />

      <div className="glass mb-4 grid grid-cols-7 gap-1 rounded-2xl p-1.5">
        {days.map((d) => {
          const count = list.filter((c) => c.day === d).length
          return (
            <button
              key={d}
              onClick={() => setDay(d)}
              className={`relative rounded-xl py-2.5 text-center transition ${day === d ? 'text-[#140a00]' : 'text-muted hover:text-ink'}`}
            >
              {day === d && <motion.span layoutId="day-pill" className="absolute inset-0 rounded-xl bg-forge" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />}
              <span className="relative block text-sm font-semibold">{d}</span>
              <span className="relative block text-[10px] opacity-70">{d === todayKey ? 'Today' : `${count} cls`}</span>
            </button>
          )
        })}
      </div>

      <div className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        <Chip group="ctype" active={type === 'all'} onClick={() => setType('all')}>All types</Chip>
        {Object.entries(classTypes).map(([k, v]) => (
          <Chip group="ctype" key={k} active={type === k} onClick={() => setType(k)}>{v.label}</Chip>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={CalendarX}
          title="Nothing scheduled here"
          desc={`No ${type === 'all' ? '' : classTypes[type].label + ' '}classes on ${day}. Try another day, or make it a solo session.`}
          action={<Button variant="ghost" onClick={() => setType('all')}>Show all types</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((c, i) => {
              const t = classTypes[c.type]
              const isBooked = booked.has(c.id)
              const isWait = waitlist.has(c.id)
              const fill = (c.capacity - c.spots) / c.capacity
              return (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className={`glass relative overflow-hidden rounded-3xl p-5 ${isBooked ? 'border-[rgba(255,170,0,0.5)]' : ''}`}
                >
                  <div className="absolute inset-y-0 left-0 w-1" style={{ background: t.color }} />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-2xl font-bold">{c.time}</div>
                      <h3 className="mt-1 text-lg font-semibold">{c.name}</h3>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-ink" style={{ background: `${t.color}22` }}>
                      <span className="size-2 rounded-full" style={{ background: t.color }} />
                      {t.label}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span className="flex items-center gap-1"><User className="size-3.5" /> {c.coach}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3.5" /> {c.duration} min</span>
                    <span className="flex items-center gap-1"><Users className="size-3.5" /> {c.capacity} max</span>
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div className="flex-1">
                      <div className={`mb-1.5 text-xs font-semibold ${c.spots === 0 ? 'text-rose-400' : c.spots <= 3 ? 'text-accent-ink' : 'text-muted'}`}>
                        {c.spots === 0 ? 'Fully booked' : c.spots <= 3 ? `Only ${c.spots} spot${c.spots > 1 ? 's' : ''} left!` : `${c.spots} spots left`}
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: t.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${fill * 100}%` }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                    <Button
                      variant={isBooked || c.spots === 0 ? 'ghost' : 'primary'}
                      onClick={() => book(c)}
                      disabled={isWait && !isBooked}
                      className="shrink-0 px-4 py-2.5"
                    >
                      {isBooked ? (<><Check className="size-4" /> Booked</>) : c.spots === 0 ? (isWait ? 'Waitlisted' : 'Join waitlist') : 'Book'}
                    </Button>
                  </div>
                  {isBooked && <div className="mt-2 text-right text-[11px] text-muted">Tap again to cancel</div>}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
