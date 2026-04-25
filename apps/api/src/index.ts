import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createAuth } from '@frontline/auth'
import { createDb } from '@frontline/db'

type Bindings = {
  WEB_ORIGIN: string
  DATABASE_URL: string
  AUTH_SECRET: string
  AUTH_BASE_URL: string
  RESEND_API_KEY: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

function matchOrigin(pattern: string, origin: string): string | null {
  if (pattern.includes('*')) {
    const re = new RegExp(
      '^' + pattern.replace(/[.+*?^${}()|[\]\\]/g, '\\$&').replace('\\*', '.+') + '$'
    )
    return re.test(origin) ? origin : null
  }
  return origin === pattern ? origin : null
}

app.use('*', (c, next) => {
  return cors({
    origin: (origin) => matchOrigin(c.env.WEB_ORIGIN, origin),
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })(c, next)
})

app.all('/api/auth/*', (c) => {
  const auth = createAuth({
    db: createDb(c.env.DATABASE_URL),
    secret: c.env.AUTH_SECRET,
    baseURL: c.env.AUTH_BASE_URL,
    trustedOrigins: [c.env.WEB_ORIGIN],
    resendApiKey: c.env.RESEND_API_KEY,
    googleClientId: c.env.GOOGLE_CLIENT_ID,
    googleClientSecret: c.env.GOOGLE_CLIENT_SECRET,
  })
  return auth.handler(c.req.raw)
})

app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

export default app
