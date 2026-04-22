import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { FactionCard, type Faction, type FactionId } from './FactionCard'

const FACTION_DATA: Faction[] = [
  {
    id: 'red',
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
    id: 'blue',
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

export function FactionPick() {
  const navigate = useNavigate({ from: '/' })
  const [chosen, setChosen] = useState<FactionId | null>(null)
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
