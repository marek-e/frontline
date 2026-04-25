import { createAuthClient } from 'better-auth/react'
import { usernameClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8787',
  plugins: [usernameClient()],
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  requestPasswordReset,
  resetPassword,
  sendVerificationEmail,
  changePassword,
} = authClient

// updateUser doesn't know about server-side additionalFields (country, bio)
// so we use $fetch directly to send arbitrary profile fields.
export async function updateProfile(data: { country?: string; bio?: string }) {
  return authClient.$fetch('/update-user', {
    method: 'POST',
    body: data as Record<string, string>,
  })
}
