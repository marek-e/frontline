import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { Db } from '@frontline/db'

/**
 * Create a better-auth instance bound to a Drizzle DB connection.
 * Call this once in apps/api and pass the result to the auth Hono handler.
 *
 * Phase 2 will add: email/password, OAuth providers, email verification,
 * session management, and the user schema migration.
 */
export function createAuth(db: Db, secret: string) {
  return betterAuth({
    secret,
    database: drizzleAdapter(db, { provider: 'pg' }),
    emailAndPassword: {
      enabled: true,
    },
  })
}

export type Auth = ReturnType<typeof createAuth>
