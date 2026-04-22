import { useReducer, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeToggle } from '~/components/ui/theme-toggle'
import { gameReducer, createInitialState, replayTurns, toFGN, replayFGN } from '@frontline/rules'
import type { Move, Square } from '@frontline/rules'
import { Board } from '~/components/Board/Board'
import { GameInfo } from '~/components/GameInfo/GameInfo'
import { MatchScore } from '~/components/MatchScore/MatchScore'
import { WinModal } from '~/components/WinModal/WinModal'
import { PromotionPicker } from '~/components/PromotionPicker/PromotionPicker'
import { MoveList } from '~/components/MoveList/MoveList'

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
  const [viewPly, setViewPly] = useState<number | null>(null)

  const prevMoveCount = useRef(0)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const history = round.moveHistory
    if (history.length > prevMoveCount.current) {
      setAnnouncement(formatAnnouncement(history[history.length - 1]))
      prevMoveCount.current = history.length
    }
  }, [round.moveHistory])

  const displayState = useMemo(() => {
    if (viewPly === null) return state
    const base = createInitialState(match.format)
    base.round.startingTurn = round.startingTurn
    base.round.turn = round.startingTurn
    return replayTurns(base, round.turnLog, viewPly + 1)
  }, [match.format, round.startingTurn, round.turnLog, state, viewPly])

  const displayRound = displayState.round

  async function handleExport() {
    const fgn = toFGN(state)
    try {
      await navigator.clipboard.writeText(fgn)
    } catch {
      // ignore
    }
    const blob = new Blob([fgn], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'frontline.fgn'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(text: string) {
    const next = replayFGN(text, match.format)
    dispatch({ type: 'LOAD_STATE', state: next })
    setViewPly(null)
  }

  return (
    <main className="flex flex-col items-center justify-start min-h-dvh py-6 lg:justify-center">
      <div className="fixed top-3 right-3 z-50">
        <ThemeToggle />
      </div>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <div className="flex flex-col items-center gap-4 p-4 lg:flex-row lg:items-center lg:gap-10 lg:p-8 bg-card rounded-[20px] shadow-board w-full lg:w-auto">
        {/* Board rendered first in DOM for a11y; visually re-ordered on lg via flex order */}
        <div className="flex items-center justify-center lg:order-2">
          <Board
            board={displayRound.board}
            turn={displayRound.turn}
            phase={displayRound.phase}
            inCheck={displayRound.inCheck}
            movedPieceIds={displayRound.movedPieceIds}
            enPassantTarget={displayRound.enPassantTarget}
            warlordPursuit={displayRound.warlordPursuit}
            flipped={displayRound.turn === 'blue'}
            readOnly={viewPly !== null}
            dispatch={dispatch}
          />
        </div>

        <div className="flex flex-col gap-4 w-full sm:grid sm:grid-cols-2 lg:contents">
          <div className="flex flex-col gap-3 min-w-0 lg:order-1 lg:w-[180px] lg:min-h-[min(90vmin,600px)] lg:justify-start lg:pt-2">
            <GameInfo
              turn={displayRound.turn}
              phase={displayRound.phase}
              inCheck={displayRound.inCheck}
              warlordPursuit={displayRound.warlordPursuit}
              capturedByRed={displayRound.capturedByRed}
              capturedByBlue={displayRound.capturedByBlue}
              canUndo={state.undoStack.length > 0 && viewPly === null}
              disableActions={viewPly !== null}
              onExport={handleExport}
              onImport={handleImport}
              dispatch={dispatch}
            />
          </div>

          <div className="flex flex-col gap-3 min-w-0 lg:order-3 lg:w-[180px] lg:min-h-[min(90vmin,600px)] lg:justify-start lg:pt-2">
            <MoveList
              turnLog={round.turnLog}
              startingTurn={round.startingTurn}
              viewPly={viewPly}
              onSelectPly={setViewPly}
              format={match.format}
            />
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
    </main>
  )
}
