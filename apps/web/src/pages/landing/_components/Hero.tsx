import { MiniBoard } from './MiniBoard'
import { CtaButton } from '~/components/ui/cta-button'
import { GridBackground } from '~/components/ui/grid-background'

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-60px)] flex items-center bg-fl-bg">
      <GridBackground dotOpacity={50} vignette />

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
