import type { Color, GameState, Move, Piece, RoundState, Square } from './types'
import { createInitialBoard } from './constants'
import { getPiece, applyMove, squaresEqual } from './board'
import { getLegalMoves, isInCheck, hasNoLegalMoves } from './moves'
import { computeRoundScore, updateMatchState } from './scoring'

export type GameAction =
  | { type: 'MOVE_PIECE'; from: Square; to: Square }
  | { type: 'NEW_ROUND' }
  | { type: 'NEW_MATCH'; format: 3 | 5 }

function createInitialRound(firstTurn: Color = 'red'): RoundState {
  return {
    board: createInitialBoard(),
    turn: firstTurn,
    capturedByRed: [],
    capturedByBlue: [],
    moveHistory: [],
    phase: 'playing',
    winner: null,
    movedPieceIds: [],
    enPassantTarget: null,
    inCheck: false,
  }
}

function createInitialMatch(format: 3 | 5 = 3): GameState['match'] {
  return {
    format,
    roundScores: [],
    redMatchPoints: 0,
    blueMatchPoints: 0,
    roundWins: { red: 0, blue: 0 },
    matchWinner: null,
  }
}

export function createInitialState(format: 3 | 5 = 3): GameState {
  return {
    round: createInitialRound('red'),
    match: createInitialMatch(format),
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MOVE_PIECE': {
      const { round } = state
      if (round.phase !== 'playing') return state

      const piece = getPiece(round.board, action.from)
      if (!piece || piece.color !== round.turn) return state

      const ctx = { movedPieceIds: round.movedPieceIds, enPassantTarget: round.enPassantTarget }
      const legal = getLegalMoves(round.board, action.from, ctx)
      if (!legal.some(sq => squaresEqual(sq, action.to))) return state

      const targetPiece = getPiece(round.board, action.to)
      const dir = piece.color === 'red' ? -1 : 1

      const isSwap =
        piece.type === 'commander' &&
        targetPiece !== null &&
        targetPiece.color === piece.color &&
        targetPiece.type === 'rook'

      const isEnPassant =
        piece.type === 'guard' &&
        round.enPassantTarget !== null &&
        squaresEqual(action.to, round.enPassantTarget) &&
        !targetPiece

      const enPassantCaptureSquare: Square | undefined = isEnPassant
        ? { row: action.to.row - dir, col: action.to.col }
        : undefined

      const enPassantCaptured: Piece | null = isEnPassant && enPassantCaptureSquare
        ? getPiece(round.board, enPassantCaptureSquare)
        : null

      const capturedPiece = isSwap ? null : (isEnPassant ? enPassantCaptured : targetPiece)

      const move: Move = {
        from: action.from,
        to: action.to,
        piece,
        capturedPiece,
        isEnPassant: isEnPassant || undefined,
        isSwap: isSwap || undefined,
        enPassantCaptureSquare,
      }

      let newBoard = applyMove(round.board, move)

      // Guard promotion: reaching opponent's back rank → becomes Rook
      const backRank = piece.color === 'red' ? 0 : 7
      if (piece.type === 'guard' && action.to.row === backRank) {
        const promoted: Piece = { ...piece, type: 'rook' }
        newBoard = newBoard.map((row, r) =>
          r !== action.to.row ? row : row.map((p, c) => c === action.to.col ? promoted : p)
        )
      }

      const capturedByRed = round.capturedByRed.slice()
      const capturedByBlue = round.capturedByBlue.slice()
      if (capturedPiece) {
        if (piece.color === 'red') capturedByRed.push(capturedPiece)
        else capturedByBlue.push(capturedPiece)
      }

      const isDoubleStep =
        piece.type === 'guard' &&
        Math.abs(action.to.row - action.from.row) === 2
      const newEnPassantTarget: Square | null = isDoubleStep
        ? { row: action.from.row + dir, col: action.from.col }
        : null

      const newMovedIds = [...round.movedPieceIds]
      if (!newMovedIds.includes(piece.id)) newMovedIds.push(piece.id)
      if (isSwap && targetPiece && !newMovedIds.includes(targetPiece.id)) {
        newMovedIds.push(targetPiece.id)
      }

      const nextTurn: Color = round.turn === 'red' ? 'blue' : 'red'
      const nextCtx = { movedPieceIds: newMovedIds, enPassantTarget: newEnPassantTarget }

      // Check / checkmate / stalemate detection for next player
      const nextInCheck = isInCheck(newBoard, nextTurn, nextCtx)
      const nextHasNoMoves = hasNoLegalMoves(newBoard, nextTurn, nextCtx)

      // Checkmate: in check with no legal moves → mover wins
      // Stalemate: not in check with no legal moves → draw (winner = null)
      // Direct Commander capture is kept as fallback
      const commanderCaptured = capturedPiece?.type === 'commander'
      const checkmate = nextInCheck && nextHasNoMoves
      const stalemate = !nextInCheck && nextHasNoMoves

      const roundOver = commanderCaptured || checkmate || stalemate
      const winner: Color | null = commanderCaptured || checkmate ? piece.color : null

      return {
        ...state,
        round: {
          ...round,
          board: newBoard,
          turn: nextTurn,
          capturedByRed,
          capturedByBlue,
          moveHistory: [...round.moveHistory, move],
          phase: roundOver ? 'round_over' : 'playing',
          winner,
          movedPieceIds: newMovedIds,
          enPassantTarget: newEnPassantTarget,
          inCheck: roundOver ? false : nextInCheck,
        },
      }
    }

    case 'NEW_ROUND': {
      const { round, match } = state
      if (round.phase !== 'round_over') return state

      const score = computeRoundScore(round)
      const newMatch = updateMatchState(match, score)

      if (newMatch.matchWinner) {
        return {
          round: { ...round, phase: 'match_over' },
          match: newMatch,
        }
      }

      const loser: Color = round.winner === 'red' ? 'blue' : 'red'
      return {
        round: createInitialRound(loser),
        match: newMatch,
      }
    }

    case 'NEW_MATCH': {
      return createInitialState(action.format)
    }
  }
}
