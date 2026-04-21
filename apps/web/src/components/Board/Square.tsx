import type { Piece as PieceData, Square as SquareType } from '@frontline/rules'
import { Piece } from '../Piece/Piece'
import './Square.css'

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
  square, piece, isLight, isSelected, isLegalMove, isCaptureTarget, isSwapTarget, isChecked, isDragOver,
  onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop, onClick,
}: Props) {
  const classes = [
    'square',
    isLight ? 'square--light' : 'square--dark',
    isChecked ? 'square--checked' : '',
    isSelected ? 'square--selected' : '',
    isLegalMove && !isCaptureTarget && !isSwapTarget ? 'square--legal' : '',
    isCaptureTarget ? 'square--capture' : '',
    isSwapTarget ? 'square--swap' : '',
    isDragOver ? 'square--drag-over' : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
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
      {isLegalMove && !piece && <div className="square__dot" />}
    </div>
  )
}
