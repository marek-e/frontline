import { cn } from '~/lib/utils'
import type { Color, GamePhase, RoundScore, GameAction } from '@frontline/rules'

interface Props {
  phase: GamePhase
  roundWinner: Color | null
  matchWinner: Color | null
  lastRoundScore: RoundScore | null
  onNextRound: () => void
  dispatch: (action: GameAction) => void
  matchFormat: 3 | 5
}

export function WinModal({
  phase,
  roundWinner,
  matchWinner,
  lastRoundScore,
  onNextRound,
  dispatch,
  matchFormat,
}: Props) {
  if (phase === 'playing') return null

  const isMatchOver = phase === 'match_over'
  const color = isMatchOver ? matchWinner! : roundWinner!

  const factionBorder = color === 'red' ? 'border-t-red-faction' : 'border-t-blue-faction'
  const factionText = color === 'red' ? 'text-red-faction' : 'text-blue-faction'
  const primaryBtn =
    color === 'red'
      ? 'bg-red-faction border-red-faction text-white hover:bg-red-faction/85'
      : 'bg-blue-faction border-blue-faction text-white hover:bg-blue-faction/85'
  const outlineBtn =
    color === 'red'
      ? 'border-red-faction text-red-faction hover:bg-red-faction/10'
      : 'border-blue-faction text-blue-faction hover:bg-blue-faction/10'

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] animate-in fade-in duration-200">
      <div
        className={cn(
          'bg-card rounded-2xl px-11 py-9 min-w-[300px] text-center shadow-lg',
          'animate-in slide-in-from-bottom-6 duration-200',
          'border-t-[6px]',
          factionBorder,
          factionText
        )}
      >
        {isMatchOver ? (
          <>
            <div className="text-[40px] mb-2">🏆</div>
            <div className="text-[22px] font-black tracking-[2px] mb-4">
              {color.toUpperCase()} WINS THE MATCH
            </div>
            {lastRoundScore && (
              <div className="text-[14px] text-fg-muted mb-5">
                Final round: {lastRoundScore.winnerPoints.toFixed(2)} pts
              </div>
            )}
            <div className="flex gap-2.5 justify-center">
              <button
                className={cn(
                  'px-5 py-2.5 rounded-lg border-2 text-[13px] font-bold tracking-[0.5px] cursor-pointer transition-all',
                  primaryBtn
                )}
                onClick={() => dispatch({ type: 'NEW_MATCH', format: matchFormat })}
              >
                New Match
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-[40px] mb-2">⚔️</div>
            <div className="text-[22px] font-black tracking-[2px] mb-4">
              {color.toUpperCase()} WINS THE ROUND
            </div>
            {lastRoundScore && (
              <div className="bg-muted/50 rounded-lg px-4 py-2.5 mb-5 text-left">
                <div className="flex justify-between text-[14px] font-semibold text-foreground">
                  <span>Round points</span>
                  <span className={factionText}>+{lastRoundScore.winnerPoints.toFixed(3)}</span>
                </div>
                <div className="text-[11px] text-fg-subtle mt-1">
                  (1.000 win + {(lastRoundScore.winnerPoints - 1).toFixed(3)} efficiency)
                </div>
              </div>
            )}
            <div className="flex gap-2.5 justify-center">
              <button
                className={cn(
                  'px-5 py-2.5 rounded-lg border-2 text-[13px] font-bold tracking-[0.5px] cursor-pointer transition-all',
                  primaryBtn
                )}
                onClick={onNextRound}
              >
                Next Round
              </button>
              <button
                className={cn(
                  'px-5 py-2.5 rounded-lg border-2 text-[13px] font-bold tracking-[0.5px] cursor-pointer transition-all bg-transparent',
                  outlineBtn
                )}
                onClick={() => dispatch({ type: 'NEW_MATCH', format: matchFormat })}
              >
                New Match
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
