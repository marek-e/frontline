import type { MatchState, GameAction } from '@frontline/rules'
import './MatchScore.css'

interface Props {
  match: MatchState
  dispatch: (action: GameAction) => void
}

export function MatchScore({ match, dispatch }: Props) {
  const winsNeeded = Math.ceil(match.format / 2)

  return (
    <div className="match-score">
      <div className="match-score__header">
        MATCH — BO{match.format}
      </div>

      <div className="match-score__record">
        <div className="match-score__player match-score__player--red">
          <span className="match-score__name">RED</span>
          <span className="match-score__wins">{match.roundWins.red} / {winsNeeded}</span>
          <span className="match-score__pts">{match.redMatchPoints.toFixed(2)} pts</span>
        </div>
        <div className="match-score__vs">VS</div>
        <div className="match-score__player match-score__player--blue">
          <span className="match-score__name">BLUE</span>
          <span className="match-score__wins">{match.roundWins.blue} / {winsNeeded}</span>
          <span className="match-score__pts">{match.blueMatchPoints.toFixed(2)} pts</span>
        </div>
      </div>

      {match.roundScores.length > 0 && (
        <div className="match-score__history">
          <div className="match-score__history-title">Round History</div>
          {match.roundScores.map((score, i) => (
            <div key={i} className={`match-score__round match-score__round--${score.winner}`}>
              <span>Round {i + 1}</span>
              <span className="match-score__round-winner">{score.winner.toUpperCase()} wins</span>
              <span>{score.winnerPoints.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="match-score__format">
        <span>Format:</span>
        {([3, 5] as const).map(f => (
          <button
            key={f}
            className={`match-score__format-btn${match.format === f ? ' match-score__format-btn--active' : ''}`}
            onClick={() => dispatch({ type: 'NEW_MATCH', format: f })}
          >
            BO{f}
          </button>
        ))}
      </div>
    </div>
  )
}
