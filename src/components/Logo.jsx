import { useId } from 'react'
import { Link } from 'react-router-dom'

export function LogoMark({ size = 34 }) {
  // Unique per instance: a shared id resolves to the first (possibly hidden) logo on the page
  const id = `rf-g-${useId().replace(/:/g, '')}`
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff4d00" />
          <stop offset="1" stopColor="#ffd600" />
        </linearGradient>
      </defs>
      <rect x="26" y="4" width="12" height="6" rx="2" fill={`url(#${id})`} />
      <circle cx="32" cy="36" r="21" fill="none" stroke={`url(#${id})`} strokeWidth="5" />
      <path d="M35 19 L23 39 H31 L28 53 L42 31 H34 Z" fill={`url(#${id})`} />
    </svg>
  )
}

export default function Logo({ to = '/', size = 'md' }) {
  const text = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl'
  return (
    <Link to={to} className="group inline-flex items-center gap-2.5 select-none" aria-label="RoxForge home">
      <span className="transition-transform duration-500 group-hover:rotate-[20deg]">
        <LogoMark size={size === 'lg' ? 40 : size === 'sm' ? 26 : 32} />
      </span>
      <span className={`font-display font-bold italic tracking-tight ${text}`}>
        <span className="text-ink">Rox</span>
        <span className="text-gradient pr-1">Forge</span>
      </span>
    </Link>
  )
}
