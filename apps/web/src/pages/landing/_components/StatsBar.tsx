import { cn } from '~/lib/utils'

const STATS = [
  { v: '142,819', l: 'PLAYERS ONLINE' },
  { v: '2,841', l: 'IN QUEUE' },
  { v: '8.3', l: 'AVG TURNS' },
  { v: '99.9%', l: 'UPTIME' },
]

export function StatsBar() {
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
