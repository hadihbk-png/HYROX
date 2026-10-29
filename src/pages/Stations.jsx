import { forwardRef, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, SearchX, Lightbulb, Timer, Scale } from 'lucide-react'
import { PageHeader, Chip, Difficulty, EmptyState, Button } from '../components/ui'
import Icon from '../components/Icon'
import { stations } from '../data/mock'
import { fmt } from '../lib/time'

const divisions = ['Open', 'Pro', 'Doubles']

const StationCard = forwardRef(function StationCard({ s, division, index }, ref) {
  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ y: -5 }}
      className="glass group relative flex flex-col overflow-hidden rounded-3xl p-6 transition-colors hover:border-[rgba(255,170,0,0.35)]"
    >
      <div className="absolute -top-20 -right-20 size-48 rounded-full bg-forge opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-forge text-[#140a00] shadow-lg shadow-orange-500/20">
            <Icon name={s.icon} className="size-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-muted">
              {s.order ? `Station ${s.order} · ${s.category}` : s.category}
            </div>
            <h3 className="text-xl font-bold">{s.name}</h3>
          </div>
        </div>
        <div className="font-mono text-lg font-bold whitespace-nowrap text-accent-ink">{s.spec}</div>
      </div>

      <div className="relative mt-5 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-2xl border border-line p-3">
          <div className="mb-1.5 text-muted">Difficulty</div>
          <Difficulty level={s.difficulty} />
        </div>
        <div className="rounded-2xl border border-line p-3">
          <div className="mb-1 flex items-center gap-1 text-muted"><Timer className="size-3" /> My target</div>
          <div className="font-mono text-sm font-bold">{s.target ? fmt(s.target) : '—'}</div>
        </div>
      </div>

      <div className="relative mt-3 rounded-2xl border border-[rgba(255,170,0,0.25)] bg-[rgba(255,150,0,0.07)] p-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-ink">
          <Scale className="size-3.5" /> {division} standard
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={division}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-1 text-sm"
          >
            {s.standards[division]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative mt-4 flex-1">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted uppercase">
          <Lightbulb className="size-3.5" /> Technique tips
        </div>
        <ul className="space-y-2">
          {s.tips.map((t) => (
            <li key={t} className="flex gap-2 text-sm text-muted">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-forge" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  )
})

export default function Stations() {
  const [filter, setFilter] = useState('all')
  const [division, setDivision] = useState('Open')
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return stations.filter(
      (s) =>
        (filter === 'all' || s.id === filter) &&
        (!q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.tips.some((t) => t.toLowerCase().includes(q)))
    )
  }, [filter, query])

  return (
    <div>
      <PageHeader
        eyebrow="Station Library"
        title="Know every station cold."
        desc="Standards per division, difficulty, your target split and the technique cues that save seconds."
        action={
          <div className="glass inline-flex rounded-2xl p-1">
            {divisions.map((d) => (
              <button
                key={d}
                onClick={() => setDivision(d)}
                className={`relative rounded-xl px-4 py-2 text-sm font-semibold transition ${division === d ? 'text-[#140a00]' : 'text-muted hover:text-ink'}`}
              >
                {division === d && <motion.span layoutId="div-pill" className="absolute inset-0 rounded-xl bg-forge" />}
                <span className="relative">{d}</span>
              </button>
            ))}
          </div>
        }
      />

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stations, categories or tips…"
          className="glass w-full rounded-2xl py-3.5 pr-4 pl-11 text-sm outline-none placeholder:text-muted focus:border-[rgba(255,170,0,0.5)]"
        />
      </div>

      <div className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        <Chip group="st" active={filter === 'all'} onClick={() => setFilter('all')}>All</Chip>
        {stations.map((s) => (
          <Chip group="st" key={s.id} active={filter === s.id} onClick={() => setFilter(s.id)}>
            {s.name}
          </Chip>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No stations match that"
          desc={`We couldn’t find anything for “${query}”. Try “sled”, “grip” or “breathing”.`}
          action={<Button variant="ghost" onClick={() => { setQuery(''); setFilter('all') }}>Clear filters</Button>}
        />
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((s, i) => (
              <StationCard key={s.id} s={s} division={division} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
