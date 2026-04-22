import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '~/lib/utils'

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo({ onClick, size = 'md' }: { onClick?: () => void; size?: 'sm' | 'md' | 'lg' }) {
  const textSize = size === 'sm' ? 'text-[16px]' : size === 'lg' ? 'text-[28px]' : 'text-[20px]'
  const iconSize = size === 'sm' ? 22 : size === 'lg' ? 40 : 28
  return (
    <div
      onClick={onClick}
      className={cn('flex items-center gap-[10px] select-none', onClick && 'cursor-pointer')}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="2" y="14" width="18" height="20" fill="#c8372d" />
        <polygon points="20,14 30,24 20,34" fill="#c8372d" />
        <rect x="28" y="14" width="18" height="20" fill="#2d6fa8" />
        <polygon points="28,14 18,24 28,34" fill="#2d6fa8" />
        <line x1="23" y1="6" x2="25" y2="42" stroke="#c8922a" strokeWidth="2.5" />
      </svg>
      <span
        className={cn('font-oswald font-bold uppercase tracking-[-0.01em] text-fl-fg1', textSize)}
      >
        FRONTLINE
      </span>
    </div>
  )
}

// ─── Corner Brackets ──────────────────────────────────────────────────────────

function CornerBrackets({ color = '#c8922a', size = 14 }: { color?: string; size?: number }) {
  const base: React.CSSProperties = { position: 'absolute', width: size, height: size }
  return (
    <>
      <div
        style={{
          ...base,
          top: -1,
          left: -1,
          borderTop: `2px solid ${color}`,
          borderLeft: `2px solid ${color}`,
        }}
      />
      <div
        style={{
          ...base,
          top: -1,
          right: -1,
          borderTop: `2px solid ${color}`,
          borderRight: `2px solid ${color}`,
        }}
      />
      <div
        style={{
          ...base,
          bottom: -1,
          left: -1,
          borderBottom: `2px solid ${color}`,
          borderLeft: `2px solid ${color}`,
        }}
      />
      <div
        style={{
          ...base,
          bottom: -1,
          right: -1,
          borderBottom: `2px solid ${color}`,
          borderRight: `2px solid ${color}`,
        }}
      />
    </>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function LandingNav({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
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

// ─── Mini Board ───────────────────────────────────────────────────────────────

const MINI_UNITS: Record<string, { f: 'red' | 'blue'; t: string }> = {
  '1,1': { f: 'red', t: 'T' },
  '0,4': { f: 'red', t: 'I' },
  '2,3': { f: 'red', t: 'A' },
  '6,6': { f: 'blue', t: 'T' },
  '7,3': { f: 'blue', t: 'I' },
  '5,5': { f: 'blue', t: 'A' },
  '3,2': { f: 'red', t: 'I' },
  '4,5': { f: 'blue', t: 'I' },
}

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

function MiniBoard() {
  const [sel, setSel] = useState<string | null>(null)

  return (
    <div className="flex flex-col items-center">
      <div className="font-plex text-[10px] text-fl-gold uppercase tracking-[0.14em] mb-2.5">
        ◆ LIVE MATCH · RND 07
      </div>
      <div className="relative bg-fl-surf border border-fl-border p-3 shadow-[0_16px_48px_rgba(10,8,4,0.7)]">
        <CornerBrackets />
        {/* Column labels */}
        <div
          className="grid mb-0.5"
          style={{ gridTemplateColumns: '16px repeat(8, 46px)', gap: 2 }}
        >
          <div />
          {COLS.map((c) => (
            <div key={c} className="text-center font-plex text-[8px] text-fl-fg4 leading-4">
              {c}
            </div>
          ))}
        </div>
        {/* Board rows */}
        {Array.from({ length: 8 }, (_, r) => (
          <div
            key={r}
            className="grid"
            style={{
              gridTemplateColumns: '16px repeat(8, 46px)',
              gap: 2,
              marginBottom: r < 7 ? 2 : 0,
            }}
          >
            <div className="flex items-center justify-center font-plex text-[8px] text-fl-fg4">
              {r + 1}
            </div>
            {Array.from({ length: 8 }, (_, c) => {
              const key = `${r},${c}`
              const unit = MINI_UNITS[key]
              const isSel = sel === key
              const isEven = (r + c) % 2 === 0
              return (
                <div
                  key={key}
                  onClick={() => unit && setSel(isSel ? null : key)}
                  className={cn(
                    'w-[46px] h-[46px] border flex items-center justify-center transition-all duration-120',
                    isSel
                      ? 'bg-fl-gold/15 border-fl-gold'
                      : isEven
                        ? 'bg-fl-elev border-fl-border-s'
                        : 'bg-fl-raised border-fl-border-s',
                    unit ? 'cursor-pointer' : 'cursor-default'
                  )}
                >
                  {unit && (
                    <div
                      className={cn(
                        'w-8 h-8 border flex items-center justify-center font-oswald text-[13px] font-bold transition-shadow duration-150',
                        unit.f === 'red'
                          ? 'bg-fl-red-bg2 border-fl-red text-fl-red'
                          : 'bg-fl-blue-bg2 border-fl-blue text-fl-blue-h',
                        isSel
                          ? unit.f === 'red'
                            ? 'shadow-[0_0_12px_rgba(200,55,45,0.53)]'
                            : 'shadow-[0_0_12px_rgba(45,111,168,0.53)]'
                          : unit.f === 'red'
                            ? 'shadow-[0_0_6px_rgba(200,55,45,0.27)]'
                            : 'shadow-[0_0_6px_rgba(45,111,168,0.27)]'
                      )}
                    >
                      {unit.t}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      {/* Faction badges */}
      <div className="flex gap-3 mt-3">
        <span className="font-plex text-[10px] font-medium uppercase tracking-widest py-[3px] px-2.5 border border-fl-red-border bg-fl-red-bg2 text-fl-red-h">
          ▲ VANGUARD
        </span>
        <span className="font-plex text-[10px] font-medium uppercase tracking-widest py-[3px] px-2.5 border border-fl-blue-border bg-fl-blue-bg2 text-fl-blue-h">
          ▼ BULWARK
        </span>
      </div>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-60px)] flex items-center bg-fl-bg">
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: 'radial-gradient(circle, #38382a 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 70% at 30% 50%, transparent, #12120d 80%)',
        }}
      />
      {/* Red left edge bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-linear-to-b from-transparent via-fl-red to-transparent" />
      {/* Blue right edge bar */}
      <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-linear-to-b from-transparent via-fl-blue to-transparent" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-12 py-20 w-full grid grid-cols-2 gap-20 items-center">
        {/* Left: copy */}
        <div>
          <div className="font-plex text-[11px] text-fl-gold uppercase tracking-[0.18em] mb-5 flex items-center gap-2.5">
            <span className="inline-block w-5 h-px bg-fl-gold" />
            SEASON 4 · RANKED OPEN
            <span className="inline-block w-5 h-px bg-fl-gold" />
          </div>

          <h1 className="font-oswald font-bold text-[84px] leading-[0.95] uppercase tracking-[-0.02em] text-fl-fg1 mb-7">
            DEPLOY.
            <br />
            <span className="text-fl-red">ADVANCE.</span>
            <br />
            CONQUER.
          </h1>

          <p className="font-barlow text-[18px] text-fl-fg3 leading-[1.65] mb-9 max-w-[460px]">
            Two factions. One grid. No mercy. Frontline is tactical strategy at its sharpest — every
            move deliberate, every victory earned.
          </p>

          <div className="flex gap-3 items-center mb-10">
            <button
              onClick={() => navigate({ to: '/play/local' })}
              className="inline-flex items-center justify-center px-8 py-[13px] font-oswald text-md font-semibold uppercase tracking-[0.08em] leading-none text-white border border-fl-red-border bg-fl-red hover:bg-fl-red-h transition-all duration-200 cursor-pointer shadow-[0_2px_12px_rgba(200,55,45,0.25)] hover:shadow-[0_2px_12px_rgba(200,55,45,0.5)]"
            >
              ENLIST NOW
            </button>
            <button className="inline-flex items-center justify-center px-8 py-[13px] font-oswald text-md font-semibold uppercase tracking-[0.08em] leading-none text-fl-fg3 border border-fl-border bg-transparent hover:bg-fl-raised hover:text-fl-fg1 hover:border-fl-border-st transition-all duration-200 cursor-pointer">
              WATCH LIVE
            </button>
          </div>

          <div className="flex gap-8 pt-8 border-t border-fl-border-s">
            {(
              [
                ['142K', 'ACTIVE PLAYERS'],
                ['1.2M', 'MATCHES PLAYED'],
                ['S4', 'CURRENT SEASON'],
              ] as const
            ).map(([v, l]) => (
              <div key={l}>
                <div className="font-plex text-2xl font-semibold text-fl-fg1">{v}</div>
                <div className="font-plex text-[9px] text-fl-fg4 uppercase tracking-[0.12em] mt-1">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: interactive mini board */}
        <MiniBoard />
      </div>
    </section>
  )
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

const STATS = [
  { v: '142,819', l: 'PLAYERS ONLINE' },
  { v: '2,841', l: 'IN QUEUE' },
  { v: '8.3', l: 'AVG TURNS' },
  { v: '99.9%', l: 'UPTIME' },
]

function StatsBar() {
  return (
    <div className="bg-fl-elev border-y border-fl-border-s px-12 py-6">
      <div className="max-w-[1280px] mx-auto flex justify-between items-center">
        {STATS.map(({ v, l }, i) => (
          <div
            key={l}
            className={cn(
              'text-center flex-1',
              i < STATS.length - 1 && 'border-r border-fl-border-s'
            )}
          >
            <div className="font-plex text-[26px] font-semibold text-fl-fg1">{v}</div>
            <div className="font-plex text-[9px] text-fl-fg4 uppercase tracking-[0.14em] mt-1">
              {l}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────

const FEATURE_ITEMS = [
  {
    icon: '◆',
    colorClass: 'text-fl-gold',
    title: 'TACTICAL GRID',
    desc: '8×8 battlefield. Three unit classes — Infantry, Tank, Artillery. Terrain matters. Every square is contested.',
  },
  {
    icon: '▲',
    colorClass: 'text-fl-red',
    title: 'TWO FACTIONS',
    desc: 'The Vanguard charges. The Bulwark holds. Choose your doctrine and fight for your side across ranked seasons.',
  },
  {
    icon: '★',
    colorClass: 'text-fl-gold',
    title: 'RANKED SEASONS',
    desc: 'Climb from Recruit to General. Seasonal resets keep the ladder fresh. Your ELO follows you.',
  },
  {
    icon: '▸',
    colorClass: 'text-fl-blue-h',
    title: 'LIVE SPECTATING',
    desc: 'Watch top commanders in real time. Study openings. Dissect endgames. Grow your tactical mind.',
  },
]

function FeatureCard({ icon, colorClass, title, desc }: (typeof FEATURE_ITEMS)[0]) {
  return (
    <div className="group px-7 py-8 bg-fl-surf border border-fl-border-s hover:bg-fl-raised hover:border-fl-border transition-all duration-200 cursor-default">
      <div
        className={cn(
          'font-oswald text-[32px] mb-4 transition-transform duration-200 group-hover:scale-110 inline-block',
          colorClass
        )}
      >
        {icon}
      </div>
      <div className="font-oswald text-md font-semibold uppercase tracking-[0.06em] text-fl-fg1 mb-3">
        {title}
      </div>
      <div className="font-barlow text-[14px] text-fl-fg3 leading-[1.65]">{desc}</div>
    </div>
  )
}

function Features() {
  return (
    <section className="px-12 py-24 max-w-[1280px] mx-auto">
      <div className="font-plex text-[11px] text-fl-gold uppercase tracking-[0.18em] mb-3">
        FIELD MANUAL
      </div>
      <h2 className="font-oswald font-bold text-[48px] uppercase text-fl-fg1 mb-14">
        HOW FRONTLINE WORKS
      </h2>
      <div className="grid grid-cols-4 gap-0.5">
        {FEATURE_ITEMS.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  )
}

// ─── Faction Pick ─────────────────────────────────────────────────────────────

const FACTION_DATA = [
  {
    id: 'red' as const,
    name: 'THE VANGUARD',
    sub: 'Red Faction · Offense',
    tagline: 'Strike first. Strike hard.',
    traits: [
      'High aggression units',
      'Forward momentum bonus',
      'Artillery devastation',
      'Sacrifice for gain',
    ],
    icon: '▲',
    btnLabel: 'ENLIST AS VANGUARD →',
  },
  {
    id: 'blue' as const,
    name: 'THE BULWARK',
    sub: 'Blue Faction · Defense',
    tagline: 'Hold the line. Never yield.',
    traits: [
      'Fortified positions',
      'Counter-attack bonus',
      'Shield formation',
      'Endurance doctrine',
    ],
    icon: '▼',
    btnLabel: 'ENLIST AS BULWARK →',
  },
]

function FactionCard({
  faction,
  chosen,
  onChoose,
  navigate,
}: {
  faction: (typeof FACTION_DATA)[0]
  chosen: 'red' | 'blue' | null
  onChoose: (id: 'red' | 'blue') => void
  navigate: ReturnType<typeof useNavigate>
}) {
  const isRed = faction.id === 'red'
  const active = chosen === faction.id

  return (
    <div
      onClick={() => onChoose(faction.id)}
      className={cn(
        'relative px-10 py-11 border cursor-pointer transition-all duration-240',
        active
          ? isRed
            ? 'bg-fl-red-bg border-fl-red shadow-[0_0_32px_rgba(200,55,45,0.2)]'
            : 'bg-fl-blue-bg border-fl-blue shadow-[0_0_32px_rgba(45,111,168,0.2)]'
          : isRed
            ? 'bg-transparent border-fl-red-border hover:bg-fl-red-bg hover:border-fl-red hover:shadow-[0_0_16px_rgba(200,55,45,0.09)]'
            : 'bg-transparent border-fl-blue-border hover:bg-fl-blue-bg hover:border-fl-blue hover:shadow-[0_0_16px_rgba(45,111,168,0.09)]'
      )}
    >
      {active && <CornerBrackets />}

      {/* Icon */}
      <div
        className={cn(
          'font-oswald text-[56px] mb-2 transition-colors duration-200',
          active ? (isRed ? 'text-fl-red' : 'text-fl-blue-h') : 'text-fl-border-st'
        )}
      >
        {faction.icon}
      </div>

      {/* Name */}
      <div
        className={cn(
          'font-oswald text-[36px] font-bold uppercase transition-colors duration-200 mb-1.5',
          active ? (isRed ? 'text-fl-red' : 'text-fl-blue-h') : 'text-fl-fg3'
        )}
      >
        {faction.name}
      </div>

      {/* Sub-label */}
      <div className="font-plex text-[10px] text-fl-fg4 uppercase tracking-[0.12em] mb-5">
        {faction.sub}
      </div>

      {/* Tagline */}
      <div
        className={cn(
          'font-barlow text-[18px] italic leading-[1.4] mb-7 transition-colors duration-200',
          active ? 'text-fl-fg2' : 'text-fl-fg4'
        )}
      >
        "{faction.tagline}"
      </div>

      {/* Traits */}
      <div className="flex flex-col gap-2">
        {faction.traits.map((t) => (
          <div key={t} className="flex items-center gap-2.5 font-barlow text-[14px] text-fl-fg4">
            <span
              className={cn(
                'text-[8px]',
                active ? (isRed ? 'text-fl-red' : 'text-fl-blue-h') : 'text-fl-border-st'
              )}
            >
              ◆
            </span>
            {t}
          </div>
        ))}
      </div>

      {/* CTA */}
      {active && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigate({ to: '/play/local' })
          }}
          className={cn(
            'mt-7 inline-flex items-center justify-center px-5 py-[9px] font-oswald text-[13px] font-bold uppercase tracking-[0.08em] leading-none border cursor-pointer transition-all duration-200',
            isRed
              ? 'bg-fl-red hover:bg-fl-red-h text-white border-fl-red-border shadow-[0_2px_10px_rgba(200,55,45,0.25)] hover:shadow-[0_2px_10px_rgba(200,55,45,0.5)]'
              : 'bg-fl-blue hover:bg-fl-blue-h text-white border-fl-blue-border shadow-[0_2px_10px_rgba(45,111,168,0.25)] hover:shadow-[0_2px_10px_rgba(45,111,168,0.5)]'
          )}
        >
          {faction.btnLabel}
        </button>
      )}
    </div>
  )
}

function FactionPick({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  const [chosen, setChosen] = useState<'red' | 'blue' | null>(null)
  return (
    <section className="px-12 py-24 bg-fl-surf border-y border-fl-border-s">
      <div className="max-w-[1280px] mx-auto">
        <div className="font-plex text-[11px] text-fl-gold uppercase tracking-[0.18em] mb-3">
          CHOOSE YOUR SIDE
        </div>
        <h2 className="font-oswald font-bold text-[48px] uppercase text-fl-fg1 mb-14">
          WHICH FACTION DO YOU SERVE?
        </h2>
        <div className="grid grid-cols-2 gap-[3px]">
          {FACTION_DATA.map((f) => (
            <FactionCard
              key={f.id}
              faction={f}
              chosen={chosen}
              onChoose={setChosen}
              navigate={navigate}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

const FOOTER_LINKS = [
  ['PLAY', ['Quick Match', 'Ranked', 'Leaderboard', 'Watch Live']],
  ['ACCOUNT', ['Sign Up', 'Log In', 'Profile', 'Settings']],
  ['COMPANY', ['About', 'Blog', 'Careers', 'Contact']],
] as const

function Footer() {
  return (
    <footer className="bg-fl-surf border-t border-fl-border-s px-12 pt-14 pb-8">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          {/* Brand */}
          <div>
            <Logo />
            <p className="font-barlow text-[13px] text-fl-fg4 leading-[1.65] max-w-[260px] mt-4">
              The premier online strategy game. Two factions. One front. No mercy.
            </p>
            <div className="flex gap-2 mt-5">
              <span className="font-plex text-[10px] font-medium uppercase tracking-widest py-[3px] px-2.5 border border-[#2c4a1c] bg-[#1a2e10] text-[#76a854]">
                ● 142K ONLINE
              </span>
              <span className="font-plex text-[10px] font-medium uppercase tracking-widest py-[3px] px-2.5 border border-fl-gold-border bg-fl-gold-bg2 text-fl-gold">
                S4 LIVE
              </span>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map(([heading, links]) => (
            <div key={heading}>
              <div className="font-plex text-[9px] text-fl-fg4 uppercase tracking-[0.16em] mb-4">
                {heading}
              </div>
              <div className="flex flex-col gap-2.5">
                {links.map((l) => (
                  <span
                    key={l}
                    className="font-barlow text-[13px] text-fl-fg3 cursor-pointer hover:text-fl-fg1 transition-colors duration-150"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-fl-border-s w-full" />

        {/* Bottom bar */}
        <div className="flex justify-between items-center pt-5">
          <span className="font-plex text-[10px] text-fl-fg4">
            © 2026 FRONTLINE · ALL RIGHTS RESERVED
          </span>
          <div className="flex gap-2 items-center">
            <span className="font-plex text-[10px] text-fl-fg4 cursor-pointer hover:text-fl-fg2 transition-colors">
              PRIVACY
            </span>
            <span className="font-plex text-[10px] text-fl-border-st">·</span>
            <span className="font-plex text-[10px] text-fl-fg4 cursor-pointer hover:text-fl-fg2 transition-colors">
              TERMS
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

export function LandingPage() {
  const navigate = useNavigate()
  return (
    <div
      id="fl-scroll"
      className="min-h-screen overflow-y-auto bg-fl-bg text-fl-fg2 font-barlow antialiased"
    >
      <LandingNav navigate={navigate} />
      <Hero navigate={navigate} />
      <StatsBar />
      <Features />
      <FactionPick navigate={navigate} />
      <Footer />
    </div>
  )
}
