import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Logo } from '~/components/Logo/Logo'
import { ThemeCycle } from '~/components/ui/theme-cycle'
import { CtaButton } from '~/components/ui/cta-button'
import { InputField } from '~/components/ui/input-field'
import { GoogleButton } from '~/components/ui/google-button'
import { CornerBrackets } from '../landing/_components/CornerBrackets'
import { GridBackground } from '~/components/ui/grid-background'
import { AuthError } from './_components/AuthError'
import { signIn } from '~/lib/auth-client'

export function LoginPage() {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.SubmitEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const isEmail = identifier.includes('@')
    const result = isEmail
      ? await signIn.email({ email: identifier, password })
      : await signIn.username({ username: identifier, password })

    setLoading(false)

    if (result.error) {
      setError(result.error.message ?? 'Login failed. Check your credentials.')
      return
    }

    navigate({ to: '/home' })
  }

  async function handleGoogleSignIn() {
    await signIn.social({ provider: 'google', callbackURL: '/' })
  }

  return (
    <div className="min-h-screen flex bg-fl-bg text-fl-fg2 font-barlow antialiased relative overflow-hidden">
      <GridBackground />

      <div className="absolute top-0 left-0 right-0 h-[60px] z-20 bg-fl-bg">
        <div className="max-w-7xl px-12 mx-auto flex items-center justify-between h-full">
          <Logo to="/" />
          <ThemeCycle />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-24 relative z-10">
        <div className="relative bg-fl-surf border border-fl-border w-full max-w-[400px] px-10 py-11 shadow-[0_32px_80px_rgba(10,8,4,0.85)]">
          <CornerBrackets color="#c8922a" size={14} />

          <div className="text-center mb-9">
            <div className="flex justify-center mb-3.5">
              <Logo showLabel={false} size="lg" />
            </div>
            <div className="font-oswald font-bold text-[26px] uppercase text-fl-fg1 tracking-[-0.01em] mb-1.5">
              RETURN TO FRONT
            </div>
            <div className="text-[13px] text-fl-fg4">Log in to continue your campaign.</div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <InputField
              label="CALLSIGN OR EMAIL"
              placeholder="Enter callsign or email…"
              autoComplete="username email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <InputField
              label="PASSWORD"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-end -mt-1">
              <CtaButton
                variant="link"
                size="sm"
                to="/forgot-password"
                className="font-plex text-[10px] text-fl-fg4 hover:text-fl-gold uppercase tracking-widest"
              >
                Forgot password?
              </CtaButton>
            </div>

            {error && <AuthError message={error} />}

            <CtaButton type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? 'AUTHENTICATING…' : 'LOG IN — ADVANCE'}
            </CtaButton>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-fl-border-s" />
            <span className="font-plex text-[9px] text-fl-fg4 uppercase tracking-widest">OR</span>
            <div className="flex-1 h-px bg-fl-border-s" />
          </div>

          <GoogleButton onClick={handleGoogleSignIn} />

          <div className="mt-6 text-center text-sm text-fl-fg4">
            No account?
            <CtaButton variant="link" size="sm" to="/signup" className="ml-2">
              Enlist now →
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
  )
}
