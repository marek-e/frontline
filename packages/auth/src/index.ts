import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { username } from 'better-auth/plugins'
import type { Db } from '@frontline/db'
import { sendEmail } from './email'
import { verificationEmail, resetPasswordEmail } from './email-templates'
import { hashPassword, verifyPassword } from './password'

export interface AuthConfig {
  db: Db
  secret: string
  baseURL: string
  webOrigin: string
  trustedOrigins: string[]
  resendApiKey: string
  googleClientId: string
  googleClientSecret: string
}

export function createAuth(config: AuthConfig) {
  const {
    db,
    secret,
    baseURL,
    webOrigin,
    trustedOrigins,
    resendApiKey,
    googleClientId,
    googleClientSecret,
  } = config

  return betterAuth({
    secret,
    baseURL,
    trustedOrigins,
    advanced: {
      defaultCookieAttributes: {
        sameSite: 'none',
        secure: true,
      },
    },

    database: drizzleAdapter(db, { provider: 'pg' }),

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      password: {
        // temporary fix for cloudflare workers CPU limit on free tier
        hash: hashPassword,
        verify: ({ hash, password }) => verifyPassword(hash, password),
      },
      async sendResetPassword({ user, url }) {
        await sendEmail({
          apiKey: resendApiKey,
          to: user.email,
          subject: 'Reset your Frontline password',
          html: resetPasswordEmail(url),
        })
      },
    },

    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      callbackURL: `${webOrigin}/home`,
      async sendVerificationEmail({ user, url }) {
        await sendEmail({
          apiKey: resendApiKey,
          to: user.email,
          subject: 'Verify your Frontline account',
          html: verificationEmail(url),
        })
      },
    },

    socialProviders: {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      },
    },

    plugins: [
      username({
        minUsernameLength: 3,
        maxUsernameLength: 20,
        usernameValidator: (value) => /^[a-zA-Z0-9_]+$/.test(value),
      }),
    ],

    user: {
      additionalFields: {
        country: { type: 'string', required: false, input: true },
        bio: { type: 'string', required: false, input: true },
        avatarUrl: { type: 'string', required: false, input: false },
      },
    },
  })
}

export type Auth = ReturnType<typeof createAuth>
