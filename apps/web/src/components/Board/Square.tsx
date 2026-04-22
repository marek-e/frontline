import { cn } from '~/lib/utils'
import type { Piece as PieceData, Square as SquareType } from '@frontline/rules'
import { Piece } from '../Piece/Piece'

interface Props {
  square: SquareType
  piece: PieceData | null
  isLight: boolean
  isSelected: boolean
  isLegalMove: boolean
  isCaptureTarget: boolean
  isSwapTarget: boolean
  isChecked: boolean
  isDragOver: boolean
  isFocused: boolean
  ariaLabel: string
  onDragStart: (sq: SquareType) => void
  onDragEnd: () => void
  onDragOver: (sq: SquareType) => void
  onDragLeave: () => void
  onDrop: (sq: SquareType) => void
  onClick: (sq: SquareType) => void
  onFocused: (sq: SquareType) => void
}

export function Square({
  square,
  piece,
  isLight,
  isSelected,
  isLegalMove,
  isCaptureTarget,
  isSwapTarget,
  isChecked,
  isDragOver,
  isFocused,
  ariaLabel,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  onFocused,
}: Props) {
  return (
    <div
      role="gridcell"
      aria-label={ariaLabel}
      aria-selected={isSelected}
      tabIndex={isFocused ? 0 : -1}
      data-sq={`${square.row}-${square.col}`}
      className={cn(
        'relative flex items-center justify-center aspect-square',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset focus-visible:z-10',
        isLight ? 'bg-board-light' : 'bg-board-dark',
        isChecked && 'sq-checked',
        isSelected && 'sq-selected',
        isCaptureTarget && 'sq-capture',
        isSwapTarget && 'sq-swap',
        isDragOver && 'bg-gold/55!'
      )}
      onDragOver={(e) => {
        e.preventDefault()
        onDragOver(square)
      }}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault()
        onDrop(square)
      }}
      onClick={() => onClick(square)}
      onFocus={() => onFocused(square)}
    >
      {piece && (
        <Piece
          piece={piece}
          square={square}
          isSelected={isSelected}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      )}
      {isLegalMove && !piece && (
        <div className="absolute w-[28%] h-[28%] rounded-full pointer-events-none bg-move-dot" />
      )}
    </div>
  )
}
