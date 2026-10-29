// Local stand-in for Vercel Functions. Serves every file in /api with the same
// file-based routes Vercel uses (api/auth/login.js → /api/auth/login,
// api/sets/[id].js → /api/sets/:id). Files/folders starting with "_" are helpers, not routes.
import express from 'express'
import { readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { pathToFileURL } from 'node:url'

if (existsSync('.env')) process.loadEnvFile('.env')

const API_DIR = join(process.cwd(), 'api')
const PORT = Number(process.env.API_PORT) || 3001

function collectRoutes(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((name) => {
    if (name.startsWith('_') || name.startsWith('.')) return []
    const full = join(dir, name)
    if (statSync(full).isDirectory()) return collectRoutes(full)
    if (!/\.(js|mjs)$/.test(name)) return []
    const route =
      '/api/' +
      relative(API_DIR, full)
        .split(sep)
        .join('/')
        .replace(/\.(js|mjs)$/, '')
        .replace(/(^|\/)index$/, '')
        .replace(/\[\.\.\.(\w+)\]/g, '*$1')
        .replace(/\[(\w+)\]/g, ':$1')
    return [{ route: route.replace(/\/$/, '') || '/api', file: full }]
  })
}

function parseCookies(header = '') {
  return Object.fromEntries(
    header.split(';').filter(Boolean).map((c) => {
      const i = c.indexOf('=')
      return [c.slice(0, i).trim(), decodeURIComponent(c.slice(i + 1).trim())]
    })
  )
}

const app = express()
app.use(express.json({ limit: '1mb' }))
app.use((req, _res, next) => {
  req.cookies = parseCookies(req.headers.cookie)
  next()
})

// Static routes before dynamic ones, like Vercel
const routes = collectRoutes(API_DIR).sort((a, b) => a.route.includes(':') - b.route.includes(':'))
for (const { route, file } of routes) {
  app.all(route, async (req, res) => {
    // Vercel exposes dynamic segments on req.query
    Object.assign(req.query, req.params)
    try {
      // Cache-bust on file change so edits to /api apply without restarting
      const mod = await import(`${pathToFileURL(file).href}?v=${statSync(file).mtimeMs}`)
      await mod.default(req, res)
    } catch (err) {
      console.error(`[api] ${req.method} ${req.path} failed:`, err)
      if (!res.headersSent) res.status(500).json({ error: 'Something went wrong on our side. Please try again.' })
    }
  })
}

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }))

app.listen(PORT, (err) => {
  if (err) {
    console.error(err.code === 'EADDRINUSE' ? `✖ Port ${PORT} is already in use. Is another copy of the app running?` : err)
    process.exit(1)
  }
  console.log(`API ready on http://localhost:${PORT} (${routes.length} route${routes.length === 1 ? '' : 's'})`)
  routes.forEach((r) => console.log('  ' + r.route))
})
