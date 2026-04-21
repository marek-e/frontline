# Frontline

**Frontline** is a deterministic, turn-based strategy game inspired by chess — and the online platform to play it.

Think _chess.com for Frontline_: play online against humans, play locally with a friend, solve puzzles, and train against an AI bot.

---

## What Frontline is

A competitive 8×8 strategy game with six original piece types (Commander, Guard, Cannon, Striker, Flanker, Warlord), no randomness, and a match-format scoring system that rewards efficient wins, not just wins.

Full game rules: **[docs/GAME.md](./docs/GAME.md)**

## What this repo is building

A full online gaming platform at `frontline.com` (domain TBC):

- **Play online** — rated/unrated matches, matchmaking, leaderboards
- **Play a friend** — shareable invite links, same-device hot-seat, and remote
- **Play the bot** — custom Frontline engine (no Stockfish — different rules), multiple strength levels and personalities
- **Puzzles** — tactics, endgames, mate-in-N, daily puzzle, rush/streak modes
- **Learn** — interactive tutorial for each piece, opening explorer, lessons
- **Analyze** — post-game review with engine eval bar and FGN export
- **Tournaments & clubs** — arenas, teams, spectating (later phase)

## Project docs

| Doc                                              | What's in it                                              |
| ------------------------------------------------ | --------------------------------------------------------- |
| [docs/GAME.md](./docs/GAME.md)                   | The Frontline game: pieces, rules, notation, match format |
| [docs/ROADMAP.md](./docs/ROADMAP.md)             | Phased delivery plan from current state to v1             |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)   | Tech stack, monorepo layout, open decisions               |
| [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) | Design tokens, components, motion, a11y                   |
| [TODO.md](./TODO.md)                             | Live checkbox task tracker                                |

## Current status

**Phase 0 / pre-platform.** What works today:

- Local hot-seat gameplay in the browser
- Full rule implementation: all six pieces, check/checkmate, en passant, promotion, commander swap, warlord pursuit
- BO3 / BO5 match format with efficiency-bonus scoring
- React 19 + Vite + TypeScript SPA, no backend yet

What's not there yet: accounts, online play, bot, puzzles, server, persistence.

## Quick start

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:5173`.

## Tech stack

Full TypeScript, Cloudflare-native. See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for rationale.

- **Web:** TanStack Start (Vite + TanStack Router) + React 19 + TypeScript
- **Styling:** Tailwind v4
- **Realtime:** PartyKit (Cloudflare Durable Objects) — one DO per game room
- **API:** Cloudflare Worker with Hono
- **DB:** Postgres (Neon) + Drizzle ORM
- **Auth:** better-auth (self-hosted, in Postgres)
- **Bot:** TypeScript negamax + alpha-beta in a Web Worker
- **Rating:** Glicko-2
- **Hosting:** Cloudflare (Pages + Workers + DO + R2)
- **Monitoring:** Sentry · **Analytics + flags:** PostHog · **Email:** Resend
- **Monorepo:** pnpm workspaces + Turborepo

## Repository layout (target)

```
frontline/
├── apps/
│   ├── web/            # TanStack Start app (current src/ will move here)
│   ├── party/          # PartyKit server — game rooms, lobbies, matchmaking
│   └── api/            # Cloudflare Worker (Hono) — REST API
├── packages/
│   ├── rules/          # Pure game logic, zero framework deps (current src/game/)
│   ├── bot/            # Frontline engine + eval + opening book
│   ├── puzzles/        # Puzzle generator (bot-vs-bot mining)
│   ├── ui/             # Shared React components + design tokens
│   ├── db/             # Drizzle schema, migrations, queries
│   └── auth/           # better-auth config shared by web + api
├── docs/
└── TODO.md
```

## License

AGPL-3.0 (planned — add `LICENSE` file at Phase 0).
