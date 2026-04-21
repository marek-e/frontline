import type { Color, GamePhase, RoundScore, GameAction } from '@frontline/rules'
import './WinModal.css'

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
  phase, roundWinner, matchWinner, lastRoundScore,
  onNextRound, dispatch, matchFormat
}: Props) {
  if (phase === 'playing') return null

  const isMatchOver = phase === 'match_over'
  const color = isMatchOver ? matchWinner! : roundWinner!

  return (
    <div className="win-modal-backdrop">
      <div className={`win-modal win-modal--${color}`}>
        {isMatchOver ? (
          <>
            <div className="win-modal__emoji">🏆</div>
            <div className="win-modal__title">{color.toUpperCase()} WINS THE MATCH</div>
            {lastRoundScore && (
              <div className="win-modal__score">
                Final round: {lastRoundScore.winnerPoints.toFixed(2)} pts
              </div>
            )}
            <div className="win-modal__actions">
              <button
                className="win-modal__btn win-modal__btn--primary"
                onClick={() => dispatch({ type: 'NEW_MATCH', format: matchFormat })}
              >
                New Match
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="win-modal__emoji">⚔️</div>
            <div className="win-modal__title">{color.toUpperCase()} WINS THE ROUND</div>
            {lastRoundScore && (
              <div className="win-modal__score-breakdown">
                <div className="win-modal__score-row">
                  <span>Round points</span>
                  <span className={`win-modal__pts win-modal__pts--${lastRoundScore.winner}`}>
                    +{lastRoundScore.winnerPoints.toFixed(3)}
                  </span>
                </div>
                <div className="win-modal__score-sub">
                  (1.000 win + {(lastRoundScore.winnerPoints - 1).toFixed(3)} efficiency)
                </div>
              </div>
            )}
            <div className="win-modal__actions">
              <button
                className="win-modal__btn win-modal__btn--primary"
                onClick={onNextRound}
              >
                Next Round
              </button>
              <button
                className="win-modal__btn"
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
