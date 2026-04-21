import { useState } from 'react'
import type { Color, GamePhase, Piece, PieceType, Square, GameAction } from '@frontline/rules'
import { PIECE_VALUES } from '@frontline/rules'
import { CommanderSvg, GuardSvg, CannonSvg, StrikerSvg, FlankerSvg, WarlordSvg } from '../Piece/PieceSvgs'
import { PIECE_COLORS } from '../Piece/pieceColors'
import './GameInfo.css'

interface Props {
  turn: Color
  phase: GamePhase
  inCheck: boolean
  warlordPursuit: Square | null
  capturedByRed: Piece[]
  capturedByBlue: Piece[]
  dispatch: (action: GameAction) => void
}

// ─── Piece legend data ────────────────────────────────────────────────────────

interface PieceInfo {
  name: string
  move: string
  capture?: string
  special?: string
}

const PIECE_INFO: Record<PieceType, PieceInfo> = {
  commander: {
    name: 'Commander',
    move: '1 square in any direction',
    special: 'Game lost if captured · Can swap with unmoved Cannon',
  },
  guard: {
    name: 'Guard',
    move: 'Forward or backward 1 square (non-capturing)',
    capture: 'Diagonally in all 4 directions',
    special: 'Double-step on first move · En passant · Promotes to Cannon on back rank',
  },
  cannon: {
    name: 'Cannon',
    move: 'Any distance orthogonally',
    capture: 'Same as movement — stops on first enemy',
  },
  striker: {
    name: 'Striker',
    move: '1–3 squares diagonally, or 1 square orthogonally',
    capture: 'Same as movement',
  },
  flanker: {
    name: 'Flanker',
    move: 'Jumps exactly 2 steps away in any direction (16 targets)',
    capture: 'Same — leaps over pieces',
  },
  warlord: {
    name: 'Warlord',
    move: '1–3 squares in any direction (no jumping)',
    capture: 'Same as movement',
    special: 'After capturing: may move 1 extra square (no second capture)',
  },
}

const PIECE_ORDER: PieceType[] = ['commander', 'warlord', 'cannon', 'striker', 'flanker', 'guard']

function PieceIcon({ type, color }: { type: PieceType; color: Color }) {
  const { fill, stroke } = PIECE_COLORS[color]
  const p = { fill, stroke }
  return (
    <div className="legend-icon">
      {type === 'commander' && <CommanderSvg {...p} />}
      {type === 'guard'     && <GuardSvg     {...p} />}
      {type === 'cannon'    && <CannonSvg    {...p} />}
      {type === 'striker'   && <StrikerSvg   {...p} />}
      {type === 'flanker'   && <FlankerSvg   {...p} />}
      {type === 'warlord'   && <WarlordSvg   {...p} />}
    </div>
  )
}

function PieceLegend({ turn }: { turn: Color }) {
  const [hovered, setHovered] = useState<PieceType | null>(null)

  return (
    <div className="piece-legend">
      {PIECE_ORDER.map(type => {
        const info = PIECE_INFO[type]
        const isHovered = hovered === type
        return (
          <div
            key={type}
            className={`legend-row${isHovered ? ' legend-row--active' : ''}`}
            onMouseEnter={() => setHovered(type)}
            onMouseLeave={() => setHovered(null)}
          >
            <PieceIcon type={type} color={turn} />
            <span className="legend-name">{info.name}</span>
            <span className="legend-value">
              {isFinite(PIECE_VALUES[type]) ? PIECE_VALUES[type] : '∞'}
            </span>

            {isHovered && (
              <div className="legend-tooltip">
                <div className="legend-tooltip__header">
                  <span className="legend-tooltip__title">{info.name}</span>
                  <span className="legend-tooltip__value">
                    {isFinite(PIECE_VALUES[type]) ? `${PIECE_VALUES[type]} pts` : '∞'}
                  </span>
                </div>
                <div className="legend-tooltip__row">
                  <span className="legend-tooltip__label">Move</span>
                  <span>{info.move}</span>
                </div>
                {info.capture && (
                  <div className="legend-tooltip__row">
                    <span className="legend-tooltip__label">Capture</span>
                    <span>{info.capture}</span>
                  </div>
                )}
                {info.special && (
                  <div className="legend-tooltip__row legend-tooltip__row--special">
                    <span>{info.special}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Captured pieces ──────────────────────────────────────────────────────────

const PIECE_SYMBOLS: Record<PieceType, string> = {
  commander: '♔', warlord: '✦', cannon: '⊕', striker: '↑', flanker: '◈', guard: '♟',
}

function CapturedList({ pieces, label, color }: { pieces: Piece[]; label: string; color: Color }) {
  if (pieces.length === 0) return null
  const counts: Partial<Record<PieceType, number>> = {}
  for (const p of pieces) counts[p.type] = (counts[p.type] ?? 0) + 1

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

// ─── Main component ───────────────────────────────────────────────────────────

export function GameInfo({ turn, phase, inCheck, warlordPursuit, capturedByRed, capturedByBlue, dispatch }: Props) {
  const isPlaying = phase === 'playing'

  return (
    <div className="game-info">
      <div className="game-info__title">FRONTLINE</div>

      {isPlaying && !warlordPursuit && (
        <div className={`turn-indicator turn-indicator--${turn}`}>
          <div className="turn-indicator__dot" />
          <span>{turn.toUpperCase()}'S TURN</span>
        </div>
      )}

      {isPlaying && inCheck && !warlordPursuit && (
        <div className={`check-alert check-alert--${turn}`}>⚠ CHECK</div>
      )}

      {isPlaying && warlordPursuit && (
        <div className={`pursuit-alert pursuit-alert--${turn}`}>
          <div className="pursuit-alert__title">⚔ WARLORD PURSUES</div>
          <div className="pursuit-alert__sub">Move 1 square or skip</div>
          <button className="pursuit-alert__skip" onClick={() => dispatch({ type: 'SKIP_PURSUIT' })}>
            Skip pursuit
          </button>
        </div>
      )}

      <div className="game-info__captures">
        <CapturedList pieces={capturedByRed}  label="Red captured:"  color="red" />
        <CapturedList pieces={capturedByBlue} label="Blue captured:" color="blue" />
      </div>

      <PieceLegend turn={turn} />
    </div>
  )
}
