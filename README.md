# Frontline

Frontline is a deterministic, turn-based strategy game inspired by chess, designed to combine timeless simplicity with modern strategic depth.

It preserves the clarity and accessibility of classical chess while introducing subtle rule changes that create new tactical dynamics and long-term decision-making pressure.


## Core Principles
	•	Zero randomness — pure skill, no luck
	•	Simple ruleset — learn in minutes
	•	High skill ceiling — deep positional and tactical play
	•	Competitive-ready — designed for BO3 / BO5 formats
	•	Efficiency matters — how you win is as important as winning


## Objective

Capture the opponent’s Commander.
	•	If your Commander is captured → you lose the round
	•	No hidden mechanics, no randomness, full information at all times


## Board
	•	8×8 grid (same as chess)
	•	Symmetrical starting positions


## Pieces

Frontline uses 6 unit types, all defined by movement only (no special abilities or text rules).

## Commander
	•	Moves 1 square in any direction
	•	Equivalent to the king
	•	Loss condition if captured


## Guard
	•	Moves 1 square forward
	•	Captures diagonally forward
	•	Can move 1 square backward (non-capturing)

This single rule change introduces dynamic defense and repositioning


## Rook
	•	Moves any number of squares orthogonally


## Bishop
	•	Moves any number of squares diagonally


## Knight
	•	Moves in L-shape (same as chess)
	•	Can jump over pieces


## Captain
	•	Moves 1 or 2 squares in any direction
	•	Cannot jump over pieces

Replaces the queen with a more balanced, flexible unit


## Key Differences from Chess
	•	❌ No Queen
	•	❌ No castling
	•	❌ No en passant
	•	❌ No promotion
	•	✅ Guards can move backward
	•	✅ New piece: Captain

These changes reduce brute-force play and increase positional strategy and tempo control.


## Match Format

Frontline is designed for competitive play:
	•	Played in Best of 3 (BO3) or Best of 5 (BO5)
	•	Each round is a full game


## Scoring System (Core Innovation)

Winning a round is not enough — efficiency matters.

Each round gives:
	•	+1 point for a win
	•	+efficiency bonus based on material advantage

Example concept:
```
Score = 1 + (your remaining material − opponent’s) / X
``` 
This creates meaningful trade-offs:
	•	Win fast with heavy losses → low score
	•	Win clean with control → high score


## Strategic Depth

Frontline shifts focus from pure checkmate patterns to:
	•	Resource management
	•	Risk vs reward in exchanges
	•	Tempo and positioning without queen dominance
	•	Long-term planning across multiple rounds

Players must constantly balance:
	•	Immediate victory
	•	Preservation of material
	•	Future match advantage


## Design Goals

Frontline aims to be:
	•	As accessible as chess
	•	As deep as classical strategy games
	•	More balanced and less explosive
	•	Better suited for modern competitive formats