import { MiniBoard } from './MiniBoard'
import { CtaButton } from '~/components/ui/cta-button'

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-60px)] flex items-center bg-fl-bg">
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: 'radial-gradient(circle, #38382a 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 70% at 30% 50%, transparent, #12120d 80%)',
        }}
      />
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-linear-to-b from-transparent via-fl-red to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-linear-to-b from-transparent via-fl-blue to-transparent" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-12 py-20 w-full grid grid-cols-2 gap-20 items-center">
        <div>
          <div className="font-plex text-xs text-fl-gold uppercase tracking-[0.18em] mb-5 flex items-center gap-2.5">
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
            <CtaButton to="/signup">ENLIST NOW</CtaButton>
            <CtaButton variant="outline">WATCH LIVE</CtaButton>
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

        <MiniBoard />
      </div>
    </section>
  )
}
