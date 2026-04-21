export type Color = 'red' | 'blue'

export type PieceType = 'commander' | 'guard' | 'cannon' | 'striker' | 'flanker' | 'warlord'

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
  isEnPassant?: boolean
  isSwap?: boolean
  enPassantCaptureSquare?: Square
}

export interface RoundScore {
  winner: Color
  winnerPoints: number
  loserPoints: number
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
  movedPieceIds: string[]
  enPassantTarget: Square | null
  inCheck: boolean
  // Warlord pursuit: set after warlord captures, same player gets 1 free non-capturing step
  warlordPursuit: Square | null
  // Pending promotion: guard reached the back rank, waiting for player to choose a piece
  pendingPromotion: { square: Square; color: Color } | null
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
