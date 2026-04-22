import { useReducer, useEffect, useRef, useState } from 'react'
import { gameReducer, createInitialState } from '@frontline/rules'
import type { Move, Square } from '@frontline/rules'
import { Board } from '~/components/Board/Board'
import { GameInfo } from '~/components/GameInfo/GameInfo'
import { MatchScore } from '~/components/MatchScore/MatchScore'
import { WinModal } from '~/components/WinModal/WinModal'
import { PromotionPicker } from '~/components/PromotionPicker/PromotionPicker'

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const coord = (s: Square) => `${FILES[s.col]}${8 - s.row}`

function formatAnnouncement(move: Move): string {
  const color = move.piece.color.charAt(0).toUpperCase() + move.piece.color.slice(1)
  const type = move.piece.type
  if (move.isSwap) return `${color} ${type} swaps to ${coord(move.to)}`
  if (move.isEnPassant) return `${color} ${type} captures en passant on ${coord(move.to)}`
  if (move.capturedPiece)
    return `${color} ${type} captures ${move.capturedPiece.type} on ${coord(move.to)}`
  return `${color} ${type} to ${coord(move.to)}`
}

export function PlayLocal() {
  const [state, dispatch] = useReducer(gameReducer, createInitialState(3))
  const { round, match } = state
  const lastRoundScore = match.roundScores.at(-1) ?? null

  const prevMoveCount = useRef(0)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const history = round.moveHistory
    if (history.length > prevMoveCount.current) {
      setAnnouncement(formatAnnouncement(history[history.length - 1]))
      prevMoveCount.current = history.length
    }
  }, [round.moveHistory])

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <div className="flex flex-col items-center gap-4 p-4 lg:flex-row lg:items-center lg:gap-10 lg:p-8 bg-card rounded-[20px] shadow-board w-full lg:w-auto">
        {/* Board rendered first in DOM for a11y; visually re-ordered on lg via flex order */}
        <div className="flex items-center justify-center lg:order-2">
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

        <div className="grid grid-cols-2 gap-4 w-full lg:contents">
          <div className="flex flex-col gap-3 lg:order-1 lg:w-[180px] lg:min-h-[min(90vmin,600px)] lg:justify-start lg:pt-2">
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

          <div className="flex flex-col gap-3 lg:order-3 lg:w-[180px] lg:min-h-[min(90vmin,600px)] lg:justify-start lg:pt-2">
            <MatchScore match={match} dispatch={dispatch} />
          </div>
        </div>
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
    </>
  )
}
