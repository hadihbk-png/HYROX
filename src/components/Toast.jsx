import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

const ToastCtx = createContext(() => {})
export const useToast = () => useContext(ToastCtx)

const styles = {
  success: { Icon: CheckCircle2, tone: 'text-emerald-400' },
  error: { Icon: AlertTriangle, tone: 'text-rose-400' },
  info: { Icon: Info, tone: 'text-accent-ink' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const push = useCallback(
    ({ title, desc, type = 'success', duration = 3200 }) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((t) => [...t.slice(-2), { id, title, desc, type }])
      setTimeout(() => dismiss(id), duration)
    },
    [dismiss]
  )

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-[100] flex flex-col items-center gap-2 px-4 md:inset-x-auto md:top-auto md:right-6 md:bottom-6 md:items-end">
        <AnimatePresence>
          {toasts.map((t) => {
            const { Icon, tone } = styles[t.type] ?? styles.info
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="glass pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl bg-bg-2/80 p-4"
                role="status"
              >
                <Icon className={`mt-0.5 size-5 shrink-0 ${tone}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{t.title}</div>
                  {t.desc && <div className="mt-0.5 text-xs text-muted">{t.desc}</div>}
                </div>
                <button onClick={() => dismiss(t.id)} className="text-muted hover:text-ink" aria-label="Dismiss">
                  <X className="size-4" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}
