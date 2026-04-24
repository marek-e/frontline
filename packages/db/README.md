# @frontline/db

Drizzle ORM client and schema for the Frontline database (Neon Postgres).

## What it does

- Exports `createDb(connectionString)` — builds a Drizzle client over Neon's serverless HTTP driver
- Exports all table definitions from `src/schema/` so other packages can reference them for queries and joins
- Provides `Db` type for use in `@frontline/auth` and `apps/api`

## Structure

```
src/
├── index.ts            — createDb(), Db type, re-exports schema
└── schema/
    ├── index.ts        — barrel re-export
    └── auth.ts         — better-auth tables: user, session, account, verification
drizzle/
└── 0000_*.sql          — versioned migration files (committed to git)
```

## Schema

The `auth.ts` schema defines the four tables required by better-auth + the username plugin:

| Table          | Purpose                                                              |
| -------------- | -------------------------------------------------------------------- |
| `user`         | Core user record; includes `username`, `country`, `bio`, `avatarUrl` |
| `session`      | Active sessions with expiry and device info                          |
| `account`      | OAuth provider links (Google) and password credential                |
| `verification` | Email verification and password reset tokens                         |

## Usage

```ts
import { createDb } from '@frontline/db'

const db = createDb(process.env.DATABASE_URL)
```

## Migration workflow

Schema changes go through two steps: generate a migration file, then apply it.

```bash
# 1. After editing src/schema/ — generate a new migration file
pnpm db:generate

# 2. Apply all pending migrations to the database
DATABASE_URL="..." pnpm db:migrate

# Open Drizzle Studio (visual DB browser)
DATABASE_URL="..." pnpm db:studio
```

`db:generate` never touches the database — it diffs the TypeScript schema against existing migration files and outputs a new `.sql` file in `drizzle/`. Commit that file alongside your schema change.

`db:migrate` is run automatically by CI before each deploy (staging and production). You only need to run it manually for the first-time setup of a new environment.

`drizzle-kit` uses the `pg` driver for CLI operations. The runtime (`createDb`) uses `@neondatabase/serverless` (HTTP, compatible with Cloudflare Workers).

## Adding new tables or columns

1. Create or edit files in `src/schema/`
2. Re-export from `src/schema/index.ts` if adding a new file
3. Run `pnpm db:generate` — commit the generated `.sql` file with your PR
4. CI applies the migration automatically on deploy

Never edit generated `.sql` files manually and never delete them — they are the migration history.
