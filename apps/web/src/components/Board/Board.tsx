import { useState, useEffect } from 'react'
import type { Board as BoardType, Square as SquareType, GameAction, Color } from '@frontline/rules'
import {
  getLegalMoves,
  getWarlordPursuitMoves,
  getPiece,
  squaresEqual,
  findPiece,
} from '@frontline/rules'
import { cn } from '~/lib/utils'
import { Square } from './Square'

interface DragState {
  selectedSquare: SquareType | null
  legalMoves: SquareType[]
  dragOverSquare: SquareType | null
}

interface Props {
  board: BoardType
  turn: Color
  phase: string
  inCheck: boolean
  movedPieceIds: string[]
  enPassantTarget: SquareType | null
  warlordPursuit: SquareType | null
  dispatch: (action: GameAction) => void
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const LABEL_CLS =
  'flex-1 flex items-center justify-center text-[11px] font-semibold text-board-border font-mono select-none'

export function Board({
  board,
  turn,
  phase,
  inCheck,
  movedPieceIds,
  enPassantTarget,
  warlordPursuit,
  dispatch,
}: Props) {
  const checkedCommanderSq = inCheck
    ? findPiece(board, (p) => p.type === 'commander' && p.color === turn)
    : null

  const [drag, setDrag] = useState<DragState>({
    selectedSquare: null,
    legalMoves: [],
    dragOverSquare: null,
  })

  const ctx = { movedPieceIds, enPassantTarget }

  useEffect(() => {
    if (warlordPursuit) {
      const pursuitMoves = getWarlordPursuitMoves(board, warlordPursuit, turn, ctx)
      setDrag({ selectedSquare: warlordPursuit, legalMoves: pursuitMoves, dragOverSquare: null })
    } else {
      setDrag({ selectedSquare: null, legalMoves: [], dragOverSquare: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warlordPursuit])

  function selectSquare(sq: SquareType) {
    if (warlordPursuit) return
    const piece = getPiece(board, sq)
    if (piece && piece.color === turn) {
      setDrag({ selectedSquare: sq, legalMoves: getLegalMoves(board, sq, ctx), dragOverSquare: null })
    } else {
      setDrag({ selectedSquare: null, legalMoves: [], dragOverSquare: null })
    }
  }

  function handleDragStart(sq: SquareType) {
    if (phase !== 'playing') return
    if (warlordPursuit && !squaresEqual(sq, warlordPursuit)) return
    selectSquare(sq)
  }

  function handleDragEnd() {
    setDrag((d) => ({ ...d, dragOverSquare: null }))
  }

  function handleDragOver(sq: SquareType) {
    setDrag((d) => ({ ...d, dragOverSquare: sq }))
  }

  function handleDragLeave() {
    setDrag((d) => ({ ...d, dragOverSquare: null }))
  }

  function handleDrop(to: SquareType) {
    setDrag((d) => ({ ...d, dragOverSquare: null }))
    if (!drag.selectedSquare) return
    if (!drag.legalMoves.some((sq) => squaresEqual(sq, to))) {
      setDrag({ selectedSquare: null, legalMoves: [], dragOverSquare: null })
      return
    }
    if (warlordPursuit) {
      dispatch({ type: 'WARLORD_PURSUE', to })
    } else {
      dispatch({ type: 'MOVE_PIECE', from: drag.selectedSquare, to })
    }
    setDrag({ selectedSquare: null, legalMoves: [], dragOverSquare: null })
  }

  function handleClick(sq: SquareType) {
    if (phase !== 'playing') return

    if (warlordPursuit) {
      if (drag.legalMoves.some((s) => squaresEqual(s, sq))) {
        dispatch({ type: 'WARLORD_PURSUE', to: sq })
        setDrag({ selectedSquare: null, legalMoves: [], dragOverSquare: null })
      }
      return
    }

    if (drag.selectedSquare) {
      if (drag.legalMoves.some((s) => squaresEqual(s, sq))) {
        dispatch({ type: 'MOVE_PIECE', from: drag.selectedSquare, to: sq })
        setDrag({ selectedSquare: null, legalMoves: [], dragOverSquare: null })
        return
      }
      const piece = getPiece(board, sq)
      if (piece && piece.color === turn) { selectSquare(sq); return }
      setDrag({ selectedSquare: null, legalMoves: [], dragOverSquare: null })
      return
    }

    const piece = getPiece(board, sq)
    if (piece && piece.color === turn) selectSquare(sq)
  }

  return (
    <div className="relative flex flex-col items-start">
      {/* Rank labels */}
      <div className="absolute -left-[22px] top-0 flex flex-col h-[min(90vmin,600px)]">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className={LABEL_CLS}>{8 - i}</div>
        ))}
      </div>

      {/* Board grid */}
      <div
        className={cn(
          'grid grid-cols-8 grid-rows-8 w-[min(90vmin,600px)] h-[min(90vmin,600px)]',
          'border-[3px] border-board-border shadow-board',
          warlordPursuit && 'outline outline-[3px] outline-offset-2 outline-gold/60',
        )}
      >
        {board.map((row, rowIdx) =>
          row.map((piece, colIdx) => {
            const sq: SquareType = { row: rowIdx, col: colIdx }
            const isSelected = !!(drag.selectedSquare && squaresEqual(drag.selectedSquare, sq))
            const isLegal = drag.legalMoves.some((s) => squaresEqual(s, sq))
            const isSwapTarget = !warlordPursuit && isLegal && piece !== null && piece.color === turn
            const isCapture = isLegal && piece !== null && !isSwapTarget
            const isDragOver = !!(drag.dragOverSquare && squaresEqual(drag.dragOverSquare, sq))
            const isLight = (rowIdx + colIdx) % 2 === 0
            const isChecked = !!(checkedCommanderSq && squaresEqual(checkedCommanderSq, sq))
            const isPursuitPiece = !!(warlordPursuit && squaresEqual(warlordPursuit, sq))

            return (
              <Square
                key={`${rowIdx}-${colIdx}`}
                square={sq}
                piece={piece}
                isLight={isLight}
                isSelected={isSelected || isPursuitPiece}
                isLegalMove={isLegal}
                isCaptureTarget={isCapture}
                isSwapTarget={isSwapTarget}
                isChecked={isChecked}
                isDragOver={isDragOver && isLegal}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
              />
            )
          }),
        )}
      </div>

      {/* File labels */}
      <div className="flex w-[min(90vmin,600px)] mt-1">
        {FILES.map((f) => (
          <div key={f} className={LABEL_CLS}>{f}</div>
        ))}
      </div>
    </div>
  )
}
