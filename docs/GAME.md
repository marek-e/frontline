# Frontline — Game Rules

Frontline is a deterministic, turn-based strategy game inspired by chess, designed to combine timeless simplicity with modern strategic depth.

It preserves the clarity and accessibility of classical chess while introducing new pieces and rule changes that create fresh tactical dynamics and long-term decision-making pressure.

## Core Principles

- Zero randomness — pure skill, no luck
- Simple ruleset — learn in minutes
- High skill ceiling — deep positional and tactical play
- Competitive-ready — designed for BO3 / BO5 formats
- Efficiency matters — how you win is as important as winning

## Objective

Capture the opponent's Commander (checkmate).

- If your Commander has no legal escape → you lose the round
- No hidden mechanics, no randomness, full information at all times

## Board

- 8×8 grid (same as chess)
- Symmetrical starting positions
- Red occupies ranks 1–2, Blue occupies ranks 7–8
- Red moves first

## Pieces

Frontline uses 6 original unit types.

### Commander (∞ pts)

- Moves 1 square in any direction
- Loss condition — game ends if checkmated
- **Commander Swap:** can swap positions with a friendly Cannon that has not yet moved (replaces castling)

### Guard (1 pt)

- Moves 1 square forward (non-capturing)
- Captures diagonally in all 4 directions
- Can retreat 1 square backward (non-capturing)
- **Double-step:** may advance 2 squares on its first move
- **En passant:** a Guard that just double-stepped can be captured en passant
- **Promotion:** reaching the back rank lets the player choose any piece except the Commander

### Cannon (5 pts)

- Moves any number of squares orthogonally
- Stops on the first enemy piece it hits

### Striker (3 pts)

- Moves 1–3 squares diagonally
- Also moves 1 square orthogonally
- Cannot jump over pieces

### Flanker (3 pts)

- Jumps exactly 2 squares away in any direction (16 possible targets)
- Leaps over any pieces — cannot be blocked

### Warlord (7 pts)

- Moves 1–3 squares in any direction (no jumping)
- **Pursuit:** after capturing a piece, may move 1 additional non-capturing square (or skip)

## Key Differences from Chess

- No Queen, Rook, Bishop, or Knight
- No castling (replaced by Commander Swap)
- Check and checkmate mechanics retained
- En passant (Guards only)
- Promotion to any non-Commander piece
- Guard can retreat and capture in all diagonal directions
- Warlord Pursuit (bonus step after a capture)
- Flanker leaps over pieces (cannot be blocked)
- **Losses hurt even when you win** — material lost during a round reduces your end-of-round score (see [Scoring System](#scoring-system)), so Frontline plays closer to warfare than chess: trading down to win is a bad result, and conceding a clearly lost round early can beat fighting to the last piece

## Match Format

Frontline is designed for competitive play:

- Played in Best of 3 (BO3) or Best of 5 (BO5)
- Each round is a full game
- The loser of a round moves first in the next

## Scoring System

Winning a round is not enough — efficiency matters.

Each round awards the winner:

- **+1 point** base (for winning)
- **+ up to 1.0 efficiency bonus** — half for preserving your own army, half for the margin over the opponent

```
preservation = winner_material / 37
margin       = max(0, (winner_material − loser_material) / 37)
Score        = 1 + 0.5 × preservation + 0.5 × margin
```

Material normalizer is 37 (total non-Commander material for one side). The loser always scores 0 for the round.

### Why this formula

Frontline is closer to warfare than to chess — a battle won is not enough, it has to be won cheaply. The two halves of the bonus encode that:

- **Preservation** rewards ending the round with your army mostly intact
- **Margin** rewards decisive wins over peer opposition, and prevents "surrender farming" (where a loser could resign immediately and the winner would still get a near-max score)

Worked examples (material remaining; W = winner, L = loser):

| Outcome                  |   W |   L | Score |
| ------------------------ | --: | --: | ----: |
| Flawless (loser wiped)   |  37 |   0 |  2.00 |
| Clean win                |  30 |  10 |  1.68 |
| Bloody win               |  12 |   5 |  1.25 |
| Pyrrhic win              |   8 |   0 |  1.22 |
| Loser resigns intact     |  35 |  30 |  1.54 |
| Winner barely scraped by |   6 |   4 |  1.11 |

This creates meaningful trade-offs:

- Win fast with heavy losses → low score
- Win clean with control → high score
- Losing with most of your army intact → round is lost, but the winner's bonus is capped — resign is a legitimate weapon

### Forfeiting (resignation)

Because material carries into the scoring formula, resigning is a real strategic tool, not just an act of courtesy:

- A player may resign at any time — counts as a round loss
- Resigning **freezes the current material balance** for scoring
- When a position is clearly lost, resigning early **denies the opponent extra captures** and caps their efficiency bonus
- Fighting on in a lost position mostly helps the opponent run up the score and can swing the match

Rule of thumb: if the position is lost and you can't force trades that hurt the opponent, resign — the match score you save is more valuable than the round you can't win.

## Piece Values

| Piece     | Value |
| --------- | ----- |
| Guard     | 1     |
| Striker   | 3     |
| Flanker   | 3     |
| Cannon    | 5     |
| Warlord   | 7     |
| Commander | ∞     |

## Strategic Depth

Frontline shifts focus from pure checkmate patterns to something closer to warfare: winning a battle is not enough — you need to win it cheaply.

- Resource management across rounds
- Risk vs reward in exchanges — every trade you make costs points even if you win the round
- Tempo and positioning without queen dominance
- Long-term planning in multi-round matches
- Knowing when to **resign and preserve the match** rather than bleed out a lost round

Players must constantly balance:

- Immediate victory
- Preservation of material
- Future match advantage

## Design Goals

Frontline aims to be:

- As accessible as chess
- As deep as classical strategy games
- More balanced and less explosive
- Better suited for modern competitive formats

## FGN — Frontline Game Notation

FGN is the Frontline equivalent of PGN. This is the canonical spec; all other docs link here.

### Piece letters

| Piece     | Letter   |
| --------- | -------- |
| Commander | K        |
| Warlord   | W        |
| Cannon    | C        |
| Striker   | S        |
| Flanker   | F        |
| Guard     | _(none)_ |

### Move tokens

- Capture: `x` (e.g. `Wxe4`)
- Check: `+`
- Checkmate: `#`
- Commander Swap: `O-O` (with left cannon) / `O-O-O` (with right cannon) — subject to change
- Promotion: `=W`, `=C`, `=S`, `=F` (e.g. `e8=W`)
- Warlord pursuit: chained with `~` (e.g. `Wxd5~e5`)
- En passant: `e.p.` suffix (e.g. `dxe6 e.p.`)

### Game file format

```
[Event "Frontline Championship"]
[Red "Alice"]
[Blue "Bob"]
[Format "BO3"]
[TimeControl "5+3"]
[Result "1-0"]

1. e4 e5 2. Wc3 Fb6 3. Cxd5+ Kxd5 ...
```
