import { createContext, use } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useSession, signOut as authSignOut } from '~/lib/auth-client'

type Session = ReturnType<typeof useSession>['data']

type AuthContextValue = {
  session: Session
  isPending: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()

  async function signOut() {
    await authSignOut()
    navigate({ to: '/' })
  }

  return <AuthContext value={{ session, isPending, signOut }}>{children}</AuthContext>
}

export function useAuth(): AuthContextValue {
  const ctx = use(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
