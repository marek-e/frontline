# Frontline — TODO

Living task tracker. Phases follow [docs/ROADMAP.md](./docs/ROADMAP.md).

Conventions: `[ ]` open · `[x]` done · `[~]` in progress · `[!]` blocked.

---

## Open decisions

Resolved in [ARCHITECTURE.md](./docs/ARCHITECTURE.md#resolved-decisions). Remaining:

- [ ] Piece art: in-house SVGs / commissioned set (blocked on designer)
- [ ] Domain: `frontline.com` availability → fallbacks `frontline.gg`, `playfrontline.com`, `frontline.game`
- [ ] Rating system: Glicko-2 for ship; revisit OpenSkill if multiplayer modes appear
- [ ] Rust/WASM bot migration timing (defer until TS bot plateaus ~2000 ELO)

---

## Phase 0 — Foundation

- [x] Init pnpm workspaces + Turborepo
- [~] Restructure: `apps/web`, `apps/party`, `apps/api`, `packages/rules`, `packages/bot`, `packages/puzzles`, `packages/ui`, `packages/db`, `packages/auth` (done: `apps/web`, `packages/rules`, `packages/ui`)
- [x] Move `src/game/*` → `packages/rules` (pure, no React imports)
- [x] Move `src/` → `apps/web/src/`
- [ ] Migrate `apps/web` from raw Vite SPA to TanStack Start
- [ ] Scaffold `apps/party` (PartyKit) with a `GameRoom` stub
- [ ] Scaffold `apps/api` (Cloudflare Worker + Hono) with a health route
- [ ] Scaffold `packages/db` with Drizzle + Neon connection
- [ ] Scaffold `packages/auth` with better-auth + Postgres adapter
- [x] Set up Vitest + fast-check
- [~] Write property tests for move generation (no illegal moves, checkmate detection, en passant, promotion, commander swap, warlord pursuit) — baseline suite (16 tests) in `packages/rules/src/moves.test.ts`; expand coverage for promotion flows + EP capture
- [ ] Set up Tailwind v4 with tokens from DESIGN_SYSTEM.md
- [ ] Configure Biome or ESLint + Prettier
- [ ] GitHub Actions: typecheck, lint, test, build
- [ ] Cloudflare Pages deploy for `apps/web` (staging + prod)
- [ ] Cloudflare Workers deploy for `apps/party` and `apps/api` (staging + prod)
- [x] Add `LICENSE` file (AGPL-3.0)
- [ ] Wire Sentry on web + workers
- [ ] Wire PostHog on web
- [ ] Wire Resend (placeholder — no flows yet)

## Phase 1 — Core UX polish (local hot-seat)

- [ ] Rebuild `Board` / `Piece` / `GameInfo` / `WinModal` / `PromotionPicker` on Tailwind + tokens
- [ ] Build `packages/ui` primitives: `Button`, `IconButton`, `Card`, `Input`, `Select`, `Switch`, `Dialog`, `Tooltip`, `Tabs`, `Badge`, `Avatar`
- [ ] Board themes (parchment, slate, marble, neon)
- [ ] Piece-set selector (default, classic, minimal)
- [ ] Board flip + coordinates toggle
- [ ] `MoveList` component with FGN notation
- [ ] Takeback / undo
- [ ] FGN serializer + parser (`packages/rules`)
- [ ] FGN export / import in UI
- [ ] `Clock` component (even though clocks only matter online)
- [ ] Sound system: `useSound()` hook + pack (move, capture, check, mate, promotion, warning, win)
- [ ] Master mute + per-event volume
- [ ] Settings page (theme, piece set, sounds, coords, board flip default)
- [ ] Persist settings to localStorage
- [ ] Keyboard nav across squares (arrows + Enter/Space)
- [ ] `aria-live` move announcements
- [ ] Color-blind mode (pattern overlays)
- [ ] `prefers-reduced-motion` support
- [ ] Responsive down to 360px
- [ ] Animations: move slide, capture fade, **Flanker arc**, **Warlord pursuit pulse**, check shake + glow, promotion slide-in, win confetti

## Phase 2 — Accounts & profiles

- [ ] Integrate chosen auth provider
- [ ] User schema (id, username, country, avatar, bio, created_at)
- [ ] Username reservation + profanity filter
- [ ] Profile page
- [ ] Settings page wired to user record
- [ ] Avatar upload (S3 or provider)
- [ ] Sign-in / sign-up / forgot-password flows
- [ ] Email verification

## Phase 3 — Play with a friend

- [ ] Create-game modal (time control, color, rated/unrated)
- [ ] Shareable invite link `/play/:inviteCode`
- [ ] Realtime room per game on chosen backend
- [ ] Server-authoritative move validation
- [ ] Spectator mode (read-only)
- [ ] Resign, draw offer, abort
- [ ] Emoji reactions (no chat yet)
- [ ] Reconnect handling
- [ ] Clock infra integrated (client + server)
- [ ] Clock drift / latency compensation
- [ ] Same-device hot-seat flow

## Phase 4 — Bot play

- [ ] `packages/bot` scaffold
- [ ] Bitboard or array-based position repr (benchmark both)
- [ ] Legal move generator piggybacking `@frontline/rules`
- [ ] Negamax + alpha-beta
- [ ] Iterative deepening
- [ ] Transposition table (Zobrist hashing)
- [ ] Move ordering: MVV-LVA, killer moves, history heuristic
- [ ] Evaluation: material + piece-square tables + mobility + king safety + guard structure + warlord activity
- [ ] Tune piece-square tables via self-play
- [ ] Hand-authored opening book (20–50 lines)
- [ ] Strength levels 1–10 (depth / time / eval noise)
- [ ] Personalities: aggressive, defensive, tactical, positional
- [ ] Web Worker wrapper for client use
- [ ] Bot-vs-bot test harness
- [ ] UI: "Play the bot" flow with strength + personality pickers
- [ ] Hints / takebacks for unrated bot games

## Phase 5 — Online matchmaking & rated play

- [ ] Time controls: bullet 1+0, 3+0 / blitz 3+2, 5+3 / rapid 10+0, 15+10 / correspondence
- [ ] Glicko-2 implementation (`packages/rules` or its own package)
- [ ] Rating per time control
- [ ] Matchmaking queue (rating-band FIFO)
- [ ] Pre-game lobby / "searching" UI
- [ ] Server validates every move
- [ ] Abort-in-first-move rule (no rating change)
- [ ] Disconnection handling (clock keeps running, rejoin)
- [ ] Post-game modal with rating delta + FGN download
- [ ] Game archive per user
- [ ] Leaderboards per time control, per country
- [ ] Provisional rating display (±RD)

## Phase 6 — Puzzles

- [ ] `packages/puzzles` scaffold
- [ ] Bot self-play harness (runs N games at given strengths)
- [ ] Position mining: detect `eval_delta > threshold` after forcing line
- [ ] Classify: mate-in-N, tactic, endgame, commander-swap, warlord-pursuit tactic
- [ ] Postgres schema: `puzzles` (fen, solution, tags, difficulty, ratings_stats)
- [ ] Puzzle Glicko rating
- [ ] UI: solve view, hint system, next puzzle
- [ ] Modes: Rated puzzles, Streak, Rush (3 min), Storm (endless)
- [ ] Puzzle of the day + leaderboards
- [ ] Tag filters, difficulty slider

## Phase 7 — Learn / content

- [ ] Interactive piece tutorial (one per piece)
- [ ] Beginner lesson: Objective + Commander
- [ ] Lesson: Guard movement, promotion, en passant
- [ ] Lesson: Cannon, Striker, Flanker, Warlord
- [ ] Lesson: Commander swap
- [ ] Lesson: Checkmate patterns
- [ ] Lesson: Match scoring & efficiency
- [ ] Analysis board: load any FGN, step through, branches
- [ ] Eval bar + best-move hints in analysis
- [ ] Opening explorer (populated from ranked game DB)

## Phase 8 — Tournaments, clubs, social

- [ ] Arena tournament engine (Glicko-weighted pairings)
- [ ] Tournament create/join flow
- [ ] Live tournament standings
- [ ] Clubs/teams CRUD
- [ ] Club membership roles (owner, admin, member)
- [ ] Team match format
- [ ] Follow / friends
- [ ] Direct messages (careful — moderation)
- [ ] Streamers page + broadcast mode

## Phase 9 — Anti-cheat

- [ ] Log move times per game
- [ ] Compute engine correlation at moderate depth post-game
- [ ] Accuracy metric per player per game
- [ ] Suspicion score model
- [ ] Review queue for mods
- [ ] Rating freeze / shadow queue / ban actions
- [ ] Appeals inbox
- [ ] Public transparency reports (optional)

## Phase 10 — Mobile & monetization

- [ ] PWA manifest + service worker
- [ ] Offline bot play
- [ ] React Native or Capacitor shell for iOS / Android
- [ ] Stripe integration
- [ ] Premium tier (deeper analysis, unlimited puzzles, no ads, coaching tools)
- [ ] Cosmetics shop (board themes, piece sets)
- [ ] Gift subscriptions

---

## Nice-to-haves / backlog

- [ ] Commissioned piece art set ("Legions", "Crusade", "Cyber")
- [ ] Replay sharing with auto-generated highlight GIF
- [ ] Coaching marketplace
- [ ] OTB (over-the-board) mode — two players on one device, simplified UI
- [ ] Twitch extension
- [ ] Daily email digest (puzzle of the day, top games)
- [ ] Opening preparation tool (private repertoire)
- [ ] API + bot-developer portal
