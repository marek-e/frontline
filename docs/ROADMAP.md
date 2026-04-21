# Frontline — Roadmap

Phased delivery plan from today's local hot-seat SPA to a production chess.com-style platform for Frontline.

Priorities: polish the single-player experience → bot → friend link → online rated → puzzles → learn → social.

Rough estimates assume one full-time developer. Parallelizable with design help.

---

## Phase 0 — Foundation (1–2 weeks)

Goal: unblock everything that follows. No user-visible changes.

- Migrate to pnpm + Turborepo monorepo
- Move `src/game/*` → `packages/rules` (pure, zero React deps)
- Move `src/` → `apps/web/src/`
- Add Vitest + property-based tests (fast-check) for move generation and legality
- Set up Tailwind v4 with `@theme` tokens from [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
- Biome or ESLint + Prettier config
- GitHub Actions CI: typecheck, lint, test, build
- Staging + prod deploy pipeline (Vercel)
- Decide Convex / PartyKit / Supabase (see [ARCHITECTURE.md](./ARCHITECTURE.md#open-decisions))
- Decide Clerk / Supabase Auth

## Phase 1 — Core UX polish, local hot-seat (1 week)

Goal: the local game feels premium.

- Rebuild CSS with Tailwind + design tokens
- Move history panel with FGN notation
- Takeback / undo for local games
- Board flip, coordinates toggle, piece-set selector, themes
- Sound effects (move, capture, check, checkmate, promotion, warning, win)
- Settings persisted to localStorage
- FGN export / import
- Keyboard navigation & screen-reader pass
- Reduced-motion support
- Color-blind mode
- Responsive layout down to 360px

## Phase 2 — Accounts & Profiles (1 week)

- Auth integration (Clerk or Supabase)
- User schema: id, username, country, avatar, bio, created_at
- Profile page: games played, rating per time control, win/loss, recent games
- Settings: appearance, board, piece set, sounds, notifications
- Username reservation rules, profanity filter

## Phase 3 — Play with a friend (3–5 days)

- Create-game flow → shareable link `/play/:inviteCode`
- Realtime sync via chosen backend
- Spectator mode (read-only observers)
- Resign / draw offer / abort buttons
- In-game emoji reactions (chat deferred — moderation overhead)
- Clock infrastructure (reused everywhere from now on)
- Reconnect handling

## Phase 4 — Bot play (2 weeks)

Goal: a strong single-player opponent, client-side.

- `packages/bot` scaffold with pluggable strength levels 1–10
- Negamax + alpha-beta + iterative deepening + transposition table
- Move ordering: MVV-LVA, killer moves, history heuristic
- Evaluation: material + piece-square tables per piece + mobility + king safety + guard structure + warlord activity
- Hand-authored opening book (20–50 lines)
- Bot personalities (aggressive, defensive, tactical, positional) via eval weight tweaks
- Run in a Web Worker on the client (unrated practice)
- Bot-vs-bot test harness for strength calibration (also used in Phase 6)

## Phase 5 — Online matchmaking & rated play (2–3 weeks)

Goal: rated online matches with real anti-cheat baseline.

- Time controls: bullet 1+0 / 3+0, blitz 3+2 / 5+3, rapid 10+0 / 15+10, correspondence
- Glicko-2 rating per time control
- Matchmaking queue (rating-band FIFO to start)
- **Server-authoritative move validation** using `@frontline/rules` server-side
- Latency compensation, clock-drift handling
- Abort window: no rating change if game aborts in <first full move
- Reconnection: clock keeps running, game resumes on rejoin
- Post-game result modal with rating delta
- Leaderboards per time control + country

## Phase 6 — Puzzles (2–3 weeks)

Goal: tactical training content. Frontline has no games DB — we generate our own.

- Puzzle generator: bot-vs-bot games at varying strengths, mine positions where `eval_delta > threshold` after a forcing line
- Classify: mate-in-N, tactic (fork/pin/skewer-equivalents), endgame, commander-swap tactics, warlord pursuit tactics
- Store in Postgres with tags, difficulty, success stats
- Puzzle rating via user success rate (Glicko for puzzles too)
- Modes: Rated puzzles, Streak, Rush (3min), Storm (endless)
- Puzzle of the day
- Daily leaderboards

## Phase 7 — Learn / content (ongoing from Phase 4)

- Interactive tutorial for each piece
- Opening explorer (populated from played games)
- Lessons (markdown + interactive board widget)
- Analysis board with bot eval bar, multi-PV, variation tree

## Phase 8 — Tournaments, clubs, social (later)

- Arena tournaments (joinable, time-boxed, Glicko-adjusted)
- Clubs / teams
- Follow / friends / in-site messaging
- Streamers page, broadcast top games

## Phase 9 — Anti-cheat (starts in Phase 5, never ends)

- Move-time statistical analysis
- Engine-correlation: compare user moves to bot's top-N moves
- Flag-and-review queue for moderators
- Ban, rating-freeze, account-close flows
- Appeals process

## Phase 10 — Mobile & monetization

- PWA first (installable, offline bot play)
- React Native / Capacitor wrapper for iOS/Android
- Freemium: unlimited play free; premium tier = deeper analysis, unlimited puzzles, no ads, coaching tools
- Cosmetics: board themes, piece sets
- Stripe integration
