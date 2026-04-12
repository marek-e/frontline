import { useReducer } from 'react'
import { gameReducer, createInitialState } from './game/gameReducer'
import { Board } from './components/Board/Board'
import { GameInfo } from './components/GameInfo/GameInfo'
import { MatchScore } from './components/MatchScore/MatchScore'
import { WinModal } from './components/WinModal/WinModal'
import './App.css'

function App() {
  const [state, dispatch] = useReducer(gameReducer, createInitialState(3))
  const { round, match } = state

  const lastRoundScore = match.roundScores.at(-1) ?? null

  function handleNextRound() {
    dispatch({ type: 'NEW_ROUND' })
  }

  return (
    <div className="app">
      <div className="app__left">
        <GameInfo
          turn={round.turn}
          phase={round.phase}
          inCheck={round.inCheck}
          capturedByRed={round.capturedByRed}
          capturedByBlue={round.capturedByBlue}
        />
      </div>

      <div className="app__center">
        <Board
          board={round.board}
          turn={round.turn}
          phase={round.phase}
          inCheck={round.inCheck}
          movedPieceIds={round.movedPieceIds}
          enPassantTarget={round.enPassantTarget}
          dispatch={dispatch}
        />
      </div>

      <div className="app__right">
        <MatchScore match={match} dispatch={dispatch} />
      </div>

      <WinModal
        phase={round.phase}
        roundWinner={round.winner}
        matchWinner={match.matchWinner}
        lastRoundScore={lastRoundScore}
        onNextRound={handleNextRound}
        dispatch={dispatch}
        matchFormat={match.format}
      />
    </div>
  )
}

export default App
