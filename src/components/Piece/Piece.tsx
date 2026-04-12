import type { Piece as PieceData } from '../../game/types'
import type { Square } from '../../game/types'
import './Piece.css'

interface Props {
  piece: PieceData
  isSelected: boolean
  onDragStart: (sq: Square) => void
  onDragEnd: () => void
  square: Square
}

// SVG paths — viewBox 0 0 45 45
function CommanderSvg({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
      {/* Crown */}
      <polygon points="22.5,6 28,16 38,10 34,22 11,22 7,10 17,16" fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="10" y="22" width="25" height="4" rx="1" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <rect x="9" y="26" width="27" height="7" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
    </svg>
  )
}

function GuardSvg({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22.5" cy="12" r="6" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <path d="M14,33 Q14,20 22.5,20 Q31,20 31,33 Z" fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="11" y="33" width="23" height="4" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
    </svg>
  )
}

function RookSvg({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
      {/* Battlements */}
      <rect x="9" y="8" width="5" height="7" rx="1" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <rect x="20" y="8" width="5" height="7" rx="1" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <rect x="31" y="8" width="5" height="7" rx="1" fill={fill} stroke={stroke} strokeWidth="1.5" />
      {/* Body */}
      <rect x="11" y="14" width="23" height="19" rx="1" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <rect x="9" y="33" width="27" height="4" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
    </svg>
  )
}

function BishopSvg({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22.5" cy="10" r="3.5" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <path d="M15,34 Q15,14 22.5,14 Q30,14 30,34 Z" fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="10" y="34" width="25" height="4" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
    </svg>
  )
}

function KnightSvg({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22,9 C16,9 12,13 12,18 C12,22 14,24 14,26 L14,33 L31,33 L31,26 C31,26 33,24 33,18 C33,13 29,9 22,9 Z"
        fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round"
      />
      {/* Horse ear / mane detail */}
      <path d="M18,9 C18,9 15,12 15,16" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="19" cy="14" r="1.5" fill={stroke} />
      <rect x="12" y="33" width="21" height="4" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
    </svg>
  )
}

function CaptainSvg({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
      {/* Diamond / star shape */}
      <polygon
        points="22.5,7 28,17 39,17 30,24 33,35 22.5,28 12,35 15,24 6,17 17,17"
        fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round"
      />
    </svg>
  )
}

const COLORS = {
  red:  { fill: '#cc2200', stroke: '#7a0000' },
  blue: { fill: '#1155cc', stroke: '#0a2a66' },
}

export function Piece({ piece, isSelected, onDragStart, onDragEnd, square }: Props) {
  const { fill, stroke } = COLORS[piece.color]

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
      {piece.type === 'rook'      && <RookSvg      {...svgProps} />}
      {piece.type === 'bishop'    && <BishopSvg    {...svgProps} />}
      {piece.type === 'knight'    && <KnightSvg    {...svgProps} />}
      {piece.type === 'captain'   && <CaptainSvg   {...svgProps} />}
    </div>
  )
}
