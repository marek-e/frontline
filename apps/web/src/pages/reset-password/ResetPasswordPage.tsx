import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Logo } from '~/components/Logo/Logo'
import { ThemeCycle } from '~/components/ui/theme-cycle'
import { CtaButton } from '~/components/ui/cta-button'
import { InputField } from '~/components/ui/input-field'
import { CornerBrackets } from '../landing/_components/CornerBrackets'
import { GridBackground } from '~/components/ui/grid-background'
import { AuthError } from '../login/_components/AuthError'
import { resetPassword } from '~/lib/auth-client'
import { Route } from '~/routes/reset-password'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const { token } = Route.useSearch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const form = e.currentTarget
    const newPassword = (form.elements.namedItem('password') as HTMLInputElement).value
    const confirm = (form.elements.namedItem('confirm') as HTMLInputElement).value

    if (newPassword !== confirm) {
      setError('Passwords do not match.')
      return
    }

    if (!token) {
      setError('Invalid or expired reset link. Please request a new one.')
      return
    }

    setLoading(true)
    const result = await resetPassword({ newPassword, token })
    setLoading(false)

    if (result.error) {
      setError(result.error.message ?? 'Reset failed. The link may have expired.')
      return
    }

    navigate({ to: '/login' })
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
              NEW PASSWORD
            </div>
            <div className="text-[13px] text-fl-fg4">Choose a new password for your account.</div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputField
              label="NEW PASSWORD"
              name="password"
              type="password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
            />
            <InputField
              label="CONFIRM PASSWORD"
              name="confirm"
              type="password"
              placeholder="Repeat new password"
              autoComplete="new-password"
            />

            {error && <AuthError message={error} />}

            <CtaButton type="submit" className="w-full mt-2" disabled={loading || !token}>
              {loading ? 'UPDATING…' : 'SET NEW PASSWORD'}
            </CtaButton>
          </form>

          {!token && (
            <div className="mt-4 text-center">
              <CtaButton variant="link" size="sm" to="/forgot-password">
                Request a new reset link
              </CtaButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
