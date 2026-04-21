import type { Board, Color, Move, Square } from './types'
import { getPiece, isInBounds, applyMove, findPiece } from './board'

const DIAGONALS = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
] as const
const ORTHOGONALS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
] as const
const ALL_DIRS = [...DIAGONALS, ...ORTHOGONALS] as const

// Flanker: all squares at Chebyshev distance exactly 2
// (outer ring of a 5×5 area: 16 squares)
const FLANKER_OFFSETS: [number, number][] = []
for (let dr = -2; dr <= 2; dr++) {
  for (let dc = -2; dc <= 2; dc++) {
    if (Math.max(Math.abs(dr), Math.abs(dc)) === 2) {
      FLANKER_OFFSETS.push([dr, dc])
    }
  }
}

export interface MoveContext {
  movedPieceIds: string[]
  enPassantTarget: Square | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isFriendly(board: Board, sq: Square, color: Color): boolean {
  const p = getPiece(board, sq)
  return p !== null && p.color === color
}

function isEnemy(board: Board, sq: Square, color: Color): boolean {
  const p = getPiece(board, sq)
  return p !== null && p.color !== color
}

// ─── Piece move generators (raw, no check filtering) ─────────────────────────

function getGuardMoves(
  board: Board,
  from: Square,
  color: Color,
  hasMoved: boolean,
  enPassantTarget: Square | null
): Square[] {
  const dir = color === 'red' ? -1 : 1
  const moves: Square[] = []

  // Forward (non-capturing)
  const fwd: Square = { row: from.row + dir, col: from.col }
  const fwdEmpty = isInBounds(fwd) && !getPiece(board, fwd)
  if (fwdEmpty) moves.push(fwd)

  // Double-step on first move
  if (!hasMoved && fwdEmpty) {
    const fwd2: Square = { row: from.row + dir * 2, col: from.col }
    if (isInBounds(fwd2) && !getPiece(board, fwd2)) moves.push(fwd2)
  }

  // Captures in ALL 4 diagonal directions
  for (const ddr of [-1, 1]) {
    for (const dc of [-1, 1]) {
      const sq: Square = { row: from.row + ddr, col: from.col + dc }
      if (!isInBounds(sq)) continue
      if (isEnemy(board, sq, color)) moves.push(sq)
      // En passant only applies to forward diagonal
      if (
        ddr === dir &&
        enPassantTarget &&
        sq.row === enPassantTarget.row &&
        sq.col === enPassantTarget.col
      ) {
        moves.push(sq)
      }
    }
  }

  // Backward retreat (non-capturing)
  const back: Square = { row: from.row - dir, col: from.col }
  if (isInBounds(back) && !getPiece(board, back)) moves.push(back)

  return moves
}

/**
 * Cannon: slides any number of squares orthogonally, captures on contact.
 * Standard rook movement.
 */
function getCannonMoves(board: Board, from: Square, color: Color): Square[] {
  const moves: Square[] = []
  for (const [dr, dc] of ORTHOGONALS) {
    let sq: Square = { row: from.row + dr, col: from.col + dc }
    while (isInBounds(sq)) {
      if (isFriendly(board, sq, color)) break
      moves.push(sq)
      if (isEnemy(board, sq, color)) break
      sq = { row: sq.row + dr, col: sq.col + dc }
    }
  }
  return moves
}

/**
 * Striker: diagonal slide 1–3 squares (limited range bishop),
 * plus a 1-square orthogonal step as an alternative move type.
 */
function getStrikerMoves(board: Board, from: Square, color: Color): Square[] {
  const moves: Square[] = []

  // Diagonal slides (max 3 squares, blocked by pieces)
  for (const [dr, dc] of DIAGONALS) {
    for (let dist = 1; dist <= 3; dist++) {
      const sq: Square = { row: from.row + dr * dist, col: from.col + dc * dist }
      if (!isInBounds(sq)) break
      if (isFriendly(board, sq, color)) break
      moves.push(sq)
      if (isEnemy(board, sq, color)) break
    }
  }

  // Orthogonal 1-step (the "stab")
  for (const [dr, dc] of ORTHOGONALS) {
    const sq: Square = { row: from.row + dr, col: from.col + dc }
    if (isInBounds(sq) && !isFriendly(board, sq, color)) moves.push(sq)
  }

  return moves
}

/**
 * Flanker: jumps to any square at Chebyshev distance exactly 2.
 * 16 possible target squares. Can jump over pieces.
 */
function getFlankerMoves(board: Board, from: Square, color: Color): Square[] {
  return FLANKER_OFFSETS.map(([dr, dc]) => ({ row: from.row + dr, col: from.col + dc })).filter(
    (sq) => isInBounds(sq) && !isFriendly(board, sq, color)
  )
}

/**
 * Warlord: 1–3 squares in any direction, cannot jump.
 * After capturing, the reducer grants a 1-square pursuit step (handled separately).
 */
function getWarlordMoves(board: Board, from: Square, color: Color): Square[] {
  const moves: Square[] = []
  for (const [dr, dc] of ALL_DIRS) {
    for (let dist = 1; dist <= 3; dist++) {
      const sq: Square = { row: from.row + dr * dist, col: from.col + dc * dist }
      if (!isInBounds(sq)) break
      if (isFriendly(board, sq, color)) break
      moves.push(sq)
      if (isEnemy(board, sq, color)) break
    }
  }
  return moves
}

function getCommanderMoves(
  board: Board,
  from: Square,
  color: Color,
  commanderHasMoved: boolean,
  movedPieceIds: string[]
): Square[] {
  const moves: Square[] = []

  for (const [dr, dc] of ALL_DIRS) {
    const sq: Square = { row: from.row + dr, col: from.col + dc }
    if (isInBounds(sq) && !isFriendly(board, sq, color)) moves.push(sq)
  }

  // Swap with unmoved friendly cannon on same row, clear path
  if (!commanderHasMoved) {
    for (let col = 0; col < 8; col++) {
      if (col === from.col) continue
      const target: Square = { row: from.row, col }
      const piece = getPiece(board, target)
      if (!piece || piece.color !== color || piece.type !== 'cannon') continue
      if (movedPieceIds.includes(piece.id)) continue
      const step = col > from.col ? 1 : -1
      let blocked = false
      for (let c = from.col + step; c !== col; c += step) {
        if (getPiece(board, { row: from.row, col: c })) {
          blocked = true
          break
        }
      }
      if (!blocked) moves.push(target)
    }
  }

  return moves
}

// ─── Raw move dispatcher ─────────────────────────────────────────────────────

function getRawMoves(board: Board, from: Square, ctx: MoveContext): Square[] {
  const piece = getPiece(board, from)
  if (!piece) return []
  const hasMoved = ctx.movedPieceIds.includes(piece.id)

  switch (piece.type) {
    case 'guard':
      return getGuardMoves(board, from, piece.color, hasMoved, ctx.enPassantTarget)
    case 'cannon':
      return getCannonMoves(board, from, piece.color)
    case 'striker':
      return getStrikerMoves(board, from, piece.color)
    case 'flanker':
      return getFlankerMoves(board, from, piece.color)
    case 'warlord':
      return getWarlordMoves(board, from, piece.color)
    case 'commander':
      return getCommanderMoves(board, from, piece.color, hasMoved, ctx.movedPieceIds)
  }
}

// ─── Check detection ─────────────────────────────────────────────────────────

export function isInCheck(board: Board, color: Color, ctx: MoveContext): boolean {
  const commanderSq = findPiece(board, (p) => p.type === 'commander' && p.color === color)
  if (!commanderSq) return false

  const opponent: Color = color === 'red' ? 'blue' : 'red'
  const rawCtx: MoveContext = { movedPieceIds: ctx.movedPieceIds, enPassantTarget: null }

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const p = board[row][col]
      if (!p || p.color !== opponent) continue
      const moves = getRawMoves(board, { row, col }, rawCtx)
      if (moves.some((sq) => sq.row === commanderSq.row && sq.col === commanderSq.col)) return true
    }
  }
  return false
}

