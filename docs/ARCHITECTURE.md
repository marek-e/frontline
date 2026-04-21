# Frontline — Architecture

Target stack, repo layout, and data flow for the Frontline platform.

**Stance:** full TypeScript, Cloudflare-native, portable over fast. Vendor-lock is avoided wherever the cost is < 1 week of engineering.

---

## Stack

| Layer               | Pick                                                              | Notes                                                               |
| ------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------- |
| Language            | TypeScript end-to-end                                             | Rules, bot, server, web — one language, one set of types            |
| Monorepo            | pnpm workspaces + Turborepo                                       | Shared `@frontline/rules` package, cached/parallel task runs        |
| Web framework       | **TanStack Start** on Vite                                        | SSR + SSG per route, deploys to Cloudflare Workers, SEO-capable     |
| Router              | TanStack Router                                                   | Type-safe routes and search params (analysis URLs, puzzle filters)  |
| Styling             | Tailwind v4 (`@theme` tokens)                                     | Tokens defined in [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)            |
| Client server state | TanStack Query                                                    | REST/HTTP data; websocket state handled by `partysocket` directly   |
| Realtime            | **PartyKit** (Cloudflare Durable Objects)                         | One DO per game room = authoritative, low-latency, no extra infra   |
| HTTP API            | Cloudflare Workers (Hono)                                         | REST endpoints for non-room state (profiles, leaderboards, puzzles) |
| DB                  | Postgres (Neon)                                                   | Serverless, branchable, Hyperdrive-compatible with Cloudflare       |
| ORM                 | Drizzle                                                           | SQL-first, edge-compatible, minimal cold-start                      |
| Auth                | **better-auth** (self-hosted, in Postgres)                        | No vendor lock, session lives next to user data                     |
| File storage        | Cloudflare R2                                                     | Avatars, piece-set cosmetics; zero egress fees                      |
| Bot engine          | TypeScript (Web Worker + Node)                                    | Rust/WASM hot-path is a later optimization, not a day-1 requirement |
| Puzzle generation   | Node worker pool, bot self-play                                   | Mine positions where `eval_delta > threshold` after a forcing line  |
| Rating              | Glicko-2 (revisit: OpenSkill)                                     | Glicko-2 for 1v1 ship; OpenSkill if we add free-for-all modes later |
| Anti-cheat          | Server-authoritative moves + move-time stats + engine correlation | Non-negotiable for rated play                                       |
| Hosting             | Cloudflare (Pages + Workers + DO + R2)                            | Single provider, single bill, edge-native                           |
| Error monitoring    | Sentry                                                            | Free tier sufficient                                                |
| Analytics + flags   | PostHog                                                           | Analytics, session recording, feature flags in one                  |
| Transactional email | Resend                                                            | Verification, password reset, game notifications                    |
| Payments (later)    | Stripe                                                            | Premium tier, cosmetics                                             |
| License             | AGPL-3.0                                                          | Open source but prevents hosted clones of the server                |

---

## Why PartyKit for realtime

A chess/Frontline game is a stateful room with a small number of connections, strict move ordering, and a clock. The natural shape is **one authoritative in-memory object per game**, which is exactly what Cloudflare Durable Objects are.

PartyKit gives us:

- One `GameRoom` class per game, spawned on demand, garbage-collected when empty
- Sticky WebSockets — all players of game `gid` hit the same DO instance, globally
- Clock lives in the DO (server is the source of truth, always)
- Spectators = extra connections on the same DO, read-only broadcast
- ~10ms edge latency worldwide
- No Redis, no pub/sub broker, no sharded websocket servers

Turn-based games are the use case PartyKit was designed for.

---

## Repository layout

