import { useState } from 'react'
import { cn } from '~/lib/utils'
import type { Color, GamePhase, Piece, PieceType, Square, GameAction } from '@frontline/rules'
import { PIECE_VALUES } from '@frontline/rules'
import {
  CommanderSvg, GuardSvg, CannonSvg, StrikerSvg, FlankerSvg, WarlordSvg,
} from '../Piece/PieceSvgs'
import { PIECE_COLORS } from '../Piece/pieceColors'

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function PieceIcon({ type, color }: { type: PieceType; color: Color }) {
  const { fill, stroke } = PIECE_COLORS[color]
  const p = { fill, stroke }
  return (
    <div className="w-7 h-7 shrink-0 [&_svg]:w-full [&_svg]:h-full">
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
    <div className="flex flex-col gap-0.5 pt-2.5 border-t border-border">
      {PIECE_ORDER.map((type) => {
        const info = PIECE_INFO[type]
        const isHovered = hovered === type
        return (
          <div
            key={type}
            className={cn(
              'relative flex items-center gap-2 px-1.5 py-1 rounded-md cursor-default transition-colors',
              isHovered ? 'bg-muted' : 'hover:bg-muted/60',
            )}
            onMouseEnter={() => setHovered(type)}
            onMouseLeave={() => setHovered(null)}
          >
            <PieceIcon type={type} color={turn} />
            <span className="text-[12px] font-semibold text-foreground whitespace-nowrap flex-1">
              {info.name}
            </span>
            <span className="text-[11px] font-bold text-board-dark min-w-4 text-right">
              {isFinite(PIECE_VALUES[type]) ? PIECE_VALUES[type] : '∞'}
            </span>

            {isHovered && (
              <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 w-[220px] bg-popover text-popover-foreground rounded-xl px-3.5 py-3 shadow-lg z-50 pointer-events-none animate-in fade-in slide-in-from-left-1 duration-150">
                {/* Arrow */}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-[7px] border-transparent border-r-popover" />

                <div className="flex justify-between items-baseline mb-2 pb-1.5 border-b border-border">
                  <span className="text-[13px] font-extrabold tracking-[1px] uppercase text-board-light">
                    {info.name}
                  </span>
                  <span className="text-[12px] font-bold text-board-dark">
                    {isFinite(PIECE_VALUES[type]) ? `${PIECE_VALUES[type]} pts` : '∞'}
                  </span>
                </div>

                <div className="flex flex-col gap-1 mt-1.5 text-[11.5px] leading-relaxed text-muted-foreground">
                  <div className="flex flex-col gap-px">
                    <span className="text-[10px] font-bold uppercase tracking-[0.8px] text-board-dark">Move</span>
                    <span>{info.move}</span>
                  </div>
                  {info.capture && (
                    <div className="flex flex-col gap-px">
                      <span className="text-[10px] font-bold uppercase tracking-[0.8px] text-board-dark">Capture</span>
                      <span>{info.capture}</span>
                    </div>
                  )}
                  {info.special && (
                    <div className="mt-1.5 pt-1.5 border-t border-border text-gold text-[11px] italic">
                      {info.special}
                    </div>
                  )}
                </div>
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
    <div className="flex flex-col gap-0.5">
      <span className={cn(
        'text-[10px] font-bold uppercase tracking-[0.5px]',
        color === 'red' ? 'text-red-faction' : 'text-blue-faction',
      )}>
        {label}
      </span>
      <span className="flex flex-wrap gap-1">
        {(Object.entries(counts) as [PieceType, number][]).map(([type, count]) => (
          <span key={type} className="text-[14px] text-foreground">
            {PIECE_SYMBOLS[type]}{count > 1 ? `×${count}` : ''}
          </span>
        ))}
      </span>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function GameInfo({
  turn,
  phase,
  inCheck,
  warlordPursuit,
  capturedByRed,
  capturedByBlue,
  dispatch,
}: Props) {
  const isPlaying = phase === 'playing'

  return (
    <div className="flex flex-col gap-3.5 min-w-40">
      <div className="text-[22px] font-extrabold tracking-[4px] text-foreground">
        FRONTLINE
      </div>

      {isPlaying && !warlordPursuit && (
        <div className={cn(
          'flex items-center gap-2 font-bold text-[13px] tracking-[1.5px]',
          turn === 'red' ? 'text-red-faction' : 'text-blue-faction',
        )}>
          <div className={cn(
            'w-3 h-3 rounded-full shrink-0',
            turn === 'red'
              ? 'bg-red-faction shadow-[0_0_8px_var(--color-red-faction-glow)]'
              : 'bg-blue-faction shadow-[0_0_8px_var(--color-blue-faction-glow)]',
          )} />
          <span>{turn.toUpperCase()}'S TURN</span>
        </div>
      )}

      {isPlaying && inCheck && !warlordPursuit && (
        <div className={cn(
          'text-[13px] font-black tracking-[2px] px-2.5 py-1.5 rounded-md animate-alert',
          turn === 'red'
            ? 'text-red-faction bg-red-faction/10 border border-red-faction/40'
            : 'text-blue-faction bg-blue-faction/10 border border-blue-faction/40',
        )}>
          ⚠ CHECK
        </div>
      )}

      {isPlaying && warlordPursuit && (
        <div className={cn(
          'flex flex-col gap-1.5 px-3 py-2.5 rounded-lg animate-alert',
          turn === 'red'
            ? 'bg-red-faction/8 border border-red-faction/35'
            : 'bg-blue-faction/8 border border-blue-faction/35',
        )}>
          <div className={cn(
            'font-black text-[12px] tracking-[1px]',
            turn === 'red' ? 'text-red-faction' : 'text-blue-faction',
          )}>
            ⚔ WARLORD PURSUES
          </div>
          <div className="text-[11px] text-fg-subtle">Move 1 square or skip</div>
          <button
            className={cn(
              'mt-1 px-2.5 py-1 rounded border border-current bg-transparent',
              'text-[11px] font-bold cursor-pointer transition-opacity hover:opacity-70',
              turn === 'red' ? 'text-red-faction' : 'text-blue-faction',
            )}
            onClick={() => dispatch({ type: 'SKIP_PURSUIT' })}
          >
            Skip pursuit
          </button>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <CapturedList pieces={capturedByRed}  label="Red captured:"  color="red"  />
        <CapturedList pieces={capturedByBlue} label="Blue captured:" color="blue" />
      </div>

      <PieceLegend turn={turn} />
    </div>
  )
}
