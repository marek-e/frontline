import { useEffect, useState } from 'react'
import { cn } from '~/lib/utils'
import { Logo } from '~/components/Logo/Logo'
import { ThemeCycle } from '~/components/ui/theme-cycle'
import { CtaButton } from '~/components/ui/cta-button'

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const el = document.getElementById('fl-scroll')
    if (!el) return
    const fn = () => setScrolled(el.scrollTop > 20)
    el.addEventListener('scroll', fn, { passive: true })
    return () => el.removeEventListener('scroll', fn)
  }, [])

  return (
    <header
      className={cn(
        'px-12 flex items-center justify-between h-[60px] sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-fl-surf border-b border-fl-border shadow-[0_2px_20px_rgba(10,8,4,0.6)]'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="flex items-center gap-8">
        <Logo className="px-2 py-1.5" />
        <nav className="flex gap-0.5">
          {['PLAY', 'RANKED', 'LEADERBOARD', 'LEARN'].map((l) => (
            <button
              key={l}
              className="bg-transparent border-none cursor-pointer px-3.5 py-2 font-barlow text-[13px] font-medium uppercase tracking-[0.06em] text-fl-fg4 hover:text-fl-fg1 transition-colors duration-150"
            >
              {l}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex gap-2.5 items-center">
        <ThemeCycle />
        <div className="w-px h-4 bg-fl-border-s mr-2" />
        <CtaButton variant="outline" size="sm" to="/login">
          LOG IN
        </CtaButton>
        <CtaButton size="sm" to="/signup">
          ENLIST NOW
        </CtaButton>
      </div>
    </header>
  )
}
