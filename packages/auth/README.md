# @frontline/auth

Better-auth configuration for the Frontline API.

## What it does

- Email/password auth with mandatory email verification
- Google OAuth
- Username plugin (serves as the player's callsign)
- Transactional email via Resend (verification + password reset)
- Additional user fields: `country`, `bio`, `avatarUrl`

## Structure

```
src/
├── index.ts            — createAuth() factory + AuthConfig type
├── email.ts            — sendEmail() wrapper over the Resend REST API
└── email-templates.ts  — HTML templates for verification and password reset emails
```

## Usage

Called once per request in `apps/api` (Neon HTTP is stateless, no pool required):

```ts
import { createAuth } from '@frontline/auth'
import { createDb } from '@frontline/db'

const auth = createAuth({
  db: createDb(env.DATABASE_URL),
  secret: env.AUTH_SECRET,
  baseURL: env.AUTH_BASE_URL,
  resendApiKey: env.RESEND_API_KEY,
  googleClientId: env.GOOGLE_CLIENT_ID,
  googleClientSecret: env.GOOGLE_CLIENT_SECRET,
})

// Mount in Hono
app.on(['GET', 'POST'], '/api/auth/**', (c) => auth.handler(c.req.raw))
```

## Required env vars

| Variable               | Where to set                           |
| ---------------------- | -------------------------------------- |
| `AUTH_SECRET`          | `apps/api/.dev.vars` + Wrangler secret |
| `AUTH_BASE_URL`        | `apps/api/.dev.vars` + Wrangler var    |
| `RESEND_API_KEY`       | `apps/api/.dev.vars` + Wrangler secret |
| `GOOGLE_CLIENT_ID`     | `apps/api/.dev.vars` + Wrangler secret |
| `GOOGLE_CLIENT_SECRET` | `apps/api/.dev.vars` + Wrangler secret |

Generate a secret: `openssl rand -base64 32`

Google OAuth credentials: [console.cloud.google.com](https://console.cloud.google.com)
Authorized redirect URIs:

- `http://localhost:8787/api/auth/callback/google`
- `https://api.frontline.gg/api/auth/callback/google`
