// Server-only database helper. Never import this from /src.
import { neon } from '@neondatabase/serverless'

let sql

export function getSql() {
  if (!process.env.DATABASE_URL) {
    const err = new Error('DATABASE_URL is not set')
    err.code = 'NO_DATABASE_URL'
    throw err
  }
  sql ??= neon(process.env.DATABASE_URL)
  return sql
}

// Wraps a handler so database outages become a friendly 503 instead of a crash
export function withDb(handler) {
  return async (req, res) => {
    try {
      return await handler(req, res, getSql())
    } catch (err) {
      const unreachable =
        err.code === 'NO_DATABASE_URL' ||
        /fetch failed|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|password authentication/i.test(err.message ?? '')
      if (unreachable) {
        console.error('[db]', err.message)
        return res.status(503).json({ error: 'We can’t reach the database right now. Please try again in a moment.', code: 'DB_UNAVAILABLE' })
      }
      throw err
    }
  }
}
