import type { Color, GamePhase, Piece } from '../../game/types'
import type { PieceType } from '../../game/types'
import './GameInfo.css'

interface Props {
  turn: Color
  phase: GamePhase
  inCheck: boolean
  capturedByRed: Piece[]
  capturedByBlue: Piece[]
}

const PIECE_SYMBOLS: Record<PieceType, string> = {
  commander: '♔',
  captain:   '✦',
  rook:      '♜',
  bishop:    '♝',
  knight:    '♞',
  guard:     '♟',
}

function CapturedList({ pieces, label, color }: { pieces: Piece[]; label: string; color: Color }) {
  if (pieces.length === 0) return null

  const counts: Partial<Record<PieceType, number>> = {}
  for (const p of pieces) {
    counts[p.type] = (counts[p.type] ?? 0) + 1
  }

  return (
    <div className={`captured captured--${color}`}>
      <span className="captured__label">{label}</span>
      <span className="captured__pieces">
        {(Object.entries(counts) as [PieceType, number][]).map(([type, count]) => (
          <span key={type} className="captured__item">
            {PIECE_SYMBOLS[type]}{count > 1 ? `×${count}` : ''}
          </span>
        ))}
      </span>
    </div>
  )
}

export function GameInfo({ turn, phase, inCheck, capturedByRed, capturedByBlue }: Props) {
  const isPlaying = phase === 'playing'

  return (
    <div className="game-info">
      <div className="game-info__title">FRONTLINE</div>

      {isPlaying && (
        <div className={`turn-indicator turn-indicator--${turn}`}>
          <div className="turn-indicator__dot" />
          <span>{turn.toUpperCase()}'S TURN</span>
        </div>
      )}

      {isPlaying && inCheck && (
        <div className={`check-alert check-alert--${turn}`}>
          ⚠ CHECK
        </div>
      )}

      <div className="game-info__captures">
        <CapturedList pieces={capturedByRed}  label="Red captured:"  color="red" />
        <CapturedList pieces={capturedByBlue} label="Blue captured:" color="blue" />
      </div>
    </div>
  )
}
