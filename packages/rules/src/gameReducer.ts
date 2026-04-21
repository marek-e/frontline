import type { Color, GameState, Move, Piece, RoundState, Square } from './types'
import { createInitialBoard } from './constants'
import { getPiece, applyMove, squaresEqual } from './board'
import { getLegalMoves, isInCheck, hasNoLegalMoves } from './moves'
import { computeRoundScore, updateMatchState } from './scoring'

export type GameAction =
  | { type: 'MOVE_PIECE'; from: Square; to: Square }
  | { type: 'WARLORD_PURSUE'; to: Square }
  | { type: 'SKIP_PURSUIT' }
  | { type: 'PROMOTE'; pieceType: Exclude<import('./types').PieceType, 'commander' | 'guard'> }
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
    warlordPursuit: null,
    pendingPromotion: null,
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

/** Compute post-move state after a player finishes their full turn (including any pursuit). */
function resolveTurnEnd(
  round: RoundState,
  board: typeof round.board,
  moverColor: Color,
  capturedByRed: Piece[],
  capturedByBlue: Piece[],
  moveHistory: typeof round.moveHistory,
  movedPieceIds: string[],
  enPassantTarget: Square | null,
): Partial<RoundState> {
  const nextTurn: Color = moverColor === 'red' ? 'blue' : 'red'
  const nextCtx = { movedPieceIds, enPassantTarget }

  const nextInCheck    = isInCheck(board, nextTurn, nextCtx)
  const nextHasNoMoves = hasNoLegalMoves(board, nextTurn, nextCtx)

  const checkmate   = nextInCheck && nextHasNoMoves
  const stalemate   = !nextInCheck && nextHasNoMoves
  const roundOver   = checkmate || stalemate
  const winner: Color | null = checkmate ? moverColor : null

  return {
    board,
    turn: nextTurn,
    capturedByRed,
    capturedByBlue,
    moveHistory,
    phase: roundOver ? 'round_over' : 'playing',
    winner,
    movedPieceIds,
    enPassantTarget,
    inCheck: roundOver ? false : nextInCheck,
    warlordPursuit: null,
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case 'MOVE_PIECE': {
      const { round } = state
      if (round.phase !== 'playing' || round.warlordPursuit || round.pendingPromotion) return state

      const piece = getPiece(round.board, action.from)
      if (!piece || piece.color !== round.turn) return state

      const ctx = { movedPieceIds: round.movedPieceIds, enPassantTarget: round.enPassantTarget }
      const legal = getLegalMoves(round.board, action.from, ctx)
      if (!legal.some(sq => squaresEqual(sq, action.to))) return state

      const targetPiece = getPiece(round.board, action.to)
      const dir = piece.color === 'red' ? -1 : 1

      const isSwap =
        piece.type === 'commander' &&
        targetPiece?.color === piece.color &&
        targetPiece?.type === 'cannon'

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
        from: action.from, to: action.to, piece, capturedPiece,
        isEnPassant: isEnPassant || undefined,
        isSwap: isSwap || undefined,
        enPassantCaptureSquare,
      }

      const newBoard = applyMove(round.board, move)

      const capturedByRed = round.capturedByRed.slice()
      const capturedByBlue = round.capturedByBlue.slice()
      if (capturedPiece) {
        if (piece.color === 'red') capturedByRed.push(capturedPiece)
        else capturedByBlue.push(capturedPiece)
      }

      const isDoubleStep = piece.type === 'guard' && Math.abs(action.to.row - action.from.row) === 2
      const newEnPassantTarget: Square | null = isDoubleStep
        ? { row: action.from.row + dir, col: action.from.col }
        : null

      const newMovedIds = [...round.movedPieceIds]
      if (!newMovedIds.includes(piece.id)) newMovedIds.push(piece.id)
      if (isSwap && targetPiece && !newMovedIds.includes(targetPiece.id)) {
        newMovedIds.push(targetPiece.id)
      }

      // Guard promotion: pause and let the player choose a piece
      const backRank = piece.color === 'red' ? 0 : 7
      if (piece.type === 'guard' && action.to.row === backRank) {
        return {
          ...state,
          round: {
            ...round,
            board: newBoard,
            capturedByRed,
            capturedByBlue,
            moveHistory: [...round.moveHistory, move],
            movedPieceIds: newMovedIds,
            enPassantTarget: newEnPassantTarget,
            warlordPursuit: null,
            pendingPromotion: { square: action.to, color: piece.color },
          },
        }
      }

      // Warlord pursuit: if warlord captured a piece, grant a free 1-square step
      const warlordCaptured = piece.type === 'warlord' && capturedPiece !== null
      if (warlordCaptured) {
        return {
          ...state,
          round: {
            ...round,
            board: newBoard,
            capturedByRed,
            capturedByBlue,
            moveHistory: [...round.moveHistory, move],
            movedPieceIds: newMovedIds,
            enPassantTarget: newEnPassantTarget,
            warlordPursuit: action.to, // warlord's current position
          },
        }
      }

      return {
        ...state,
        round: {
          ...round,
          ...resolveTurnEnd(
            round, newBoard, piece.color,
            capturedByRed, capturedByBlue,
            [...round.moveHistory, move],
            newMovedIds, newEnPassantTarget,
          ),
        },
      }
    }

    case 'PROMOTE': {
      const { round } = state
      if (!round.pendingPromotion || round.phase !== 'playing') return state

      const { square, color } = round.pendingPromotion
      const existing = round.board[square.row][square.col]
      const promoted: Piece = {
        id: existing?.id ?? `${color}-${action.pieceType}-${square.row}-${square.col}`,
        type: action.pieceType,
        color,
      }
      const newBoard = round.board.map((row, r) =>
        r !== square.row ? row : row.map((p, c) => c === square.col ? promoted : p)
      )

      return {
        ...state,
        round: {
          ...round,
          pendingPromotion: null,
          ...resolveTurnEnd(
            round, newBoard, color,
            round.capturedByRed, round.capturedByBlue,
            round.moveHistory,
            round.movedPieceIds, round.enPassantTarget,
          ),
        },
      }
    }

    case 'WARLORD_PURSUE': {
      const { round } = state
      if (!round.warlordPursuit || round.phase !== 'playing') return state

      const warlordSq = round.warlordPursuit
      const warlord = getPiece(round.board, warlordSq)
      if (!warlord || warlord.type !== 'warlord') return state

      const to = action.to
      if (!squaresEqual({ row: warlordSq.row, col: warlordSq.col }, { row: warlordSq.row, col: warlordSq.col })) return state

      // Validate: 1 square away, empty
      if (Math.max(Math.abs(to.row - warlordSq.row), Math.abs(to.col - warlordSq.col)) !== 1) return state
      if (getPiece(round.board, to)) return state

      const ctx = { movedPieceIds: round.movedPieceIds, enPassantTarget: round.enPassantTarget }
      const move: Move = { from: warlordSq, to, piece: warlord, capturedPiece: null }
      const newBoard = applyMove(round.board, move)

      // Check-filter the pursuit
      if (isInCheck(newBoard, warlord.color, ctx)) return state

      return {
        ...state,
        round: {
          ...round,
          ...resolveTurnEnd(
            round, newBoard, warlord.color,
            round.capturedByRed, round.capturedByBlue,
            [...round.moveHistory, move],
            round.movedPieceIds, null,
          ),
        },
      }
    }

    case 'SKIP_PURSUIT': {
      const { round } = state
      if (!round.warlordPursuit || round.phase !== 'playing') return state

      return {
        ...state,
        round: {
          ...round,
          ...resolveTurnEnd(
            round, round.board, round.turn,
            round.capturedByRed, round.capturedByBlue,
            round.moveHistory,
            round.movedPieceIds, round.enPassantTarget,
          ),
        },
      }
    }

    case 'NEW_ROUND': {
      const { round, match } = state
      if (round.phase !== 'round_over') return state

      const score = computeRoundScore(round)
      const newMatch = updateMatchState(match, score)

      if (newMatch.matchWinner) {
        return { round: { ...round, phase: 'match_over' }, match: newMatch }
      }

      const loser: Color = round.winner === 'red' ? 'blue' : 'red'
      return { round: createInitialRound(loser), match: newMatch }
    }

    case 'NEW_MATCH': {
      return createInitialState(action.format)
    }
  }
}
