# Frontline — Design System

Frontline is a strategy game about factions at war. The UI should feel **tactical, warm, premium, slightly brutalist** — closer to _Into the Breach_ or _Advance Wars_ than chess.com's polished-but-generic green/beige.

Principles:

1. **Red vs Blue factions, not black vs white.** The color identity is a differentiator; don't water it down.
2. **Warm, not neutral.** Warm greys and parchment instead of pure cool greys. The board is walnut + cream, not slate.
3. **Dark mode default.** Most players play in the evening.
4. **Purposeful motion.** Every animation sells a game mechanic (Flanker leaps, Warlord pursuits, Commander is in check).
5. **Accessibility is not an afterthought.** Keyboard, screen-reader, and color-blind modes shipped in Phase 1.

---

## 1. Design tokens

Implemented as Tailwind v4 `@theme` + CSS custom properties so they're available to non-Tailwind consumers (Canvas, SVG, inline styles).

```css
@theme {
  /* ----- Brand / factions ----- */
  --color-red-faction: oklch(62% 0.19 28);
  --color-red-faction-dark: oklch(48% 0.18 28);
  --color-red-faction-glow: oklch(72% 0.18 28 / 0.35);
  --color-blue-faction: oklch(58% 0.15 245);
  --color-blue-faction-dark: oklch(42% 0.13 245);
  --color-blue-faction-glow: oklch(70% 0.15 245 / 0.35);

  /* ----- Board ----- */
  --color-board-light: oklch(92% 0.03 75); /* cream parchment */
  --color-board-dark: oklch(52% 0.07 45); /* warm walnut */
  --color-board-border: oklch(28% 0.05 40);

  /* ----- Surfaces (dark-mode default) ----- */
  --color-surface-0: oklch(15% 0.01 40); /* app bg */
  --color-surface-1: oklch(19% 0.01 40); /* card */
  --color-surface-2: oklch(24% 0.015 40); /* elevated */
  --color-surface-3: oklch(30% 0.02 40); /* overlay / modal */

  /* ----- Text ----- */
  --color-fg: oklch(96% 0.01 80);
  --color-fg-muted: oklch(72% 0.015 80);
  --color-fg-subtle: oklch(52% 0.01 80);

  /* ----- Semantic ----- */
  --color-success: oklch(70% 0.17 150);
  --color-warning: oklch(78% 0.15 75);
  --color-danger: oklch(62% 0.22 25);
  --color-accent: oklch(78% 0.16 85); /* gold — pursuit, promo, win */

  /* ----- Board overlays ----- */
  --color-move-dot: oklch(28% 0.03 40 / 0.35);
  --color-move-capture: oklch(62% 0.22 25 / 0.55);
  --color-last-move: oklch(78% 0.16 85 / 0.35);
  --color-check: oklch(62% 0.22 25 / 0.65);
  --color-selected: oklch(78% 0.16 85 / 0.55);
  --color-pursuit: oklch(78% 0.16 85 / 0.6);

  /* ----- Radii ----- */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
  --radius-pill: 999px;

  /* ----- Spacing (4px base) ----- */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;

  /* ----- Type ----- */
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-display: 'Space Grotesk', 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  --text-xs: 12px;
  --text-sm: 13px;
  --text-md: 15px;
  --text-lg: 17px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 32px;
  --text-4xl: 44px;
  --text-5xl: 60px;

  /* ----- Shadows (warm, not neutral) ----- */
  --shadow-sm: 0 1px 2px oklch(0% 0 0 / 0.3);
  --shadow-md: 0 4px 12px oklch(0% 0 0 / 0.35);
  --shadow-lg: 0 16px 40px oklch(0% 0 0 / 0.45);
  --shadow-board: 0 20px 60px oklch(15% 0.05 40 / 0.6);
  --shadow-glow-red: 0 0 20px var(--color-red-faction-glow);
  --shadow-glow-blue: 0 0 20px var(--color-blue-faction-glow);

  /* ----- Motion ----- */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 120ms;
  --duration-base: 200ms;
  --duration-slow: 320ms;
  --duration-move: 180ms;
}
```

Light-mode override flips surfaces + text tokens; brand/board/semantic stay the same.

---

## 2. Typography

| Use                             | Font           | Weight    | Notes                                |
| ------------------------------- | -------------- | --------- | ------------------------------------ |
| Display (hero, match result)    | Space Grotesk  | 600       | tracking −0.02em                     |
| Headings                        | Inter          | 600       |                                      |
| Body                            | Inter          | 400 / 500 |                                      |
| Tabular (clocks, rating, score) | Inter          | 500       | `font-variant-numeric: tabular-nums` |
| Move notation                   | JetBrains Mono | 500       |                                      |

Scale uses tokens `--text-xs` … `--text-5xl`.

---

## 3. Components (build order)

### Foundation primitives

1. `Button` — variants: `primary`, `secondary`, `ghost`, `danger`, `faction-red`, `faction-blue`; sizes `sm`, `md`, `lg`
2. `IconButton`, `ButtonGroup`
3. `Card` / `Panel` (surface-1, `--radius-lg`, subtle border)
4. `Input`, `Select`, `Checkbox`, `Switch`, `Slider`, `RadioGroup`, `Textarea`
5. `Avatar` (with faction-color ring)
6. `Badge` (rating, country flag, title)
7. `Tooltip`, `Popover`, `Dialog`, `Sheet`, `Toast` — use Radix primitives, restyle to tokens
8. `Tabs`, `SegmentedControl`
9. `Table` (games list, leaderboard)

### Game-specific components