```
frontline/
├── apps/
│   ├── web/                  # TanStack Start app (was src/)
│   ├── party/                # PartyKit server — game rooms, lobbies, matchmaking
│   └── api/                  # Cloudflare Worker — REST API (Hono)
├── packages/
│   ├── rules/                # Pure game logic, zero framework deps
│   ├── bot/                  # Engine, eval, opening book, search
│   ├── puzzles/              # Puzzle generator (bot-vs-bot mining)
│   ├── ui/                   # Shared React components + design tokens
│   ├── db/                   # Drizzle schema, migrations, queries
│   └── auth/                 # better-auth config shared by web + api
├── docs/
├── TODO.md
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

### `@frontline/rules` boundaries

Must be:

- Pure functions, no React, no DOM, no `fetch`, no `Date.now()`
- Deterministic: same inputs → same outputs
- Serializable state (Zod schemas at the boundary)
- Fast — the bot calls `legalMoves()` tens of thousands of times per search

Exports:

- `createInitialState(format: 3 | 5): GameState`
- `legalMoves(state: RoundState, from: Square): Move[]`
- `applyMove(state: RoundState, move: Move): RoundState`
- `isCheck(state, color): boolean`
- `isCheckmate(state, color): boolean`
- FGN serializer / parser

### `@frontline/bot` boundaries

- Depends on `@frontline/rules` only
- Runs in a Web Worker on the client (practice) or in Node/Worker server-side (anti-cheat, puzzles)
- Single entry: `search(state, { depth, timeMs, personality }): { bestMove, score, pv, stats }`

---

## Client/server data flow

```
Client (TanStack Start)
  ├─ local game          → reducer only (no network)
  ├─ bot game            → Web Worker running @frontline/bot
  ├─ friend link game    → PartyKit room (WebSocket)
  └─ ranked online       → PartyKit room (WebSocket)
                             │
                             ├─ validates every move via @frontline/rules
                             ├─ updates authoritative clock
                             ├─ persists completed game to Postgres via api Worker
                             └─ broadcasts state diff to players + spectators

Non-room HTTP
  profiles, game history, leaderboards, puzzles, auth
  → Cloudflare Worker (Hono) → Drizzle → Postgres (Neon)
```

Every authoritative move: `client → PartyKit room → rules.applyMove() → broadcast`. Client applies optimistically but the DO is the source of truth; a rejected move rolls back.

---

## Clock authority

- Server (the Durable Object) owns the clock
- On every move: DO records server timestamp, decrements mover's time, starts opponent's timer
- Client displays an optimistic estimate + drifts toward server value on each incoming message
- Client submits moves with no timestamp; server stamps them
- Moves arriving after the mover's time hits zero = timeout loss

---

## Rating — Glicko-2 (revisit: OpenSkill)

- Separate rating per time control (bullet, blitz, rapid, correspondence)
- Separate rating for puzzles
- Provisional for ~20 games (high RD, fast movement)
- Recompute after each rated game
- **Open to revisit:** OpenSkill (Weng-Lin) — better math, handles future multi-player modes (free-for-all, 2v2). Locked to Glicko-2 unless/until we add non-1v1 modes.

---

## Anti-cheat pipeline (Phase 5+)

1. **Hard gate:** server-authoritative validation rejects any illegal move before it hits the DB
2. **Heuristic signals** per game:
   - Mean / variance of move times vs position complexity
   - Engine-correlation: `@frontline/bot` at moderate depth, % match to top-1 / top-3
   - Per-ply accuracy (centipawn-loss equivalent)
3. **Flag threshold:** combined score > threshold → review queue
4. **Manual review** by moderators
5. **Actions:** rating freeze, shadow queue, ban, appeal

---

## FGN — Frontline Game Notation

Serialization format for games. Implemented in `@frontline/rules` as a reader/writer pair.

Spec: **[GAME.md → FGN](./GAME.md#fgn--frontline-game-notation)**. Single source of truth — do not duplicate.

---

## Resolved decisions

| Decision          | Pick                       |
| ----------------- | -------------------------- |
| Language          | TypeScript                 |
| Realtime          | PartyKit                   |
| Web framework     | TanStack Start             |
| Router            | TanStack Router            |
| Styling           | Tailwind v4                |
| ORM               | Drizzle                    |
| Auth              | better-auth                |
| Hosting           | Cloudflare (all-in)        |
| DB                | Postgres / Neon            |
| Bot language      | TypeScript (Rust/WASM TBD) |
| Monitoring        | Sentry                     |
| Analytics / flags | PostHog                    |
| Email             | Resend                     |
| Storage           | Cloudflare R2              |
| License           | AGPL-3.0                   |

## Open decisions

1. **Rating system** — Glicko-2 locked for ship; revisit OpenSkill if multiplayer modes appear
2. **Piece art** — in-house SVGs vs commissioned set (blocked on designer availability)
3. **Domain** — `frontline.com` availability TBC; fallbacks `frontline.gg`, `playfrontline.com`, `frontline.game`
4. **Rust/WASM bot** — timing of migration (deferred; re-evaluate if TS bot hits a wall at ~2000 ELO)
