import type { Color, PieceType, GameAction } from '@frontline/rules'
import { PIECE_VALUES } from '@frontline/rules'
import { CannonSvg, StrikerSvg, FlankerSvg, WarlordSvg } from '../Piece/PieceSvgs'
import { PIECE_COLORS } from '../Piece/pieceColors'
import './PromotionPicker.css'

type PromotablePiece = Exclude<PieceType, 'commander' | 'guard'>

const CHOICES: PromotablePiece[] = ['warlord', 'cannon', 'striker', 'flanker']

const LABELS: Record<PromotablePiece, string> = {
  warlord: 'Warlord',
  cannon: 'Cannon',
  striker: 'Striker',
  flanker: 'Flanker',
}

function PieceIcon({ type, color }: { type: PromotablePiece; color: Color }) {
  const { fill, stroke } = PIECE_COLORS[color]
  const p = { fill, stroke }
  return (
    <div className="promotion-picker__icon">
      {type === 'cannon'  && <CannonSvg  {...p} />}
      {type === 'striker' && <StrikerSvg {...p} />}
      {type === 'flanker' && <FlankerSvg {...p} />}
      {type === 'warlord' && <WarlordSvg {...p} />}
    </div>
  )
}

interface Props {
  color: Color
  dispatch: (action: GameAction) => void
}

export function PromotionPicker({ color, dispatch }: Props) {
  return (
    <div className="promotion-backdrop">
      <div className={`promotion-modal promotion-modal--${color}`}>
        <div className="promotion-modal__title">PROMOTE GUARD</div>
        <div className="promotion-modal__sub">Choose a piece to promote to</div>
        <div className="promotion-modal__choices">
          {CHOICES.map(type => (
            <button
              key={type}
              className="promotion-choice"
              onClick={() => dispatch({ type: 'PROMOTE', pieceType: type })}
            >
              <PieceIcon type={type} color={color} />
              <span className="promotion-choice__name">{LABELS[type]}</span>
              <span className="promotion-choice__value">{PIECE_VALUES[type]} pts</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
