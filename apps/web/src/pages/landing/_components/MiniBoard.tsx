import { useState } from 'react'
import { cn } from '~/lib/utils'
import { CornerBrackets } from './CornerBrackets'

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

export function MiniBoard() {
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
