import { useState, useEffect, useRef } from 'react'
import type { Board as BoardType, Square as SquareType, GameAction, Color } from '@frontline/rules'
import {
  getLegalMoves,
  getWarlordPursuitMoves,
  getPiece,
  squaresEqual,
  findPiece,
} from '@frontline/rules'
import type { Piece as PieceData } from '@frontline/rules'
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
  flipped?: boolean
  dispatch: (action: GameAction) => void
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const LABEL_CLS =
  'flex-1 flex items-center justify-center text-[11px] font-semibold text-board-border font-mono select-none'

function squareAriaLabel(
  sq: SquareType,
  piece: PieceData | null,
  isLegal: boolean,
  isSelected: boolean,
  isChecked: boolean
): string {
  const c = `${FILES[sq.col]}${8 - sq.row}`
  if (isSelected && piece) return `${c}, selected ${piece.color} ${piece.type}`
  if (piece && isLegal) return `${c}, ${piece.color} ${piece.type}, can capture`
  if (piece) return `${c}, ${piece.color} ${piece.type}${isChecked ? ', in check' : ''}`
  if (isLegal) return `${c}, available move`
  return c
}

export function Board({
  board,
  turn,
  phase,
  inCheck,
  movedPieceIds,
  enPassantTarget,
  warlordPursuit,
  flipped = false,
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

  const [focusedSq, setFocusedSq] = useState<SquareType>({ row: 7, col: 0 })
  const boardGridRef = useRef<HTMLDivElement>(null)

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
      if (piece && piece.color === turn) {
        selectSquare(sq)
        return
      }
      setDrag({ selectedSquare: null, legalMoves: [], dragOverSquare: null })
      return
    }

    const piece = getPiece(board, sq)
    if (piece && piece.color === turn) selectSquare(sq)
  }

  function focusSquare(sq: SquareType) {
    setFocusedSq(sq)
    // Move browser focus to the new square after React re-renders
    requestAnimationFrame(() => {
      const el = boardGridRef.current?.querySelector(
        `[data-sq="${sq.row}-${sq.col}"]`
      ) as HTMLElement | null
      el?.focus({ preventScroll: true })
    })
  }

  function handleBoardKeyDown(e: React.KeyboardEvent) {
    const { row, col } = focusedSq
    const up = flipped ? 1 : -1
    const left = flipped ? 1 : -1
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        if (row + up >= 0 && row + up <= 7) focusSquare({ row: row + up, col })
        break
      case 'ArrowDown':
        e.preventDefault()
        if (row - up >= 0 && row - up <= 7) focusSquare({ row: row - up, col })
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (col + left >= 0 && col + left <= 7) focusSquare({ row, col: col + left })
        break
      case 'ArrowRight':
        e.preventDefault()
        if (col - left >= 0 && col - left <= 7) focusSquare({ row, col: col - left })
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        handleClick(focusedSq)
        break
      case 'Escape':
        setDrag({ selectedSquare: null, legalMoves: [], dragOverSquare: null })
        break
    }
  }

  return (
    <div className="relative flex flex-col items-start">
      <div className="absolute left-[-22px] top-0 hidden md:flex flex-col h-[min(90vmin,600px)]">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className={LABEL_CLS}>
            {flipped ? i + 1 : 8 - i}
          </div>
        ))}
      </div>

      <div
        ref={boardGridRef}
        role="grid"
        aria-label={`Frontline board, ${turn}'s turn`}
        className={cn(
          'grid grid-cols-8 grid-rows-8 w-[min(90vmin,600px)] h-[min(90vmin,600px)]',
          'border-[3px] border-board-border shadow-board',
          warlordPursuit && 'outline-[3px] outline-offset-2 outline-gold/60'
        )}
        onKeyDown={handleBoardKeyDown}
      >
        {(flipped ? [...board].reverse() : board).map((row, rIdx) => {
          const rowIdx = flipped ? 7 - rIdx : rIdx
          const cols = flipped ? [...row].reverse() : row
          return cols.map((piece, cIdx) => {
            const colIdx = flipped ? 7 - cIdx : cIdx
            const sq: SquareType = { row: rowIdx, col: colIdx }
            const isSelected = !!(drag.selectedSquare && squaresEqual(drag.selectedSquare, sq))
            const isLegal = drag.legalMoves.some((s) => squaresEqual(s, sq))
            const isSwapTarget =
              !warlordPursuit && isLegal && piece !== null && piece.color === turn
            const isCapture = isLegal && piece !== null && !isSwapTarget
            const isDragOver = !!(drag.dragOverSquare && squaresEqual(drag.dragOverSquare, sq))
            const isLight = (rowIdx + colIdx) % 2 === 0
            const isChecked = !!(checkedCommanderSq && squaresEqual(checkedCommanderSq, sq))
            const isPursuitPiece = !!(warlordPursuit && squaresEqual(warlordPursuit, sq))
            const isFocused = squaresEqual(focusedSq, sq)

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
                isFocused={isFocused}
                ariaLabel={squareAriaLabel(
                  sq,
                  piece,
                  isLegal,
                  isSelected || isPursuitPiece,
                  isChecked
                )}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                onFocused={setFocusedSq}
              />
            )
          })
        })}
      </div>

      <div className="hidden md:flex w-[min(90vmin,600px)] mt-1">
        {(flipped ? [...FILES].reverse() : FILES).map((f) => (
          <div key={f} className={LABEL_CLS}>
            {f}
          </div>
        ))}
      </div>
    </div>
  )
}
