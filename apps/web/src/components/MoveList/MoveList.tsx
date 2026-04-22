import type { TurnEntry } from '@frontline/rules'
import { createInitialState, moveToSAN, replayTurns } from '@frontline/rules'
import { cn } from '~/lib/utils'
import { useEffect, useMemo, useRef } from 'react'

interface Props {
  turnLog: TurnEntry[]
  startingTurn: 'red' | 'blue'
  /** null = live */
  viewPly: number | null
  onSelectPly: (ply: number | null) => void
  format: 3 | 5
}

export function MoveList({ turnLog, startingTurn, viewPly, onSelectPly, format }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const rows = useMemo(() => {
    const init = createInitialState(format)
    init.round.startingTurn = startingTurn
    init.round.turn = startingTurn

    const out: {
      fullmove: number
      red: { ply: number; san: string } | null
      blue: { ply: number; san: string } | null
    }[] = []

    let replay = init
    let fullmove = 1
    for (let ply = 0; ply < turnLog.length; ply++) {
      const entry = turnLog[ply]!
      const san = moveToSAN(replay.round, entry)
      const side = replay.round.turn

      const rowIdx = side === 'red' ? out.length : Math.max(0, out.length - 1)
      if (side === 'red') out.push({ fullmove, red: { ply, san }, blue: null })
      else {
        if (!out[rowIdx]) out.push({ fullmove, red: null, blue: { ply, san } })
        else out[rowIdx] = { ...out[rowIdx]!, blue: { ply, san } }
        fullmove++
      }

      replay = replayTurns(replay, [entry], 1)
    }

    return out
  }, [format, startingTurn, turnLog])

  useEffect(() => {
    if (!scrollRef.current) return
    if (viewPly !== null) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [turnLog.length, viewPly])

  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-[0.5px] text-board-dark">
          Moves
        </div>
        {viewPly !== null && (
          <button
            className="text-[11px] font-bold text-foreground/70 hover:text-foreground transition-colors"
            onClick={() => onSelectPly(null)}
          >
            Return to live
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="max-h-[220px] lg:max-h-[min(80vmin,500px)] overflow-auto rounded-xl border border-border bg-muted/30"
      >
        {rows.length === 0 ? (
          <div className="p-3 text-[12px] text-muted-foreground">No moves yet.</div>
        ) : (
          <div className="divide-y divide-border/60 font-mono tabular-nums text-[12px]">
            {rows.map((row) => (
              <div key={row.fullmove} className="grid grid-cols-[36px_1fr_1fr] gap-1 px-2 py-1.5">
                <div className="text-muted-foreground text-right pr-1">{row.fullmove}.</div>
                <MoveCell
                  side="red"
                  cell={row.red}
                  selectedPly={viewPly}
                  onSelectPly={onSelectPly}
                />
                <MoveCell
                  side="blue"
                  cell={row.blue}
                  selectedPly={viewPly}
                  onSelectPly={onSelectPly}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MoveCell({
  side,
  cell,
  selectedPly,
  onSelectPly,
}: {
  side: 'red' | 'blue'
  cell: { ply: number; san: string } | null
  selectedPly: number | null
  onSelectPly: (ply: number | null) => void
}) {
  if (!cell) return <div />
  const selected = selectedPly === cell.ply
  return (
    <button
      className={cn(
        'text-left px-1.5 py-0.5 rounded-md transition-colors',
        'hover:bg-muted',
        selected && 'bg-muted text-foreground'
      )}
      onClick={() => onSelectPly(cell.ply)}
    >
      <span
        className={cn('font-semibold', side === 'red' ? 'text-red-faction' : 'text-blue-faction')}
      >
        {cell.san}
      </span>
    </button>
  )
}
