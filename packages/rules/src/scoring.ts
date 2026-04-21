import type { Color, MatchState, Piece, RoundScore, RoundState } from './types'
import { MATERIAL_NORMALIZER, PIECE_VALUES } from './constants'

export function computeMaterial(pieces: Piece[]): number {
  return pieces.reduce((sum, p) => {
    const val = PIECE_VALUES[p.type]
    return sum + (isFinite(val) ? val : 0)
  }, 0)
}

export function computeRoundScore(round: RoundState): RoundScore {
  const winner = round.winner!

  // Material remaining on board per side (excludes Commander from calculation)
  const redMaterial = computeMaterial(
    round.board.flat().filter((p): p is Piece => p !== null && p.color === 'red')
  )
  const blueMaterial = computeMaterial(
    round.board.flat().filter((p): p is Piece => p !== null && p.color === 'blue')
  )

  const winnerMaterial = winner === 'red' ? redMaterial : blueMaterial
  const loserMaterial = winner === 'red' ? blueMaterial : redMaterial

  const efficiency = Math.max(0, (winnerMaterial - loserMaterial) / MATERIAL_NORMALIZER)
  const winnerPoints = parseFloat((1 + efficiency).toFixed(3))

  return { winner, winnerPoints, loserPoints: 0 }
}

export function updateMatchState(match: MatchState, score: RoundScore): MatchState {
  const roundWins = { ...match.roundWins }
  roundWins[score.winner] += 1

  const redMatchPoints =
    match.redMatchPoints + (score.winner === 'red' ? score.winnerPoints : score.loserPoints)
  const blueMatchPoints =
    match.blueMatchPoints + (score.winner === 'blue' ? score.winnerPoints : score.loserPoints)

  const winsNeeded = Math.ceil(match.format / 2)
  const matchWinner: Color | null =
    roundWins.red >= winsNeeded ? 'red' : roundWins.blue >= winsNeeded ? 'blue' : null

  return {
    ...match,
    roundScores: [...match.roundScores, score],
    roundWins,
    redMatchPoints,
    blueMatchPoints,
    matchWinner,
  }
}
