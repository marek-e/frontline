export type Color = 'red' | 'blue'

export type PieceType = 'commander' | 'guard' | 'rook' | 'bishop' | 'knight' | 'captain'

export interface Piece {
  type: PieceType
  color: Color
  id: string
}

export interface Square {
  row: number // 0 = rank 8 (blue back rank), 7 = rank 1 (red back rank)
  col: number // 0 = file a, 7 = file h
}

export type Board = (Piece | null)[][]

export interface Move {
  from: Square
  to: Square
  piece: Piece
  capturedPiece: Piece | null
  isEnPassant?: boolean      // capture happened on a different square than `to`
  isSwap?: boolean           // commander-rook swap
  enPassantCaptureSquare?: Square  // where the captured pawn actually sits
}

export interface RoundScore {
  winner: Color
  winnerPoints: number // 1 + efficiency bonus
  loserPoints: number  // always 0
}

export type GamePhase = 'playing' | 'round_over' | 'match_over'

export interface RoundState {
  board: Board
  turn: Color
  capturedByRed: Piece[]
  capturedByBlue: Piece[]
  moveHistory: Move[]
  phase: GamePhase
  winner: Color | null
  // Special rule tracking
  movedPieceIds: string[]        // pieces that have moved at least once
  enPassantTarget: Square | null // square a guard can capture en passant this turn
  // Check state for current turn player
  inCheck: boolean
}

export interface MatchState {
  format: 3 | 5
  roundScores: RoundScore[]
  redMatchPoints: number
  blueMatchPoints: number
  roundWins: { red: number; blue: number }
  matchWinner: Color | null
}

export interface GameState {
  round: RoundState
  match: MatchState
}
