import type { Board, Color, GameState, PieceType, RoundState, Square, TurnEntry } from './types'
import { createInitialBoard } from './constants'
import { getLegalMoves } from './moves'
import { gameReducer } from './gameReducer'

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const

export class FgnError extends Error {
  name = 'FgnError'
}

function squareToCoord(s: Square): string {
  return `${FILES[s.col]}${8 - s.row}`
}

function coordToSquare(coord: string): Square {
  const file = coord[0]
  const rank = coord[1]
  const col = FILES.indexOf(file as (typeof FILES)[number])
  const row = 8 - Number(rank)
  if (col < 0 || !Number.isInteger(row) || row < 0 || row > 7)
    throw new FgnError(`Bad coord: ${coord}`)
  return { row, col }
}

const PIECE_TO_LETTER: Record<PieceType, string> = {
  commander: 'K',
  warlord: 'W',
  cannon: 'C',
  striker: 'S',
  flanker: 'F',
  guard: '',
}

const LETTER_TO_PIECE: Record<string, Exclude<PieceType, 'guard'>> = {
  K: 'commander',
  W: 'warlord',
  C: 'cannon',
  S: 'striker',
  F: 'flanker',
}

function other(color: Color): Color {
  return color === 'red' ? 'blue' : 'red'
}

function buildInitialRound(startingTurn: Color): RoundState {
  return {
    board: createInitialBoard(),
    turn: startingTurn,
    startingTurn,
    capturedByRed: [],
    capturedByBlue: [],
    moveHistory: [],
    turnLog: [],
    phase: 'playing',
    winner: null,
    movedPieceIds: [],
    enPassantTarget: null,
    inCheck: false,
    warlordPursuit: null,
    pendingPromotion: null,
  }
}

function buildInitialState(format: 3 | 5, startingTurn: Color): GameState {
  return {
    round: buildInitialRound(startingTurn),
    match: {
      format,
      roundScores: [],
      redMatchPoints: 0,
      blueMatchPoints: 0,
      roundWins: { red: 0, blue: 0 },
      matchWinner: null,
    },
    undoStack: [],
  }
}

function disambiguation(
  board: Board,
  mover: Color,
  pieceType: PieceType,
  from: Square,
  to: Square,
  movedPieceIds: string[],
  enPassantTarget: Square | null
): string {
  if (pieceType === 'guard') return ''
  const ctx = { movedPieceIds, enPassantTarget }

  const candidates: Square[] = []
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (row === from.row && col === from.col) continue
      const p = board[row]![col]
      if (!p || p.color !== mover || p.type !== pieceType) continue
      const legal = getLegalMoves(board, { row, col }, ctx)
      if (legal.some((sq) => sq.row === to.row && sq.col === to.col)) candidates.push({ row, col })
    }
  }

  if (candidates.length === 0) return ''

  const fromFile = FILES[from.col]
  const fromRank = `${8 - from.row}`

  const sameFile = candidates.some((sq) => sq.col === from.col)
  if (!sameFile) return fromFile

  const sameRank = candidates.some((sq) => sq.row === from.row)
  if (!sameRank) return fromRank

  return `${fromFile}${fromRank}`
}

export function moveToSAN(pre: RoundState, entry: TurnEntry): string {
  const move = entry.primary

  const suffix = entry.checkmate ? '#' : entry.check ? '+' : ''

  if (move.isSwap) {
    const base = move.to.col === 0 ? 'O-O' : 'O-O-O'
    return `${base}${suffix}`
  }

  const pieceLetter = PIECE_TO_LETTER[move.piece.type]
  const to = squareToCoord(move.to)
  const capture = move.capturedPiece || move.isEnPassant ? 'x' : ''

  const dis = disambiguation(
    pre.board,
    move.piece.color,
    move.piece.type,
    move.from,
    move.to,
    pre.movedPieceIds,
    pre.enPassantTarget
  )

  let body = ''
  if (move.piece.type === 'guard') {
    if (capture) body = `${FILES[move.from.col]}x${to}`
    else body = to
  } else {
    body = `${pieceLetter}${dis}${capture}${to}`
  }

  if (entry.promotion) body += `=${PIECE_TO_LETTER[entry.promotion]}`
  if (entry.pursuit && entry.pursuit !== 'skip') body += `~${squareToCoord(entry.pursuit.to)}`
  if (move.isEnPassant) body += ' e.p.'

  return `${body}${suffix}`
}

