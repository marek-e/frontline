import { useReducer } from 'react'
import { gameReducer, createInitialState } from '@frontline/rules'
import { Board } from './components/Board/Board'
import { GameInfo } from './components/GameInfo/GameInfo'
import { MatchScore } from './components/MatchScore/MatchScore'
import { WinModal } from './components/WinModal/WinModal'
import { PromotionPicker } from './components/PromotionPicker/PromotionPicker'

function App() {
  const [state, dispatch] = useReducer(gameReducer, createInitialState(3))
  const { round, match } = state

  const lastRoundScore = match.roundScores.at(-1) ?? null

  return (
    <div className="flex items-center justify-center max-[700px]:flex-col gap-10 max-[700px]:gap-4 p-8 max-[700px]:p-4 bg-card rounded-[20px] shadow-board">
      {/* Left sidebar */}
      <div className="flex flex-col gap-4 w-[180px] max-[700px]:w-full min-h-[min(90vmin,600px)] max-[700px]:min-h-0 justify-start pt-2">
        <GameInfo
          turn={round.turn}
          phase={round.phase}
          inCheck={round.inCheck}
          warlordPursuit={round.warlordPursuit}
          capturedByRed={round.capturedByRed}
          capturedByBlue={round.capturedByBlue}
          dispatch={dispatch}
        />
      </div>

      {/* Board */}
      <div className="flex items-center justify-center px-5 max-[700px]:px-0">
        <Board
          board={round.board}
          turn={round.turn}
          phase={round.phase}
          inCheck={round.inCheck}
          movedPieceIds={round.movedPieceIds}
          enPassantTarget={round.enPassantTarget}
          warlordPursuit={round.warlordPursuit}
          dispatch={dispatch}
        />
      </div>

      {/* Right sidebar */}
      <div className="flex flex-col gap-4 w-[180px] max-[700px]:w-full min-h-[min(90vmin,600px)] max-[700px]:min-h-0 justify-start pt-2">
        <MatchScore match={match} dispatch={dispatch} />
      </div>

      {round.pendingPromotion && (
        <PromotionPicker color={round.pendingPromotion.color} dispatch={dispatch} />
      )}

      <WinModal
        phase={round.phase}
        roundWinner={round.winner}
        matchWinner={match.matchWinner}
        lastRoundScore={lastRoundScore}
        onNextRound={() => dispatch({ type: 'NEW_ROUND' })}
        dispatch={dispatch}
        matchFormat={match.format}
      />
    </div>
  )
}

export default App
