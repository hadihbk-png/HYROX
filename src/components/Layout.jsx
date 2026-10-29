import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard, Library, Timer, TrendingUp, Calendar, User, Calculator, Flame,
} from 'lucide-react'
import Logo from './Logo'
import { ThemeToggle } from './Theme'
import Footer from './Footer'
import { user } from '../data/mock'

export const navItems = [
  { to: '/dashboard', label: 'Dashboard', short: 'Home', icon: LayoutDashboard },
  { to: '/stations', label: 'Station Library', short: 'Stations', icon: Library },
  { to: '/race', label: 'Race Simulation', short: 'Race', icon: Timer, featured: true },
  { to: '/progress', label: 'Progress & Splits', short: 'Splits', icon: TrendingUp },
  { to: '/classes', label: 'Class Booking', short: 'Classes', icon: Calendar },
  { to: '/calculator', label: 'Target Calculator', short: 'Calc', icon: Calculator },
  { to: '/profile', label: 'Profile', short: 'Me', icon: User },
]

const mobileNav = ['/dashboard', '/stations', '/race', '/progress', '/profile'].map((p) => navItems.find((n) => n.to === p))

function Sidebar() {
  return (
    <aside className="glass fixed inset-y-3 left-3 z-40 hidden w-64 flex-col rounded-3xl p-5 lg:flex">
      <Logo to="/" />
      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label, icon: I }) => (
          <NavLink key={to} to={to} className="relative">
            {({ isActive }) => (
              <div
                className={`relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="side-active"
                    className="absolute inset-0 rounded-2xl border border-[rgba(255,170,0,0.3)] bg-[rgba(255,150,0,0.1)]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <I className={`relative size-[18px] ${isActive ? 'text-accent-ink' : ''}`} />
                <span className="relative">{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="glass flex items-center gap-3 rounded-2xl p-3">
        <div className="grid size-10 place-items-center rounded-xl bg-forge font-display font-bold text-[#140a00]">{user.initials}</div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{user.name}</div>
          <div className="flex items-center gap-1 text-xs whitespace-nowrap text-muted">
            <Flame className="size-3 text-molten" /> {user.streak}-day streak
          </div>
        </div>
        <ThemeToggle />
      </div>
    </aside>
  )
}

function MobileTopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-bg/70 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 backdrop-blur-xl lg:hidden">
      <Logo to="/" size="sm" />
      <div className="flex items-center gap-2">
        <Link to="/classes" aria-label="Class booking" className="glass grid size-10 place-items-center rounded-xl text-muted hover:text-ink">
          <Calendar className="size-[18px]" />
        </Link>
        <Link to="/calculator" aria-label="Target calculator" className="glass grid size-10 place-items-center rounded-xl text-muted hover:text-ink">
          <Calculator className="size-[18px]" />
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}

function BottomNav() {
  return (
    <nav className="fixed inset-x-3 bottom-[max(env(safe-area-inset-bottom),12px)] z-40 lg:hidden">
      <div className="glass flex items-center justify-around rounded-3xl bg-bg-2/70 px-2 py-2">
        {mobileNav.map(({ to, short, icon: I, featured }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={featured ? short : undefined}
            className={featured ? '-my-7 flex flex-1 justify-center' : 'flex-1'}
          >
            {({ isActive }) =>
              featured ? (
                <div className="grid size-14 place-items-center rounded-2xl bg-forge text-[#140a00] glow-accent">
                  <I className="size-6" />
                </div>
              ) : (
                <div className={`relative flex flex-col items-center gap-1 py-1.5 text-[11px] font-medium ${isActive ? 'text-accent-ink' : 'text-muted'}`}>
                  <I className="size-5" />
                  {short}
                  {isActive && <motion.span layoutId="bottom-dot" className="absolute -bottom-1 size-1 rounded-full bg-volt" />}
                </div>
              )
            }
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default function Layout() {
  const location = useLocation()
  return (
    <div className="relative min-h-screen">
      <div className="ambient" />
      <div className="grid-bg pointer-events-none fixed inset-0 z-0" />
      <Sidebar />
      <MobileTopBar />
      <div className="relative z-10 lg:pl-[17.5rem]">
        <main className="mx-auto max-w-6xl px-4 pt-2 pb-32 md:px-8 lg:pt-8 lg:pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <div className="hidden lg:block">
          <Footer compact />
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