function applyTurnEntry(state: GameState, entry: TurnEntry): GameState {
  let s = state
  s = gameReducer(s, { type: 'MOVE_PIECE', from: entry.primary.from, to: entry.primary.to })
  if (s.round.pendingPromotion) {
    if (!entry.promotion) throw new FgnError('Missing promotion metadata while replaying')
    s = gameReducer(s, { type: 'PROMOTE', pieceType: entry.promotion })
  }
  if (s.round.warlordPursuit) {
    if (!entry.pursuit) throw new FgnError('Missing pursuit metadata while replaying')
    if (entry.pursuit === 'skip') s = gameReducer(s, { type: 'SKIP_PURSUIT' })
    else s = gameReducer(s, { type: 'WARLORD_PURSUE', to: entry.pursuit.to })
  }
  return s
}

export function toFGN(state: GameState, tags: Record<string, string> = {}): string {
  const lines: string[] = []
  const allTags: Record<string, string> = { ...tags }

  for (const [k, v] of Object.entries(allTags)) {
    lines.push(`[${k} "${String(v).replaceAll('"', '\\"')}"]`)
  }

  const format = state.match.format
  let replay = buildInitialState(format, state.round.startingTurn)

  const parts: string[] = []
  let fullmove = 1
  let side: Color = replay.round.startingTurn

  for (const entry of state.round.turnLog) {
    const san = moveToSAN(replay.round, entry)

    if (side === 'red') parts.push(`${fullmove}. ${san}`)
    else parts.push(`${fullmove}... ${san}`)

    replay = applyTurnEntry(replay, entry)
    side = other(side)
    if (entry.color === 'blue') fullmove++
  }

  if (parts.length > 0) lines.push(parts.join(' '))
  return lines.join('\n') + '\n'
}

export function parseFGN(fgn: string): { tags: Record<string, string>; tokens: string[] } {
  const tags: Record<string, string> = {}
  const tokens: string[] = []

  const rawLines = fgn.replaceAll('\r\n', '\n').split('\n')
  for (const line of rawLines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      const m = /^\[(\w+)\s+"(.*)"\]$/.exec(trimmed)
      if (!m) throw new FgnError(`Bad tag line: ${trimmed}`)
      const [, key, raw] = m
      tags[key] = raw.replaceAll('\\"', '"')
      continue
    }

    for (const tok of trimmed.split(/\s+/g)) {
      if (!tok) continue
      if (/^\d+\.(\.\.)?$/.test(tok)) continue // "1." or "1..."
      if (/^\d+\.\.\.$/.test(tok)) continue // defensive
      tokens.push(tok)
    }
  }

  return { tags, tokens }
}

function findFromSquareForToken(
  round: RoundState,
  pieceType: PieceType,
  to: Square,
  disFile: string | null,
  disRank: string | null
): Square {
  const ctx = { movedPieceIds: round.movedPieceIds, enPassantTarget: round.enPassantTarget }
  const candidates: Square[] = []

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const p = round.board[row]![col]
      if (!p || p.color !== round.turn || p.type !== pieceType) continue
      const file = FILES[col]
      const rank = `${8 - row}`
      if (disFile && disFile !== file) continue
      if (disRank && disRank !== rank) continue

      const legal = getLegalMoves(round.board, { row, col }, ctx)
      if (legal.some((sq) => sq.row === to.row && sq.col === to.col)) candidates.push({ row, col })
    }
  }

  if (candidates.length !== 1) {
    throw new FgnError(
      `Ambiguous/illegal move to ${squareToCoord(to)} for ${round.turn} ${pieceType} (${candidates.length} candidates)`
    )
  }
  return candidates[0]!
}

