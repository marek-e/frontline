import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { createInitialState, gameReducer } from './gameReducer'
import { replayFGN, toFGN } from './fgn'
import { getLegalMoves } from './moves'
import type { GameState } from './types'

function stripUndo(state: GameState): Omit<GameState, 'undoStack'> & { undoStack: [] } {
  return { ...state, undoStack: [] }
}

describe('FGN', () => {
  it('round-trips random games: replayFGN(toFGN(state)) equals final board', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 10_000 }), (seed) => {
        // Drive the existing random-game generator indirectly via moves.test helpers? Not exported,
        // so we do a small random playout here (legal-move enumeration is already covered there).
        // This test mainly catches serialization/parser mismatches and disambiguation issues.
        let state = createInitialState(3)
        const rng = mulberry32(seed)

        for (let i = 0; i < 80; i++) {
          if (state.round.phase !== 'playing') break
          if (state.round.pendingPromotion) {
            const choices = ['warlord', 'cannon', 'striker', 'flanker'] as const
            const pick = choices[Math.floor(rng() * choices.length)]!
            state = gameReducer(state, { type: 'PROMOTE', pieceType: pick })
            continue
          }
          if (state.round.warlordPursuit) {
            // Favor skip to exercise that path frequently
            if (rng() < 0.6) state = gameReducer(state, { type: 'SKIP_PURSUIT' })
            else {
              // Try a small ring around the warlord; if illegal, skip
              const { row, col } = state.round.warlordPursuit
              const deltas = [
                [-1, -1],
                [-1, 0],
                [-1, 1],
                [0, -1],
                [0, 1],
                [1, -1],
                [1, 0],
                [1, 1],
              ] as const
              const d = deltas[Math.floor(rng() * deltas.length)]!
              state = gameReducer(state, { type: 'WARLORD_PURSUE', to: { row: row + d[0], col: col + d[1] } })
              if (state.round.warlordPursuit) state = gameReducer(state, { type: 'SKIP_PURSUIT' })
            }
            continue
          }

          // choose a random legal move by scanning all squares and legal targets
          const moves: { from: { row: number; col: number }; to: { row: number; col: number } }[] = []
          const ctx = { movedPieceIds: state.round.movedPieceIds, enPassantTarget: state.round.enPassantTarget }
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              const p = state.round.board[r]![c]
              if (!p || p.color !== state.round.turn) continue
              for (const to of getLegalMoves(state.round.board, { row: r, col: c }, ctx)) {
                moves.push({ from: { row: r, col: c }, to })
              }
            }
          }
          if (moves.length === 0) break
          const m = moves[Math.floor(rng() * moves.length)]!
          const next = gameReducer(state, { type: 'MOVE_PIECE', from: m.from, to: m.to })
          if (next === state) break
          state = next
        }

        const fgn = toFGN(state)
        const replayed = replayFGN(fgn, 3)
        expect(replayed.round.board).toEqual(state.round.board)
      }),
      { numRuns: 60 }
    )
  })

  it('UNDO_TURN restores exact round snapshot', () => {
    let state = createInitialState(3)
    const s0 = stripUndo(state)
    state = gameReducer(state, { type: 'MOVE_PIECE', from: { row: 6, col: 0 }, to: { row: 4, col: 0 } })
    state = gameReducer(state, { type: 'MOVE_PIECE', from: { row: 1, col: 0 }, to: { row: 3, col: 0 } })
    const s2 = stripUndo(state)

    state = gameReducer(state, { type: 'UNDO_TURN' })
    expect(stripUndo(state)).toEqual(s2)
    state = gameReducer(state, { type: 'UNDO_TURN' })
    expect(stripUndo(state)).toEqual(s0)
  })
})

function mulberry32(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let x = t
    x = Math.imul(x ^ (x >>> 15), x | 1)
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

