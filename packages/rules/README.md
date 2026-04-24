# @frontline/rules

Pure game logic for Frontline — framework-agnostic, fully tested, zero side effects.

## What it does

Implements the complete Frontline ruleset: move generation, game state transitions, scoring, and FGN (Frontline Game Notation) serialisation. Used by both `apps/web` (local play, UI) and `apps/api` (server-side validation, multiplayer).

## Structure

```
src/
├── types.ts        — all shared types (Color, PieceType, Board, Move, GameState, …)
├── constants.ts    — piece values, material normaliser, createInitialBoard()
├── board.ts        — board queries (piece lookup, square validation, occupancy)
├── moves.ts        — legal move generation per piece type + en passant + warlord pursuit
├── scoring.ts      — round and match scoring (material ratio + efficiency bonuses)
├── gameReducer.ts  — applyTurn(): pure state transition; handles promotion, check, checkmate
├── fgn.ts          — FGN encode/decode (Frontline Game Notation)
└── index.ts        — barrel re-export of everything above
```

## Piece roster

| Piece     | Value | Notes                                 |
| --------- | ----- | ------------------------------------- |
| Guard     | 1     | 8 per side; promotes on back rank     |
| Flanker   | 3     | Diagonal mover                        |
| Striker   | 3     | Orthogonal mover                      |
| Cannon    | 5     | Jumps over one piece to capture       |
| Warlord   | 7     | Captures then pursues one free step   |
| Commander | ∞     | Royal piece; losing it ends the round |

## Key API

```ts
import {
  createInitialBoard,
  getLegalMoves,
  applyTurn,
  encodeGame,
  decodeGame,
} from '@frontline/rules'

const state = createInitialGameState()
const moves = getLegalMoves(state.round, square)
const next = applyTurn(state, turn)
const notation = encodeGame(state)
```

## Tests

```bash
pnpm test          # run vitest in watch mode
pnpm test --run    # single pass (CI)
```
