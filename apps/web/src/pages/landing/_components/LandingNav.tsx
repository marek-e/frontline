import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '~/lib/utils'
import { Logo } from '~/components/Logo/Logo'

export function LandingNav() {
  const navigate = useNavigate({ from: '/' })
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
        <Logo />
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
        <button
          onClick={() => navigate({ to: '/play/local' })}
          className="px-5 py-[7px] font-oswald text-[13px] font-semibold uppercase tracking-[0.08em] leading-none text-fl-fg3 border border-fl-border bg-transparent hover:bg-fl-raised hover:text-fl-fg1 hover:border-fl-border-st transition-all duration-200 cursor-pointer"
        >
          LOG IN
        </button>
        <button
          onClick={() => navigate({ to: '/play/local' })}
          className="px-5 py-[9px] font-oswald text-[13px] font-semibold uppercase tracking-[0.08em] leading-none text-white border border-fl-red-border bg-fl-red hover:bg-fl-red-h transition-all duration-200 cursor-pointer shadow-[0_2px_12px_rgba(200,55,45,0.25)] hover:shadow-[0_2px_12px_rgba(200,55,45,0.5)]"
        >
          ENLIST NOW
        </button>
      </div>
    </header>
  )
}
