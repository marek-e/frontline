import { useNavigate } from '@tanstack/react-router'
import { cn } from '~/lib/utils'
import { CornerBrackets } from './CornerBrackets'

export type FactionId = 'red' | 'blue'

export type Faction = {
  id: FactionId
  name: string
  sub: string
  tagline: string
  traits: string[]
  icon: string
  btnLabel: string
}

export function FactionCard({
  faction,
  chosen,
  onChoose,
  navigate,
}: {
  faction: Faction
  chosen: FactionId | null
  onChoose: (id: FactionId) => void
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
