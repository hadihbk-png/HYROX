import { withDb } from './_lib/db.js'

export default withDb(async (_req, res, sql) => {
  await sql`select 1`
  res.status(200).json({ ok: true, database: 'connected' })
})
