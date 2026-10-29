import { motion } from 'framer-motion'

export function PageHeader({ eyebrow, title, desc, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between"
    >
      <div>
        {eyebrow && <div className="mb-2 text-xs font-semibold tracking-[0.2em] text-accent-ink uppercase">{eyebrow}</div>}
        <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
        {desc && <p className="mt-2 max-w-xl text-sm text-muted md:text-base">{desc}</p>}
      </div>
      {action}
    </motion.div>
  )
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40'
  const variants = {
    primary: 'bg-forge text-[#140a00] glow-accent hover:brightness-110',
    ghost: 'glass text-ink hover:border-[rgba(255,170,0,0.4)]',
    subtle: 'bg-[var(--line)] text-ink hover:bg-[rgba(255,170,0,0.15)]',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function Chip({ active, children, group = 'chip', ...props }) {
  return (
    <button
      {...props}
      className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
        active ? 'text-[#140a00]' : 'glass text-muted hover:text-ink'
      }`}
    >
      {active && (
        <motion.span
          layoutId={`${group}-active`}
          className="absolute inset-0 rounded-full bg-forge"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
        />
      )}
      <span className="relative">{children}</span>
    </button>
  )
}

export function EmptyState({ icon: IconC, title, desc, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass flex flex-col items-center rounded-3xl px-6 py-14 text-center"
    >
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-[rgba(255,170,0,0.12)] text-accent-ink">
        <IconC className="size-7" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{desc}</p>
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}

export function Difficulty({ level }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Difficulty ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`h-1.5 w-4 rounded-full ${i <= level ? 'bg-forge' : 'bg-[var(--line)]'}`} />
      ))}
    </div>
  )
}

export function Stat({ label, value, sub }) {
  return (
    <div>
      <div className="text-xs font-medium tracking-wider text-muted uppercase">{label}</div>
      <div className="mt-1 font-mono text-xl font-bold tabular">{value}</div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </div>
  )
}
