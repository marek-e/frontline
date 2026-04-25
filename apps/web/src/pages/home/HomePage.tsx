import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '~/lib/utils'
import { Logo } from '~/components/Logo/Logo'
import { ThemeCycle } from '~/components/ui/theme-cycle'
import { CtaButton } from '~/components/ui/cta-button'
import { Avatar } from '~/components/Avatar/Avatar'
import { GridBackground } from '~/components/ui/grid-background'
import { CornerBrackets } from '~/pages/landing/_components/CornerBrackets'
import { useAuth } from '~/hooks/useAuth'

function HomeNav({ displayName, avatarUrl }: { displayName: string; avatarUrl?: string | null }) {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const { signOut } = useAuth()

  useEffect(() => {
    const el = document.getElementById('home-scroll')
    if (!el) return
    const fn = () => setScrolled(el.scrollTop > 10)
    el.addEventListener('scroll', fn, { passive: true })
    return () => el.removeEventListener('scroll', fn)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 h-[60px] flex items-center justify-between px-12 transition-all duration-300',
        scrolled
          ? 'bg-fl-surf border-b border-fl-border shadow-[0_2px_20px_rgba(10,8,4,0.6)]'
          : 'bg-fl-bg border-b border-fl-border'
      )}
    >
      <Logo to="/" />

      <nav className="hidden md:flex gap-0.5 absolute left-1/2 -translate-x-1/2">
        {(['PLAY', 'RANKED', 'LEADERBOARD'] as const).map((label) => (
          <button
            key={label}
            className="bg-transparent border-none cursor-pointer px-4 py-2 font-barlow text-[13px] font-medium uppercase tracking-[0.08em] text-fl-fg4 hover:text-fl-fg1 transition-colors duration-150"
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <ThemeCycle />
        <div className="w-px h-4 bg-fl-border-s" />
        <button
          onClick={() => navigate({ to: '/profile' })}
          className="flex items-center gap-2.5 cursor-pointer bg-transparent border-none group"
        >
          <span className="font-plex text-[11px] text-fl-fg4 uppercase tracking-widest group-hover:text-fl-fg2 transition-colors duration-150 hidden sm:block">
            {displayName}
          </span>
          <Avatar username={displayName} avatarUrl={avatarUrl} size="sm" />
        </button>
        <button
          onClick={() => signOut()}
          className="font-plex text-[10px] text-fl-fg4 hover:text-fl-red uppercase tracking-widest cursor-pointer bg-transparent border-none transition-colors duration-150"
        >
          EXIT
        </button>
      </div>
    </header>
  )
}

function HeroStrip({ displayName }: { displayName: string }) {
  return (
    <section className="relative overflow-hidden bg-fl-bg py-16 border-b border-fl-border">
      <GridBackground dotOpacity={40} vignette />
      <div className="relative z-10 max-w-7xl mx-auto px-12 flex items-center justify-between gap-8">
        <div>
          <div className="font-plex text-[10px] text-fl-gold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <span className="inline-block w-4 h-px bg-fl-gold" />
            COMMAND CENTER · ACTIVE SESSION
            <span className="inline-block w-4 h-px bg-fl-gold" />
          </div>
          <h1 className="font-oswald font-bold text-[52px] leading-[0.95] uppercase tracking-[-0.02em] text-fl-fg1 mb-4">
            WELCOME BACK,
            <br />
            <span className="text-fl-red">{displayName}</span>
          </h1>
          <p className="font-barlow text-md text-fl-fg3 leading-relaxed max-w-[440px]">
            The front awaits your command. Choose your engagement and advance.
          </p>
        </div>

        <div className="hidden lg:flex flex-col items-end gap-3 shrink-0">
          <div className="font-plex text-[9px] text-fl-fg4 uppercase tracking-[0.18em] text-right mb-1">
            CURRENT STATUS
          </div>
          {[
            { label: 'SEASON', value: 'S4', color: 'text-fl-gold' },
            { label: 'RANK', value: 'UNRANKED', color: 'text-fl-fg3' },
            { label: 'THREAT LEVEL', value: 'LOW', color: 'text-green-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="font-plex text-[9px] text-fl-fg4 uppercase tracking-widest">
                {label}
              </span>
              <span className={cn('font-oswald font-bold text-[13px] uppercase', color)}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PlayCard({
  title,
  description,
  tag,
  disabled,
  to,
  ctaLabel,
}: {
  title: string
  description: string
  tag?: string
  disabled?: boolean
  to?: string
  ctaLabel: string
}) {
  return (
    <div
      className={cn(
        'relative border border-fl-border bg-fl-surf flex flex-col p-6 gap-5 transition-all duration-200',
        disabled ? 'opacity-50' : 'hover:border-fl-border-st hover:bg-fl-elev'
      )}
    >
      {!disabled && <CornerBrackets color="#c8922a" size={10} />}

      {tag && (
        <span className="absolute top-4 right-4 font-plex text-[9px] text-fl-fg4 uppercase tracking-widest border border-fl-border px-2 py-0.5 bg-fl-raised">
          {tag}
        </span>
      )}

      <div>
        <div className="font-oswald font-bold text-[20px] uppercase text-fl-fg1 tracking-[-0.01em] mb-1.5">
          {title}
        </div>
        <p className="font-barlow text-[13px] text-fl-fg3 leading-relaxed">{description}</p>
      </div>

      {disabled ? (
        <span className="font-oswald text-[13px] uppercase tracking-[0.08em] text-fl-fg4 mt-auto">
          STAND BY
        </span>
      ) : (
        <CtaButton to={to} size="sm" className="mt-auto self-start">
          {ctaLabel}
        </CtaButton>
      )}
    </div>
  )
}

function StatsPanel() {
  const stats = [
    { label: 'BATTLES', value: '0' },
    { label: 'VICTORIES', value: '0' },
    { label: 'RATING', value: '—' },
  ]

  return (
    <div className="border border-fl-border bg-fl-surf">
      <div className="px-5 py-3 border-b border-fl-border flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 bg-fl-gold" />
        <h2 className="font-oswald font-semibold text-[12px] uppercase text-fl-fg3 tracking-widest">
          FIELD RECORD
        </h2>
      </div>
      <div className="grid grid-cols-3 divide-x divide-fl-border">
        {stats.map(({ label, value }) => (
          <div key={label} className="px-5 py-5 text-center">
            <div className="font-oswald font-bold text-[28px] text-fl-fg1">{value}</div>
            <div className="font-plex text-[9px] text-fl-fg4 uppercase tracking-[0.14em] mt-1.5">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentMatches() {
  return (
    <div className="border border-fl-border bg-fl-surf">
      <div className="px-5 py-3 border-b border-fl-border flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 bg-fl-border-st" />
        <h2 className="font-oswald font-semibold text-[12px] uppercase text-fl-fg3 tracking-widest">
          RECENT ENGAGEMENTS
        </h2>
      </div>
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
        <div className="w-12 h-12 border border-fl-border-s flex items-center justify-center mb-2 rotate-45">
          <div className="-rotate-45 font-oswald text-[22px] text-fl-fg4 font-bold select-none">
            ✕
          </div>
        </div>
        <div className="font-oswald font-semibold text-md uppercase text-fl-fg3 tracking-[0.04em]">
          No Battles on Record
        </div>
        <p className="font-barlow text-[13px] text-fl-fg4 max-w-[280px] leading-relaxed">
          Deploy and write your history. Every campaign starts with a single advance.
        </p>
        <CtaButton variant="outline" size="sm" to="/play/local" className="mt-2">
          ENTER THE FIELD
        </CtaButton>
      </div>
    </div>
  )
}

export function HomePage() {
  const { session } = useAuth()
  const user = session?.user
  const username = (user as Record<string, unknown>)?.username as string | undefined
  const displayName = username ?? user?.name ?? 'Soldier'
  const avatarUrl = user?.image

  return (
    <div
      id="home-scroll"
      className="min-h-screen overflow-y-auto bg-fl-bg text-fl-fg2 font-barlow antialiased"
    >
      <HomeNav displayName={displayName} avatarUrl={avatarUrl} />
      <HeroStrip displayName={displayName} />

      <div className="max-w-7xl mx-auto px-12 py-12 flex flex-col gap-10">
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="font-plex text-[9px] text-fl-fg4 uppercase tracking-[0.18em]">
              QUICK DEPLOY
            </span>
            <div className="flex-1 h-px bg-fl-border-s" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PlayCard
              title="LOCAL MATCH"
              description="Two commanders, one board. Share the screen and settle it face-to-face."
              to="/play/local"
              ctaLabel="DEPLOY NOW"
            />
            <PlayCard
              title="VS AI"
              description="Test your tactics against an adaptive opponent. No mercy, no excuses."
              tag="COMING SOON"
              disabled
              ctaLabel="ENGAGE"
            />
            <PlayCard
              title="RANKED"
              description="Enter the competitive front. Climb the ranks. Prove your command."
              tag="COMING SOON"
              disabled
              ctaLabel="ENTER RANKED"
            />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="font-plex text-[9px] text-fl-fg4 uppercase tracking-[0.18em]">
              SOLDIER PROFILE
            </span>
            <div className="flex-1 h-px bg-fl-border-s" />
            <CtaButton variant="link" size="xs" to="/profile">
              View full profile →
            </CtaButton>
          </div>
          <StatsPanel />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="font-plex text-[9px] text-fl-fg4 uppercase tracking-[0.18em]">
              BATTLE LOG
            </span>
            <div className="flex-1 h-px bg-fl-border-s" />
          </div>
          <RecentMatches />
        </section>
      </div>
    </div>
  )
}
