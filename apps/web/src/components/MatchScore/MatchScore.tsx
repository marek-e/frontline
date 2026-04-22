import { cn } from '~/lib/utils'
import type { MatchState, GameAction } from '@frontline/rules'

interface Props {
  match: MatchState
  dispatch: (action: GameAction) => void
}

export function MatchScore({ match, dispatch }: Props) {
  const winsNeeded = Math.ceil(match.format / 2)

  return (
    <div className="flex flex-col gap-4 min-w-40">
      <div className="text-[13px] font-extrabold tracking-[2px] text-fg-subtle uppercase">
        MATCH — BO{match.format}
      </div>

      <div className="flex flex-col gap-1.5 bg-muted/50 rounded-lg px-3 py-2.5">
        {/* Red */}
        <div className="flex items-baseline gap-2">
          <span className="font-extrabold text-[14px] tracking-[1px] min-w-9 text-red-faction">RED</span>
          <span className="text-[20px] font-bold text-foreground">
            {match.roundWins.red} / {winsNeeded}
          </span>
          <span className="text-[11px] text-fg-subtle ml-auto">
            {match.redMatchPoints.toFixed(2)} pts
          </span>
        </div>

        <div className="text-[11px] font-bold tracking-[2px] text-fg-subtle self-center">VS</div>

        {/* Blue */}
        <div className="flex items-baseline gap-2">
          <span className="font-extrabold text-[14px] tracking-[1px] min-w-9 text-blue-faction">BLUE</span>
          <span className="text-[20px] font-bold text-foreground">
            {match.roundWins.blue} / {winsNeeded}
          </span>
          <span className="text-[11px] text-fg-subtle ml-auto">
            {match.blueMatchPoints.toFixed(2)} pts
          </span>
        </div>
      </div>

      {match.roundScores.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="text-[11px] font-semibold uppercase tracking-[1px] text-fg-subtle mb-0.5">
            Round History
          </div>
          {match.roundScores.map((score, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 text-[12px] py-0.5 border-b border-border/50 text-fg-muted"
            >
              <span>Round {i + 1}</span>
              <span className={cn(
                'font-bold flex-1',
                score.winner === 'red' ? 'text-red-faction' : 'text-blue-faction',
              )}>
                {score.winner.toUpperCase()} wins
              </span>
              <span>{score.winnerPoints.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 text-[12px] text-fg-subtle mt-auto">
        <span>Format:</span>
        {([3, 5] as const).map((f) => (
          <button
            key={f}
            className={cn(
              'px-2.5 py-1 border rounded text-[11px] font-semibold cursor-pointer transition-all',
              match.format === f
                ? 'border-board-dark bg-board-dark text-white'
                : 'border-border bg-transparent text-fg-muted hover:border-fg-subtle hover:text-foreground',
            )}
            onClick={() => dispatch({ type: 'NEW_MATCH', format: f })}
          >
            BO{f}
          </button>
        ))}
      </div>
    </div>
  )
}
