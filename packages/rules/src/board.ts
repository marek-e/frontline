import type { Board, Move, Piece, Square } from './types'

export function isInBounds(sq: Square): boolean {
  return sq.row >= 0 && sq.row < 8 && sq.col >= 0 && sq.col < 8
}

export function squaresEqual(a: Square, b: Square): boolean {
  return a.row === b.row && a.col === b.col
}

export function getPiece(board: Board, sq: Square): Piece | null {
  return board[sq.row][sq.col]
}

export function cloneBoard(board: Board): Board {
  return board.map(row => [...row])
}

export function applyMove(board: Board, move: Move): Board {
  const next = cloneBoard(board)

  if (move.isSwap) {
    // Commander and Rook swap positions
    const rook = next[move.to.row][move.to.col]
    next[move.to.row][move.to.col] = move.piece       // commander goes to rook's square
    next[move.from.row][move.from.col] = rook         // rook goes to commander's square
  } else {
    next[move.to.row][move.to.col] = move.piece
    next[move.from.row][move.from.col] = null
    // En passant: remove the captured guard from its actual square (not `to`)
    if (move.isEnPassant && move.enPassantCaptureSquare) {
      next[move.enPassantCaptureSquare.row][move.enPassantCaptureSquare.col] = null
    }
  }

  return next
}

export function findPiece(board: Board, predicate: (p: Piece) => boolean): Square | null {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const p = board[row][col]
      if (p && predicate(p)) return { row, col }
    }
  }
  return null
}

export function getAllPieces(board: Board): Piece[] {
  const pieces: Piece[] = []
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const p = board[row][col]
      if (p) pieces.push(p)
    }
  }
  return pieces
}