10. `Piece` — add drag, ghost preview, promotion flip animation
11. `Square` — coords, highlight states (selected, legal-move, capture, last-move, check, pursuit)
12. `Board` — responsive `min(90vmin, 720px)`, flip, file/rank labels
13. `Clock` — large tabular-nums, pulse when active, danger flash <10s
14. `MoveList` — scrollable, grouped by move number, click-to-scrub, keyboard nav
15. `PlayerCard` — avatar + name + rating + clock + captured strip + material delta
16. `CapturedPieces` — mini icons, grouped by type, material-diff badge
17. `EvalBar` — vertical, red top / blue bottom, smooth tween
18. `PromotionPicker` — slides in from promotion square, slight scale-in
19. `GameResultModal` — dramatic, faction-tinted
20. `MatchScore` — shows round-by-round scores, efficiency bonuses, BO3/BO5 dots

---

## 4. Iconography

- UI icons: **Phosphor** (`@phosphor-icons/react`) — installed via the shadcn radix-lyra preset
- Piece icons: **custom SVGs, commissioned or in-house**. Off-the-shelf chess pieces will make the product feel like a chess knock-off.

Piece silhouette brief (must read at 32px):

| Piece     | Motif                              |
| --------- | ---------------------------------- |
| Commander | crown + star                       |
| Guard     | shield / basic infantry silhouette |
| Cannon    | artillery piece, horizontal        |
| Striker   | angled spearhead                   |
| Flanker   | dual arrows / leap motif           |
| Warlord   | horned helm / heavy silhouette     |

Rules: faction color via fill (not outline); single-color silhouettes; balanced visual weight across piece types (Warlord and Commander should feel heavier than Guard).

---

## 5. Motion language

Every animation should communicate game state, not just look nice.

| Event                  | Animation                                                                      |
| ---------------------- | ------------------------------------------------------------------------------ |
| Normal move            | Slide with `--duration-move` + `--ease-out`                                    |
| Capture                | Incoming slides; captured scales 0.3 + fades out                               |
| **Flanker leap**       | Parabolic arc (not a straight slide) — sells "leaps over pieces"               |
| **Warlord pursuit**    | Gold outline pulse 2× around the board after the capture                       |
| **Commander in check** | Commander square shakes 1× (rotate ±2°) + red glow                             |
| Promotion              | Picker slides in from the promotion square with a subtle scale                 |
| Round win              | Confetti in winner's faction color; efficiency bonus counts up in tabular-nums |
| Clock danger (<10s)    | Pulse + red tint                                                               |

Respect `prefers-reduced-motion`: drop slides and arcs, keep opacity changes only.

---

## 6. Sound

Underrated, huge UX win. Ship in Phase 1.

- `move` — soft wood click
- `capture` — sharper thud
- `check` — low horn
- `checkmate` — drum hit
- `promotion` — chime
- `warning` — ticking under 10s
- `round_win` — short fanfare

Behind a single `useSound()` hook with master mute + per-event volume.

Packs: Freesound / Soundly, or commission ~$200 custom.

---

## 7. Responsive (mobile-first)

**Every component is designed for 360px first.** Larger layouts are progressive enhancements via min-width breakpoints — never the default.

### Breakpoints (Tailwind v4 min-width)

| Name | Min-width | Notes |
| ---- | --------- | ----- |
| `sm` | 640px     | Large phone / small tablet |
| `md` | 768px     | Tablet portrait |
| `lg` | 1024px    | Tablet landscape / small laptop |
| `xl` | 1280px    | Desktop |

### Layout tiers

**Mobile (< 640px) — default, designed first:**
- Board fills `min(90vmin, 600px)` — always square, always usable
- Sidebars (GameInfo, MatchScore) stack vertically below the board
- Touch-first: tap-to-select as primary interaction; drag optional
- Tap targets ≥ 44×44px on all interactive elements
- No hover-only affordances — everything accessible via tap
- Modals (WinModal, PromotionPicker) full-width with generous tap targets

**Tablet (`md` 768px+):**
- Board centered, single sidebar visible (toggle between GameInfo / MatchScore)
- Sidebars may appear as a bottom sheet or slide-over panel

**Desktop (`lg` 1024px+):**
- Three-column layout: GameInfo | Board | MatchScore
- Drag-and-drop as primary piece interaction (drag supported on mobile too)
- Hover states and tooltip-based piece legend

### Rules for contributors

- Write mobile classes first, add `md:` / `lg:` overrides after
- Use `max-[N]:` variants only when a layout genuinely cannot be expressed mobile-first
- Never use `hover:` alone — always pair with a `focus-visible:` or tap equivalent
- Test every new component at 360px before considering it done
- Min supported: **360px wide**

---

## 8. Accessibility

- Every square is a button with `aria-label="e4, blue guard"`
- Keyboard nav with arrow keys between squares; Enter/Space to select
- `aria-live="polite"` region announces last move in plain English
- Focus rings use `--color-accent`, never removed
- Color contrast: body text ≥ 4.5:1 against its surface
- **Color-blind mode**: shape/pattern overlays on faction highlights (stripes for red, dots for blue) — toggle in settings
- `prefers-reduced-motion` honored everywhere

---

## 9. Theming

- Dark mode default; light mode is an option
- **Board themes** (cosmetic, monetizable later):
  - Parchment (default warm cream + walnut)
  - Slate (cool grey / charcoal)
  - Marble (premium white + black veining)
  - Neon (saturated dark-mode cyberpunk)
- **Piece sets**:
  - Default
  - Classic (more ornate)
  - Minimal (flat silhouettes)

Themes swap tokens, not components.

---

## 10. Content tone

- Short, punchy copy. No corporate filler.
- Confidence, not gushing. "Checkmate." beats "Amazing! You won!".
- Faction-flavored where it fits: "Red Commander falls." "Blue takes the frontline."
- Error messages: direct and honest. No emojis in UI copy.
