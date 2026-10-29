import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer({ compact = false }) {
  const year = new Date().getFullYear()
  return (
    <footer className={`relative z-10 border-t border-line ${compact ? 'px-8 py-6' : 'px-4 py-12 md:px-8'}`}>
      <div className={`mx-auto flex max-w-6xl flex-col gap-6 ${compact ? 'md:flex-row md:items-center md:justify-between' : 'md:flex-row md:items-start md:justify-between'}`}>
        <div className="max-w-sm">
          <Logo size={compact ? 'sm' : 'md'} />
          {!compact && (
            <p className="mt-3 text-sm text-muted">
              Plan race-prep sessions, simulate full HYROX-style races, track station splits and stay race-ready.
            </p>
          )}
        </div>
        {!compact && (
          <div className="grid grid-cols-2 gap-10 text-sm">
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Train</span>
              <Link className="text-muted hover:text-ink" to="/dashboard">Dashboard</Link>
              <Link className="text-muted hover:text-ink" to="/stations">Station Library</Link>
              <Link className="text-muted hover:text-ink" to="/race">Race Simulation</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Plan</span>
              <Link className="text-muted hover:text-ink" to="/calculator">Target Calculator</Link>
              <Link className="text-muted hover:text-ink" to="/classes">Classes</Link>
              <Link className="text-muted hover:text-ink" to="/progress">Progress</Link>
            </div>
          </div>
        )}
        <p className="text-xs text-muted">
          © {year} RoxForge. Built for HYROX-style racing. Not affiliated with or endorsed by HYROX.
        </p>
      </div>
    </footer>
  )
}
