import { useState } from 'react'
import type { Board as BoardType, Square as SquareType } from '../../game/types'
import type { GameAction } from '../../game/gameReducer'
import { getLegalMoves } from '../../game/moves'
import { getPiece, squaresEqual, findPiece } from '../../game/board'
import type { Color } from '../../game/types'
import { Square } from './Square'
import './Board.css'

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
  dispatch: (action: GameAction) => void
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

export function Board({ board, turn, phase, inCheck, movedPieceIds, enPassantTarget, dispatch }: Props) {
  // Find the threatened Commander's square for check highlight
  const checkedCommanderSq = inCheck
    ? findPiece(board, p => p.type === 'commander' && p.color === turn)
    : null
  const [drag, setDrag] = useState<DragState>({
    selectedSquare: null,
    legalMoves: [],
    dragOverSquare: null,
  })

  const ctx = { movedPieceIds, enPassantTarget }

  function selectSquare(sq: SquareType) {
    const piece = getPiece(board, sq)
    if (piece && piece.color === turn) {
      setDrag({
        selectedSquare: sq,
        legalMoves: getLegalMoves(board, sq, ctx),
        dragOverSquare: null,
      })
    } else {
      setDrag({ selectedSquare: null, legalMoves: [], dragOverSquare: null })
    }
  }

  function handleDragStart(sq: SquareType) {
    if (phase !== 'playing') return
    selectSquare(sq)
  }

  function handleDragEnd() {
    setDrag(d => ({ ...d, dragOverSquare: null }))
  }

  function handleDragOver(sq: SquareType) {
    setDrag(d => ({ ...d, dragOverSquare: sq }))
  }

  function handleDragLeave() {
    setDrag(d => ({ ...d, dragOverSquare: null }))
  }

  function handleDrop(to: SquareType) {
    setDrag(d => ({ ...d, dragOverSquare: null }))
    if (!drag.selectedSquare) return
    if (drag.legalMoves.some(sq => squaresEqual(sq, to))) {
      dispatch({ type: 'MOVE_PIECE', from: drag.selectedSquare, to })
    }
    setDrag({ selectedSquare: null, legalMoves: [], dragOverSquare: null })
  }

  function handleClick(sq: SquareType) {
    if (phase !== 'playing') return

    // If a square is already selected
    if (drag.selectedSquare) {
      // Click on a legal move target → move
      if (drag.legalMoves.some(s => squaresEqual(s, sq))) {
        dispatch({ type: 'MOVE_PIECE', from: drag.selectedSquare, to: sq })
        setDrag({ selectedSquare: null, legalMoves: [], dragOverSquare: null })
        return
      }
      // Click on own piece → reselect
      const piece = getPiece(board, sq)
      if (piece && piece.color === turn) {
        selectSquare(sq)
        return
      }
      // Click elsewhere → deselect
      setDrag({ selectedSquare: null, legalMoves: [], dragOverSquare: null })
      return
    }

    // Nothing selected — try to select
    const piece = getPiece(board, sq)
    if (piece && piece.color === turn) {
      selectSquare(sq)
    }
  }

  return (
    <div className="board-wrapper">
      {/* Rank labels (left side) */}
      <div className="board-ranks">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="board-label">{8 - i}</div>
        ))}
      </div>

      <div className="board">
        {board.map((row, rowIdx) =>
          row.map((piece, colIdx) => {
            const sq: SquareType = { row: rowIdx, col: colIdx }
            const isSelected = !!(drag.selectedSquare && squaresEqual(drag.selectedSquare, sq))
            const isLegal = drag.legalMoves.some(s => squaresEqual(s, sq))
            const isSwapTarget = isLegal && piece !== null && piece.color === turn
            const isCapture = isLegal && piece !== null && !isSwapTarget
            const isDragOver = !!(drag.dragOverSquare && squaresEqual(drag.dragOverSquare, sq))
            const isLight = (rowIdx + colIdx) % 2 === 0
            const isChecked = !!(checkedCommanderSq && squaresEqual(checkedCommanderSq, sq))

            return (
              <Square
                key={`${rowIdx}-${colIdx}`}
                square={sq}
                piece={piece}
                isLight={isLight}
                isSelected={isSelected}
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
          })
        )}
      </div>

      {/* File labels (bottom) */}
      <div className="board-files">
        {FILES.map(f => <div key={f} className="board-label">{f}</div>)}
      </div>
    </div>
  )
}
