import type { Board, Color, Piece, PieceType } from './types'

export const PIECE_VALUES: Record<PieceType, number> = {
  guard: 1,
  flanker: 3,
  striker: 3,
  cannon: 5,
  warlord: 7,
  commander: Infinity,
}

// Sum of one side's non-Commander material:
// 8 guards(8) + 2 flankers(6) + 2 strikers(6) + 2 cannons(10) + 1 warlord(7) = 37
export const MATERIAL_NORMALIZER = 37

function makePiece(type: PieceType, color: Color, index: number): Piece {
  return { type, color, id: `${color}-${type}-${index}` }
}

export function createInitialBoard(): Board {
  const board: Board = Array.from({ length: 8 }, () => Array(8).fill(null))

  // Back row: Cannon, Flanker, Striker, Warlord, Commander, Striker, Flanker, Cannon
  const backRow: PieceType[] = [
    'cannon',
    'flanker',
    'striker',
    'warlord',
    'commander',
    'striker',
    'flanker',
    'cannon',
  ]

  // Row 0 = rank 8 = blue back rank
  backRow.forEach((type, col) => {
    board[0][col] = makePiece(type, 'blue', col)
  })

  // Row 1 = rank 7 = blue guards
  for (let col = 0; col < 8; col++) {
    board[1][col] = makePiece('guard', 'blue', col)
  }

  // Row 6 = rank 2 = red guards
  for (let col = 0; col < 8; col++) {
    board[6][col] = makePiece('guard', 'red', col)
  }

  // Row 7 = rank 1 = red back rank
  backRow.forEach((type, col) => {
    board[7][col] = makePiece(type, 'red', col)
  })

  return board
}
