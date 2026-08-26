import type { Position } from './types'

export type IsometryType = 'none' | 'rotate90' | 'rotate180' | 'rotate270' | 'flipH' | 'flipV'

/**
 * Applique une transformation isométrique (rotation ou réflexion) à une matrice de biomes et à la solution associée.
 */
export function applyIsometry(
  size: number,
  biomes: number[][],
  solution: Position[],
  transform: IsometryType
): { biomes: number[][]; solution: Position[] } {
  if (transform === 'none') {
    return {
      biomes: biomes.map(row => [...row]),
      solution: solution.map(p => ({ ...p }))
    }
  }

  const newBiomes: number[][] = Array.from({ length: size }, () => Array(size).fill(0))

  function mapCoord(r: number, c: number): Position {
    switch (transform) {
      case 'rotate90':
        // (r, c) -> (c, size - 1 - r)
        return { row: c, col: size - 1 - r }
      case 'rotate180':
        // (r, c) -> (size - 1 - r, size - 1 - c)
        return { row: size - 1 - r, col: size - 1 - c }
      case 'rotate270':
        // (r, c) -> (size - 1 - c, r)
        return { row: size - 1 - c, col: r }
      case 'flipH':
        // (r, c) -> (r, size - 1 - c)
        return { row: r, col: size - 1 - c }
      case 'flipV':
        // (r, c) -> (size - 1 - r, c)
        return { row: size - 1 - r, col: c }
      default:
        return { row: r, col: c }
    }
  }

  // Remplir la nouvelle matrice de biomes
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const mapped = mapCoord(r, c)
      newBiomes[mapped.row][mapped.col] = biomes[r][c]
    }
  }

  // Transformer les positions de la solution
  const newSolution: Position[] = solution.map(p => mapCoord(p.row, p.col)).sort((a, b) => a.row - b.row)

  return {
    biomes: newBiomes,
    solution: newSolution
  }
}

/**
 * Permute aléatoirement les identifiants de biomes (0 à N-1) pour changer la répartition des couleurs
 * sans modifier le graphe logique sous-jacent.
 */
export function shuffleBiomeColors(size: number, biomes: number[][]): number[][] {
  // Générer une permutation aléatoire des N identifiants
  const permutation = Array.from({ length: size }, (_, i) => i)
  for (let i = size - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = permutation[i]
    permutation[i] = permutation[j]
    permutation[j] = temp
  }

  const result: number[][] = Array.from({ length: size }, () => Array(size).fill(0))
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      result[r][c] = permutation[biomes[r][c]]
    }
  }

  return result
}

/**
 * Applique la transformation anti-mémorisation complète (isométrie aléatoire + permutation de couleurs)
 * lors de la reprise d'un niveau après échec.
 */
export function applyAntiMemorizationTransform(
  size: number,
  biomes: number[][],
  solution: Position[]
): { biomes: number[][]; solution: Position[]; transformApplied: IsometryType } {
  const transforms: IsometryType[] = ['rotate90', 'rotate180', 'rotate270', 'flipH', 'flipV']
  const chosenTransform = transforms[Math.floor(Math.random() * transforms.length)]

  const isometrized = applyIsometry(size, biomes, solution, chosenTransform)
  const recoloredBiomes = shuffleBiomeColors(size, isometrized.biomes)

  return {
    biomes: recoloredBiomes,
    solution: isometrized.solution,
    transformApplied: chosenTransform
  }
}
