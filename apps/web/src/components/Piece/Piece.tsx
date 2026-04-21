import type { Piece as PieceData, Square } from '@frontline/rules'
import { CommanderSvg, GuardSvg, CannonSvg, StrikerSvg, FlankerSvg, WarlordSvg } from './PieceSvgs'
import { PIECE_COLORS } from './pieceColors'
import './Piece.css'

interface Props {
  piece: PieceData
  isSelected: boolean
  onDragStart: (sq: Square) => void
  onDragEnd: () => void
  square: Square
}

export function Piece({ piece, isSelected, onDragStart, onDragEnd, square }: Props) {
  const { fill, stroke } = PIECE_COLORS[piece.color]
  const svgProps = { fill, stroke }

  return (
    <div
      className={`piece${isSelected ? ' piece--selected' : ''}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', JSON.stringify(square))
        onDragStart(square)
      }}
      onDragEnd={onDragEnd}
      title={`${piece.color} ${piece.type}`}
    >
      {piece.type === 'commander' && <CommanderSvg {...svgProps} />}
      {piece.type === 'guard'     && <GuardSvg     {...svgProps} />}
      {piece.type === 'cannon'    && <CannonSvg    {...svgProps} />}
      {piece.type === 'striker'   && <StrikerSvg   {...svgProps} />}
      {piece.type === 'flanker'   && <FlankerSvg   {...svgProps} />}
      {piece.type === 'warlord'   && <WarlordSvg   {...svgProps} />}
    </div>
  )
}
