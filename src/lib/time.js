import { raceStations } from '../data/mock'

const pad = (n) => String(n).padStart(2, '0')

/** Seconds → "1:23:45" or "4:05" */
export function fmt(sec, { forceHours = false } = {}) {
  if (sec == null || !isFinite(sec)) return '--:--'
  const s = Math.max(0, Math.round(sec))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  return h > 0 || forceHours ? `${h}:${pad(m)}:${pad(r)}` : `${m}:${pad(r)}`
}

/** Milliseconds → "1:23:45.6" style for live clocks */
export function fmtClock(ms, { tenths = true } = {}) {
  const total = Math.max(0, ms)
  const s = Math.floor(total / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  const t = Math.floor((total % 1000) / 100)
  const base = h > 0 ? `${h}:${pad(m)}:${pad(r)}` : `${pad(m)}:${pad(r)}`
  return tenths ? `${base}.${t}` : base
}

/** "1:20:00" | "80:00" | "80" → seconds. Returns null when invalid. */
export function parseTime(str) {
  if (!str) return null
  const parts = String(str).trim().split(':').map((p) => p.trim())
  if (parts.some((p) => p === '' || isNaN(Number(p)))) return null
  const nums = parts.map(Number)
  if (nums.length === 1) return nums[0] * 60
  if (nums.length === 2) return nums[0] * 60 + nums[1]
  if (nums.length === 3) return nums[0] * 3600 + nums[1] * 60 + nums[2]
  return null
}

export const sum = (arr) => arr.reduce((a, b) => a + b, 0)

// Typical time distribution of a well-paced athlete (relative weights)
const STATION_WEIGHTS = [285, 200, 265, 275, 290, 112, 290, 340]
const RUN_WEIGHTS = [0.95, 1.0, 1.02, 1.0, 1.01, 1.0, 1.01, 1.04]

/**
 * Splits a goal finish time into run pace, station splits and Roxzone budget.
 * Proportions: ~51% running, ~42% stations, ~7% Roxzone.
 */
export function targetSplits(goalSec) {
  const runTotal = goalSec * 0.51
  const stationTotal = goalSec * 0.42
  const roxzone = goalSec - runTotal - stationTotal
  const rw = sum(RUN_WEIGHTS)
  const sw = sum(STATION_WEIGHTS)
  return {
    runTotal,
    stationTotal,
    roxzone,
    avgPace: runTotal / 8,
    runs: RUN_WEIGHTS.map((w) => (runTotal * w) / rw),
    stations: raceStations.map((s, i) => ({
      ...s,
      split: (stationTotal * STATION_WEIGHTS[i]) / sw,
    })),
  }
}
