import { useNavigate } from '@tanstack/react-router'
import { MiniBoard } from './MiniBoard'

export function Hero() {
  const navigate = useNavigate({ from: '/' })
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
