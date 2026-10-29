// Tiny localStorage wrapper. Everything is optional: the app works without storage.
const KEY = 'rf-sims'

export function loadSims() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveSim(sim) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...loadSims(), sim]))
    return true
  } catch {
    return false
  }
}
