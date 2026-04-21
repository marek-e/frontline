import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema/index'

export * from './schema/index'
export { schema }

/**
 * Create a Drizzle client from a Neon connection string.
 * Pass the DATABASE_URL env var from the Cloudflare Worker binding or Node env.
 */
export function createDb(connectionString: string) {
  const sql = neon(connectionString)
  return drizzle(sql, { schema })
}

export type Db = ReturnType<typeof createDb>
