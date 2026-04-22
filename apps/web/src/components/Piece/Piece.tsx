import { cn } from '~/lib/utils'
import type { Piece as PieceData, Square } from '@frontline/rules'
import { CommanderSvg, GuardSvg, CannonSvg, StrikerSvg, FlankerSvg, WarlordSvg } from './PieceSvgs'
import { PIECE_COLORS } from './pieceColors'

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
      className={cn(
        'w-full h-full flex items-center justify-center cursor-grab select-none p-[4%]',
        'active:cursor-grabbing transition-transform duration-100',
        '[&_svg]:w-full [&_svg]:h-full [&_svg]:drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)] [&_svg]:transition-all [&_svg]:duration-100',
        isSelected && 'piece-selected'
      )}
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
      {piece.type === 'guard' && <GuardSvg {...svgProps} />}
      {piece.type === 'cannon' && <CannonSvg {...svgProps} />}
      {piece.type === 'striker' && <StrikerSvg {...svgProps} />}
      {piece.type === 'flanker' && <FlankerSvg {...svgProps} />}
      {piece.type === 'warlord' && <WarlordSvg {...svgProps} />}
    </div>
  )
}
