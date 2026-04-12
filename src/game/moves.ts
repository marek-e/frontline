import type { Board, Color, Square } from './types'
import { getPiece, isInBounds, applyMove, findPiece } from './board'
import type { Move } from './types'

const DIAGONALS    = [[-1, -1], [-1, 1], [1, -1], [1, 1]] as const
const ORTHOGONALS  = [[-1, 0], [1, 0], [0, -1], [0, 1]] as const
const ALL_DIRS     = [...DIAGONALS, ...ORTHOGONALS] as const
const KNIGHT_OFFSETS = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]] as const

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

function slidingRay(board: Board, from: Square, color: Color, dirs: readonly (readonly [number, number])[]): Square[] {
  const moves: Square[] = []
  for (const [dr, dc] of dirs) {
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

// ─── Raw move generators (no check filtering) ────────────────────────────────

function getGuardMoves(
  board: Board, from: Square, color: Color,
  hasMoved: boolean, enPassantTarget: Square | null,
): Square[] {
  const dir = color === 'red' ? -1 : 1
  const moves: Square[] = []

  const fwd: Square = { row: from.row + dir, col: from.col }
  const fwdEmpty = isInBounds(fwd) && !getPiece(board, fwd)
  if (fwdEmpty) moves.push(fwd)

  if (!hasMoved && fwdEmpty) {
    const fwd2: Square = { row: from.row + dir * 2, col: from.col }
    if (isInBounds(fwd2) && !getPiece(board, fwd2)) moves.push(fwd2)
  }

  for (const dc of [-1, 1]) {
    const sq: Square = { row: from.row + dir, col: from.col + dc }
    if (!isInBounds(sq)) continue
    if (isEnemy(board, sq, color)) moves.push(sq)
    if (enPassantTarget && sq.row === enPassantTarget.row && sq.col === enPassantTarget.col) {
      moves.push(sq)
    }
  }

  const back: Square = { row: from.row - dir, col: from.col }
  if (isInBounds(back) && !getPiece(board, back)) moves.push(back)

  return moves
}

function getCaptainMoves(board: Board, from: Square, color: Color): Square[] {
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
  board: Board, from: Square, color: Color,
  commanderHasMoved: boolean, movedPieceIds: string[],
): Square[] {
  const moves: Square[] = []

  for (const [dr, dc] of ALL_DIRS) {
    const one: Square = { row: from.row + dr, col: from.col + dc }
    if (!isInBounds(one)) continue
    if (!isFriendly(board, one, color)) moves.push(one)
  }

  // Swap with unmoved friendly rook on same row, clear path
  if (!commanderHasMoved) {
    for (let col = 0; col < 8; col++) {
      if (col === from.col) continue
      const target: Square = { row: from.row, col }
      const piece = getPiece(board, target)
      if (!piece || piece.color !== color || piece.type !== 'rook') continue
      if (movedPieceIds.includes(piece.id)) continue
      const step = col > from.col ? 1 : -1
      let blocked = false
      for (let c = from.col + step; c !== col; c += step) {
        if (getPiece(board, { row: from.row, col: c })) { blocked = true; break }
      }
      if (!blocked) moves.push(target)
    }
  }

  return moves
}

/** Raw moves for a square — no check filtering. Used internally for check detection. */
function getRawMoves(board: Board, from: Square, ctx: MoveContext): Square[] {
  const piece = getPiece(board, from)
  if (!piece) return []

  const hasMoved = ctx.movedPieceIds.includes(piece.id)

  switch (piece.type) {
    case 'guard':
      return getGuardMoves(board, from, piece.color, hasMoved, ctx.enPassantTarget)
    case 'rook':
      return slidingRay(board, from, piece.color, ORTHOGONALS)
    case 'bishop':
      return slidingRay(board, from, piece.color, DIAGONALS)
    case 'knight':
      return KNIGHT_OFFSETS
        .map(([dr, dc]) => ({ row: from.row + dr, col: from.col + dc }))
        .filter(sq => isInBounds(sq) && !isFriendly(board, sq, piece.color))
    case 'captain':
      return getCaptainMoves(board, from, piece.color)
    case 'commander':
      return getCommanderMoves(board, from, piece.color, hasMoved, ctx.movedPieceIds)
  }
}

// ─── Check detection ──────────────────────────────────────────────────────────

/** Returns true if `color`'s Commander is currently threatened by any opponent piece. */
export function isInCheck(board: Board, color: Color, ctx: MoveContext): boolean {
  const commanderSq = findPiece(board, p => p.type === 'commander' && p.color === color)
  if (!commanderSq) return false

  const opponent: Color = color === 'red' ? 'blue' : 'red'
  // Use null enPassantTarget: en passant only captures guards, never the Commander
  const rawCtx: MoveContext = { movedPieceIds: ctx.movedPieceIds, enPassantTarget: null }

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (!piece || piece.color !== opponent) continue
      const moves = getRawMoves(board, { row, col }, rawCtx)
      if (moves.some(sq => sq.row === commanderSq.row && sq.col === commanderSq.col)) return true
    }
  }
  return false
}

/** Returns true if `color` has no legal moves (used for checkmate / stalemate detection). */
export function hasNoLegalMoves(board: Board, color: Color, ctx: MoveContext): boolean {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (!piece || piece.color !== color) continue
      if (getLegalMoves(board, { row, col }, ctx).length > 0) return false
    }
  }
  return true
}

// ─── Legal moves (check-filtered) ────────────────────────────────────────────

export function getLegalMoves(board: Board, from: Square, ctx: MoveContext): Square[] {
  const piece = getPiece(board, from)
  if (!piece) return []

  const raw = getRawMoves(board, from, ctx)

  return raw.filter(to => {
    const targetPiece = getPiece(board, to)
    const isSwap =
      piece.type === 'commander' &&
      targetPiece?.color === piece.color &&
      targetPiece?.type === 'rook'

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
      from, to, piece,
      capturedPiece: isEnPassant
        ? (epCaptureSquare ? getPiece(board, epCaptureSquare) : null)
        : (isSwap ? null : targetPiece),
      isEnPassant: isEnPassant || undefined,
      isSwap: isSwap || undefined,
      enPassantCaptureSquare: epCaptureSquare,
    }

    const newBoard = applyMove(board, move)

    // Determine updated movedPieceIds for the check probe
    const newMovedIds = ctx.movedPieceIds.includes(piece.id)
      ? ctx.movedPieceIds
      : [...ctx.movedPieceIds, piece.id]

    return !isInCheck(newBoard, piece.color, { movedPieceIds: newMovedIds, enPassantTarget: null })
  })
}
