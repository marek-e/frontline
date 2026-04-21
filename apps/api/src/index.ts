import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  // Phase 3+: DATABASE_URL, AUTH_SECRET, etc.
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors())

app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

export default app
