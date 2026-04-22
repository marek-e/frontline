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
  onDragStart: (sq: SquareType) => void
  onDragEnd: () => void
  onDragOver: (sq: SquareType) => void
  onDragLeave: () => void
  onDrop: (sq: SquareType) => void
  onClick: (sq: SquareType) => void
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
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
}: Props) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center aspect-square',
        isLight ? 'bg-board-light' : 'bg-board-dark',
        isChecked && 'sq-checked',
        isSelected && 'sq-selected',
        isCaptureTarget && 'sq-capture',
        isSwapTarget && 'sq-swap',
        isDragOver && '!bg-gold/55',
      )}
      onDragOver={(e) => { e.preventDefault(); onDragOver(square) }}
      onDragLeave={onDragLeave}
      onDrop={(e) => { e.preventDefault(); onDrop(square) }}
      onClick={() => onClick(square)}
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
