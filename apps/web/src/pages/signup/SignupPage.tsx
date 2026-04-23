import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Logo } from '~/components/Logo/Logo'
import { ThemeCycle } from '~/components/ui/theme-cycle'
import { CtaButton } from '~/components/ui/cta-button'
import { InputField } from '~/components/ui/input-field'
import { GoogleButton } from '~/components/ui/google-button'
import { CornerBrackets } from '../landing/_components/CornerBrackets'

export function SignupPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  function handleEnlist(e: React.SubmitEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate({ to: '/play/local' })
    }, 900)
  }

  return (
    <div className="min-h-screen flex bg-fl-bg text-fl-fg2 font-barlow antialiased relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-35"
        style={{
          backgroundImage: 'radial-gradient(circle, #38382a 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-linear-to-b from-transparent via-fl-red to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-linear-to-b from-transparent via-fl-blue to-transparent" />

      <div className="absolute top-0 left-0 right-0 h-[60px] flex items-center justify-between px-12 z-20">
        <Logo to="/" />
        <ThemeCycle />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-24 relative z-10">
        <div className="relative bg-fl-surf border border-fl-border w-full max-w-[400px] px-10 py-11 shadow-[0_32px_80px_rgba(10,8,4,0.85)]">
          <CornerBrackets color="#c8922a" size={14} />

          <div className="text-center mb-9">
            <div className="flex justify-center mb-3.5">
              <Logo showLabel={false} size="lg" />
            </div>
            <div className="font-oswald font-bold text-[26px] uppercase text-fl-fg1 tracking-[-0.01em] mb-1.5">
              ENLIST NOW
            </div>
            <div className="text-[13px] text-fl-fg4">Create your account and join the front.</div>
          </div>

          <form onSubmit={handleEnlist} className="flex flex-col gap-4">
            <InputField
              label="CALLSIGN"
              placeholder="Your battlefield name"
              autoComplete="username"
            />
            <InputField
              label="EMAIL"
              type="email"
              placeholder="For account recovery"
              autoComplete="email"
            />
            <InputField
              label="PASSWORD"
              type="password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
            />
            <CtaButton type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? 'ENLISTING…' : 'REPORT FOR DUTY →'}
            </CtaButton>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-fl-border-s" />
            <span className="font-plex text-[9px] text-fl-fg4 uppercase tracking-widest">OR</span>
            <div className="flex-1 h-px bg-fl-border-s" />
          </div>

          <GoogleButton />

          <div className="mt-6 text-center text-sm text-fl-fg4">
            Already enlisted?
            <CtaButton variant="link" size="sm" to="/login" className="ml-2">
              Log in →
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
  )
}
