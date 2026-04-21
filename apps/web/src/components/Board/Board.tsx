import { useState, useEffect } from 'react'
import type { Board as BoardType, Square as SquareType, GameAction, Color } from '@frontline/rules'
import { getLegalMoves, getWarlordPursuitMoves, getPiece, squaresEqual, findPiece } from '@frontline/rules'
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
  warlordPursuit: SquareType | null
  dispatch: (action: GameAction) => void
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

export function Board({
  board, turn, phase, inCheck, movedPieceIds, enPassantTarget, warlordPursuit, dispatch,
}: Props) {
  const checkedCommanderSq = inCheck
    ? findPiece(board, p => p.type === 'commander' && p.color === turn)
    : null

  const [drag, setDrag] = useState<DragState>({
    selectedSquare: null,
    legalMoves: [],
    dragOverSquare: null,
  })

  const ctx = { movedPieceIds, enPassantTarget }

  // When pursuit mode activates, auto-select the warlord and show its pursuit moves
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
    if (warlordPursuit) return // during pursuit, only the warlord is locked in
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
    if (!drag.legalMoves.some(sq => squaresEqual(sq, to))) {
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

    // Pursuit mode: only the warlord can move
    if (warlordPursuit) {
      if (drag.legalMoves.some(s => squaresEqual(s, sq))) {
        dispatch({ type: 'WARLORD_PURSUE', to: sq })
        setDrag({ selectedSquare: null, legalMoves: [], dragOverSquare: null })
      }
      return
    }

    if (drag.selectedSquare) {
      if (drag.legalMoves.some(s => squaresEqual(s, sq))) {
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
    <div className="board-wrapper">
      <div className="board-ranks">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="board-label">{8 - i}</div>
        ))}
      </div>

      <div className={`board${warlordPursuit ? ' board--pursuit' : ''}`}>
        {board.map((row, rowIdx) =>
          row.map((piece, colIdx) => {
            const sq: SquareType = { row: rowIdx, col: colIdx }
            const isSelected = !!(drag.selectedSquare && squaresEqual(drag.selectedSquare, sq))
            const isLegal = drag.legalMoves.some(s => squaresEqual(s, sq))
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
          })
        )}
      </div>

      <div className="board-files">
        {FILES.map(f => <div key={f} className="board-label">{f}</div>)}
      </div>
    </div>
  )
}
