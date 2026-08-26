import type { Position, PuzzleDefinition, DifficultyRating } from './types'

export interface CompactLevel {
  id: number
  b: string
  d: DifficultyRating
  s: number
}

/**
 * Encode un puzzle au format chaîne ultra-compact (majuscule pour l'arbre, minuscule pour la case vide).
 */
export function encodeLevel(puzzle: PuzzleDefinition): CompactLevel {
  const size = puzzle.size
  let b = ''

  // Créer un Set des coordonnées de solution
  const solSet = new Set(puzzle.solution.map(p => `${p.row},${p.col}`))

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const biomeId = puzzle.biomes[r][c]
      let letter = String.fromCharCode(97 + biomeId) // 'a' = 97
      if (solSet.has(`${r},${c}`)) {
        letter = letter.toUpperCase()
      }
      b += letter
    }
  }

  // Extraire le numéro de niveau si le format est "level-X"
  const numericId = typeof puzzle.id === 'number' 
    ? puzzle.id 
    : parseInt(puzzle.id.replace(/\D/g, ''), 10) || 1

  return {
    id: numericId,
    b,
    d: puzzle.difficultyRating,
    s: puzzle.deductionSteps
  }
}

/**
 * Décode un puzzle depuis le format ultra-compact vers la structure complète de domaine.
 */
export function decodeLevel(compact: CompactLevel): PuzzleDefinition {
  const totalCells = compact.b.length
  const size = Math.round(Math.sqrt(totalCells))
  if (size * size !== totalCells) {
    throw new Error(`Format de niveau invalide : la longueur de chaîne ${totalCells} n'est pas un carré parfait.`)
  }

  const biomes: number[][] = Array.from({ length: size }, () => Array(size).fill(0))
  const solution: Position[] = []

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const char = compact.b[r * size + c]
      const lower = char.toLowerCase()
      const biomeId = lower.charCodeAt(0) - 97

      biomes[r][c] = biomeId

      // Si le caractère est en majuscule, c'est un arbre de la solution
      if (char >= 'A' && char <= 'Z') {
        solution.push({ row: r, col: c })
      }
    }
  }

  return {
    id: `level-${compact.id}`,
    size,
    biomes,
    solution: solution.sort((a, b) => a.row - b.row),
    difficultyRating: compact.d,
    deductionSteps: compact.s
  }
}