export function hasNoLegalMoves(board: Board, color: Color, ctx: MoveContext): boolean {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const p = board[row][col]
      if (!p || p.color !== color) continue
      if (getLegalMoves(board, { row, col }, ctx).length > 0) return false
    }
  }
  return true
}

// ─── Warlord pursuit moves ────────────────────────────────────────────────────

/**
 * Returns the valid 1-square non-capturing steps the Warlord can take after a capture.
 * Check-filtered: can't pursue into a square that leaves own Commander in check.
 */
export function getWarlordPursuitMoves(
  board: Board,
  from: Square,
  color: Color,
  ctx: MoveContext
): Square[] {
  const piece = getPiece(board, from)
  if (!piece) return []

  return ALL_DIRS.map(([dr, dc]) => ({ row: from.row + dr, col: from.col + dc })).filter((to) => {
    if (!isInBounds(to)) return false
    if (getPiece(board, to)) return false // non-capturing only
    // Check-filter the pursuit step
    const move: Move = { from, to, piece, capturedPiece: null }
    const newBoard = applyMove(board, move)
    return !isInCheck(newBoard, color, ctx)
  })
}

// ─── Legal moves (check-filtered) ────────────────────────────────────────────

export function getLegalMoves(board: Board, from: Square, ctx: MoveContext): Square[] {
  const piece = getPiece(board, from)
  if (!piece) return []

  const raw = getRawMoves(board, from, ctx)

  return raw.filter((to) => {
    const targetPiece = getPiece(board, to)
    const isSwap =
      piece.type === 'commander' &&
      targetPiece?.color === piece.color &&
      targetPiece?.type === 'cannon'

    const isEnPassant =
      piece.type === 'guard' &&
      ctx.enPassantTarget !== null &&
      to.row === ctx.enPassantTarget.row &&
      to.col === ctx.enPassantTarget.col &&
      !targetPiece

    const dir = piece.color === 'red' ? -1 : 1
    const epCaptureSquare: Square | undefined = isEnPassant
      ? { row: to.row - dir, col: to.col }
      : undefined

    const move: Move = {
      from,
      to,
      piece,
      capturedPiece: isEnPassant
        ? epCaptureSquare
          ? getPiece(board, epCaptureSquare)
          : null
        : isSwap
          ? null
          : targetPiece,
      isEnPassant: isEnPassant || undefined,
      isSwap: isSwap || undefined,
      enPassantCaptureSquare: epCaptureSquare,
    }

    const newBoard = applyMove(board, move)
    const newMovedIds = ctx.movedPieceIds.includes(piece.id)
      ? ctx.movedPieceIds
      : [...ctx.movedPieceIds, piece.id]

    return !isInCheck(newBoard, piece.color, { movedPieceIds: newMovedIds, enPassantTarget: null })
  })
}