function applyToken(state: GameState, token: string): GameState {
  const round = state.round
  if (round.phase !== 'playing') return state

  let t = token
  // strip check suffix (we don't validate it during parse)
  if (t.endsWith('#') || t.endsWith('+')) t = t.slice(0, -1)

  // en passant suffix
  const ep = t.endsWith(' e.p.')
  if (ep) t = t.slice(0, -' e.p.'.length)

  // pursuit suffix
  let pursuitCoord: string | null = null
  const tildeIdx = t.indexOf('~')
  if (tildeIdx !== -1) {
    pursuitCoord = t.slice(tildeIdx + 1)
    t = t.slice(0, tildeIdx)
  }

  // promotion suffix
  let promotion: Exclude<PieceType, 'guard' | 'commander'> | null = null
  const promoIdx = t.indexOf('=')
  if (promoIdx !== -1) {
    const letter = t.slice(promoIdx + 1)
    const pt = LETTER_TO_PIECE[letter]
    if (!pt || pt === 'commander') throw new FgnError(`Bad promotion: ${token}`)
    promotion = pt as Exclude<PieceType, 'guard' | 'commander'>
    t = t.slice(0, promoIdx)
  }

  if (t === 'O-O' || t === 'O-O-O') {
    const commanderSq = (() => {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const p = round.board[row]![col]
          if (p?.type === 'commander' && p.color === round.turn) return { row, col }
        }
      }
      return null
    })()
    if (!commanderSq) throw new FgnError('No commander found for swap')
    const to = { row: commanderSq.row, col: t === 'O-O' ? 0 : 7 }
    let s = gameReducer(state, { type: 'MOVE_PIECE', from: commanderSq, to })
    if (s.round.pendingPromotion || s.round.warlordPursuit)
      throw new FgnError('Unexpected followup after swap')
    return s
  }

  const dest = t.slice(-2)
  const to = coordToSquare(dest)
  const beforeDest = t.slice(0, -2)

  let pieceType: PieceType = 'guard'
  let rest = beforeDest
  const first = rest[0]
  if (first && LETTER_TO_PIECE[first]) {
    pieceType = LETTER_TO_PIECE[first] as PieceType
    rest = rest.slice(1)
  }

  const captureIdx = rest.indexOf('x')
  const isCapture = captureIdx !== -1
  const dis = isCapture ? rest.slice(0, captureIdx) : rest

  let disFile: string | null = null
  let disRank: string | null = null

  if (pieceType === 'guard') {
    // pawn-like: file disambiguation is only written on captures (e.g. dxe6)
    if (isCapture) disFile = dis[0] ?? null
  } else {
    for (const ch of dis) {
      if (FILES.includes(ch as any)) disFile = ch
      else if (/[1-8]/.test(ch)) disRank = ch
    }
  }

  const from = findFromSquareForToken(round, pieceType, to, disFile, disRank)
  let s = gameReducer(state, { type: 'MOVE_PIECE', from, to })

  if (s.round.pendingPromotion) {
    if (!promotion) throw new FgnError(`Missing promotion for token: ${token}`)
    s = gameReducer(s, { type: 'PROMOTE', pieceType: promotion })
  }

  if (s.round.warlordPursuit) {
    if (pursuitCoord)
      s = gameReducer(s, { type: 'WARLORD_PURSUE', to: coordToSquare(pursuitCoord) })
    else s = gameReducer(s, { type: 'SKIP_PURSUIT' })
  }

  // basic sanity: en passant suffix should only appear if reducer marked it so
  if (ep && !s.round.moveHistory.at(-1)?.isEnPassant && !s.round.moveHistory.at(-2)?.isEnPassant) {
    // don't hard-fail on this; notation might be ahead of state semantics
  }

  return s
}

export function replayFGN(fgn: string, format: 3 | 5 = 3): GameState {
  const { tokens } = parseFGN(fgn)
  let state = buildInitialState(format, 'red')
  for (const tok of tokens) state = applyToken(state, tok)
  return state
}

export function replayTurns(initial: GameState, turnLog: TurnEntry[], n: number): GameState {
  let s = initial
  for (let i = 0; i < n && i < turnLog.length; i++) s = applyTurnEntry(s, turnLog[i]!)
  return s
}
