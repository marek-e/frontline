import { cn } from '~/lib/utils'
import type { Color, PieceType, GameAction } from '@frontline/rules'
import { PIECE_VALUES } from '@frontline/rules'
import { CannonSvg, StrikerSvg, FlankerSvg, WarlordSvg } from '../Piece/PieceSvgs'
import { PIECE_COLORS } from '../Piece/pieceColors'

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
    <div className="w-11 h-11 [&_svg]:w-full [&_svg]:h-full">
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
  const factionBorder = color === 'red' ? 'border-t-red-faction' : 'border-t-blue-faction'
  const choiceHover   = color === 'red'
    ? 'hover:border-red-faction hover:bg-red-faction/8'
    : 'hover:border-blue-faction hover:bg-blue-faction/8'

  return (
    <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-[200] animate-in fade-in duration-150">
      <div className={cn(
        'bg-card rounded-2xl px-8 py-7 text-center shadow-lg min-w-[340px]',
        'animate-in slide-in-from-bottom-5 duration-200',
        'border-t-[6px]',
        factionBorder,
      )}>
        <div className="text-[18px] font-black tracking-[2px] mb-1 text-foreground">
          PROMOTE GUARD
        </div>
        <div className="text-[12px] text-fg-muted mb-5 tracking-[0.5px]">
          Choose a piece to promote to
        </div>

        <div className="flex gap-2.5 justify-center">
          {CHOICES.map((type) => (
            <button
              key={type}
              className={cn(
                'flex flex-col items-center gap-1.5 px-3.5 py-3 rounded-xl',
                'border-2 border-transparent bg-muted/40 cursor-pointer transition-all min-w-[72px]',
                choiceHover,
              )}
              onClick={() => dispatch({ type: 'PROMOTE', pieceType: type })}
            >
              <PieceIcon type={type} color={color} />
              <span className="text-[11px] font-bold text-foreground tracking-[0.5px]">
                {LABELS[type]}
              </span>
              <span className="text-[10px] font-semibold text-board-dark">
                {PIECE_VALUES[type]} pts
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
