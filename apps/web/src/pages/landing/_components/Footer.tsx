import { Logo } from '~/components/Logo/Logo'

const FOOTER_LINKS = [
  ['PLAY', ['Quick Match', 'Ranked', 'Leaderboard', 'Watch Live']],
  ['ACCOUNT', ['Sign Up', 'Log In', 'Profile', 'Settings']],
  ['COMPANY', ['About', 'Blog', 'Careers', 'Contact']],
] as const

export function Footer() {
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
