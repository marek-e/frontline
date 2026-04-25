import { useState } from 'react'
import { Logo } from '~/components/Logo/Logo'
import { ThemeCycle } from '~/components/ui/theme-cycle'
import { CtaButton } from '~/components/ui/cta-button'
import { InputField } from '~/components/ui/input-field'
import { CornerBrackets } from '../landing/_components/CornerBrackets'
import { GridBackground } from '~/components/ui/grid-background'
import { AuthError } from '../login/_components/AuthError'
import { requestPasswordReset } from '~/lib/auth-client'

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value

    const result = await requestPasswordReset({
      email,
      redirectTo: '/reset-password',
    })

    setLoading(false)

    if (result.error) {
      setError(result.error.message ?? 'Something went wrong. Please try again.')
      return
    }

    setSent(true)
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
              RESET PASSWORD
            </div>
            <div className="text-[13px] text-fl-fg4">
              {sent
                ? 'Check your inbox for a reset link.'
                : 'Enter your email and we will send you a reset link.'}
            </div>
          </div>

          {!sent && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <InputField
                label="EMAIL"
                name="email"
                type="email"
                placeholder="Your account email"
                autoComplete="email"
              />

              {error && <AuthError message={error} />}

              <CtaButton type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? 'SENDING…' : 'SEND RESET LINK'}
              </CtaButton>
            </form>
          )}

          {sent && (
            <div className="text-center">
              <p className="font-plex text-[11px] text-fl-fg3 mb-6">
                Didn&apos;t receive it? Check your spam folder or try again.
              </p>
              <CtaButton variant="link" size="sm" onClick={() => setSent(false)}>
                Try again
              </CtaButton>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-fl-fg4">
            Remembered it?
            <CtaButton variant="link" size="sm" to="/login" className="ml-2">
              Back to login
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
  )
}
