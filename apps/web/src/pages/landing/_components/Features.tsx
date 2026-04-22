import { FeatureCard, type FeatureItem } from './FeatureCard'

const FEATURE_ITEMS: FeatureItem[] = [
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

export function Features() {
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
