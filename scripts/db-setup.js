// Runs db/schema.sql then db/seed.sql. Both files must be idempotent (safe to re-run).
import { readFileSync, existsSync } from 'node:fs'
import { Pool } from '@neondatabase/serverless'

if (existsSync('.env')) process.loadEnvFile('.env')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

try {
  for (const file of ['db/schema.sql', 'db/seed.sql']) {
    if (!existsSync(file)) {
      console.error(`✖ ${file} not found`)
      process.exit(1)
    }
    await pool.query(readFileSync(file, 'utf8'))
    console.log(`✔ Ran ${file}`)
  }
  const { rows } = await pool.query(
    `select table_name,
            (xpath('/row/c/text()', query_to_xml('select count(*) as c from ' || quote_ident(table_name), false, true, '')))[1]::text::int as rows
       from information_schema.tables
      where table_schema = 'public' and table_type = 'BASE TABLE'
      order by table_name`
  )
  console.table(rows)
} catch (err) {
  console.error('✖ Database setup failed:', err.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
