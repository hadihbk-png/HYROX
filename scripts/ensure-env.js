// Makes sure .env exists with a JWT_SECRET. Reports (but never prints) DATABASE_URL status.
// Usage: node scripts/ensure-env.js [--require-db]
import { existsSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'

const ENV = '.env'
const requireDb = process.argv.includes('--require-db')

if (!existsSync(ENV)) writeFileSync(ENV, 'DATABASE_URL=\nJWT_SECRET=\n')

const text = readFileSync(ENV, 'utf8')
const get = (key) => text.match(new RegExp(`^${key}=(.*)$`, 'm'))?.[1]?.trim().replace(/^["']|["']$/g, '')

if (!get('JWT_SECRET')) {
  const secret = randomBytes(48).toString('base64url')
  const updated = /^JWT_SECRET=.*$/m.test(text)
    ? text.replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${secret}`)
    : `${text.endsWith('\n') || !text ? text : text + '\n'}JWT_SECRET=${secret}\n`
  writeFileSync(ENV, updated)
  console.log('✔ Generated a strong JWT_SECRET and saved it to .env')
}

if (!get('DATABASE_URL')) {
  const msg = `
  ✖ DATABASE_URL is missing from .env

  Where to get it:
    1. Go to https://console.neon.tech and sign in (the free plan is fine)
    2. Create a project, or open your existing one
    3. On the project Dashboard, click the "Connect" button
    4. Leave "Pooled connection" on, then copy the string that starts with postgresql://
    5. Paste it into .env in this folder:
         DATABASE_URL=postgresql://...your string...
`
  if (requireDb) {
    console.error(msg)
    process.exit(1)
  }
  console.warn(msg + '  The app will start, but database features will show a "can\'t reach the database" message.\n')
}
