import { useState } from 'react'
import { Logo } from '~/components/Logo/Logo'
import { ThemeCycle } from '~/components/ui/theme-cycle'
import { CtaButton } from '~/components/ui/cta-button'
import { CornerBrackets } from '../landing/_components/CornerBrackets'
import { GridBackground } from '~/components/ui/grid-background'
import { AuthError } from '../login/_components/AuthError'
import { sendVerificationEmail } from '~/lib/auth-client'
import { Route } from '~/routes/verify-email'

export function VerifyEmailPage() {
  const { email } = Route.useSearch()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleResend() {
    if (!email) return
    setError(null)
    setSending(true)

    const result = await sendVerificationEmail({
      email,
      callbackURL: '/play/local',
    })

    setSending(false)

    if (result.error) {
      setError(result.error.message ?? 'Failed to resend. Please try again.')
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
        <div className="relative bg-fl-surf border border-fl-border w-full max-w-[420px] px-10 py-11 shadow-[0_32px_80px_rgba(10,8,4,0.85)]">
          <CornerBrackets color="#c8922a" size={14} />

          <div className="text-center mb-8">
            <div className="flex justify-center mb-3.5">
              <Logo showLabel={false} size="lg" />
            </div>
            <div className="font-oswald font-bold text-[26px] uppercase text-fl-fg1 tracking-[-0.01em] mb-1.5">
              CHECK YOUR EMAIL
            </div>
            <p className="text-[13px] text-fl-fg4 leading-relaxed">
              {email ? (
                <>
                  We sent a verification link to{' '}
                  <span className="text-fl-fg2 font-medium">{email}</span>. Click it to activate
                  your account.
                </>
              ) : (
                'A verification link has been sent to your email address.'
              )}
            </p>
          </div>

          <div className="border border-fl-border-s bg-fl-raised px-4 py-3 mb-6">
            <p className="font-plex text-[11px] text-fl-fg3 leading-relaxed">
              The link expires in 24 hours. Check your spam folder if you don&apos;t see it.
            </p>
          </div>

          {error && <AuthError message={error} />}

          {email && (
            <div className="flex flex-col gap-3">
              {!sent ? (
                <CtaButton className="w-full" onClick={handleResend} disabled={sending}>
                  {sending ? 'SENDING…' : 'RESEND VERIFICATION EMAIL'}
                </CtaButton>
              ) : (
                <p className="font-plex text-[11px] text-fl-fg3 text-center">
                  Verification email resent. Check your inbox.
                </p>
              )}
            </div>
          )}

          <div className="mt-6 text-center text-sm text-fl-fg4">
            Wrong account?
            <CtaButton variant="link" size="sm" to="/signup" className="ml-2">
              Start over
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
  )
}
