import { redirect } from '@tanstack/react-router'

export type AuthContext =
  | {
      data: { user: unknown } | null
    }
  | undefined

export function requireAuth(auth: AuthContext, redirectTo: string) {
  if (!auth?.data?.user) {
    throw redirect({ to: '/login', search: { redirect: redirectTo } })
  }
}
