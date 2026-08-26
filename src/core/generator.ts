import type { Position, PuzzleDefinition, DifficultyRating } from './types'
import { getOrthogonalNeighbors, areMooreNeighbors } from './invariants'
import { solvePuzzle } from './solver'

/**
 * Génère un placement valide de N arbres non-adjacents (aucun 8-voisin de Moore).
 */
export function generateTreePlacement(size: number, maxRetries = 500): Position[] | null {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const cols = Array.from({ length: size }, (_, i) => i)
    const placed: Position[] = []

    function backtrack(row: number): boolean {
      if (row === size) return true

      // Mélanger les colonnes candidates
      const shuffledCols = [...cols].filter(c => !placed.some(p => p.col === c))
      for (let i = shuffledCols.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = shuffledCols[i]
        shuffledCols[i] = shuffledCols[j]
        shuffledCols[j] = temp
      }

      for (const c of shuffledCols) {
        const candidate: Position = { row, col: c }
        // Vérifier qu'aucun arbre précédent n'est un 8-voisin
        const conflicts = placed.some(p => areMooreNeighbors(p, candidate))
        if (!conflicts) {
          placed.push(candidate)
          if (backtrack(row + 1)) return true
          placed.pop()
        }
      }
      return false
    }

    if (backtrack(0)) {
      return placed.sort((a, b) => a.row - b.row)
    }
  }

  return null
}

/**
 * Partitionne la grille en N biomes connexes orthogonaux équilibrés (4-connexes)
 * à partir des N graines d'arbres.
 */
export function generateBiomesFromSeeds(size: number, seeds: Position[]): number[][] {
  const biomes: number[][] = Array.from({ length: size }, () => Array(size).fill(-1))
  const biomeLists: Position[][] = seeds.map(s => [{ row: s.row, col: s.col }])

  for (let i = 0; i < size; i++) {
    biomes[seeds[i].row][seeds[i].col] = i
  }

  let unassigned = size * size - size
  let maxIters = 2000

  while (unassigned > 0 && maxIters-- > 0) {
    // Trier les biomes par taille croissante pour équilibrer les territoires
    const sortedBiomes = Array.from({ length: size }, (_, i) => i).sort(
      (a, b) => biomeLists[a].length - biomeLists[b].length
    )

    let progress = false
    for (const b of sortedBiomes) {
      if (unassigned === 0) break
      const neighbors: Position[] = []
      for (const cell of biomeLists[b]) {
        for (const n of getOrthogonalNeighbors(cell.row, cell.col, size)) {
          if (biomes[n.row][n.col] === -1 && !neighbors.some(p => p.row === n.row && p.col === n.col)) {
            neighbors.push(n)
          }
        }
      }

      if (neighbors.length > 0) {
        const chosen = neighbors[Math.floor(Math.random() * neighbors.length)]
        biomes[chosen.row][chosen.col] = b
        biomeLists[b].push(chosen)
        unassigned--
        progress = true
      }
    }
    if (!progress) break
  }

  // Remplissage des cases isolées éventuelles
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (biomes[r][c] === -1) {
        const neighbors = getOrthogonalNeighbors(r, c, size).filter(n => biomes[n.row][n.col] !== -1)
        if (neighbors.length > 0) {
          const chosen = neighbors[0]
          biomes[r][c] = biomes[chosen.row][chosen.col]
          biomeLists[biomes[r][c]].push({ row: r, col: c })
        }
      }
    }
  }

  return biomes
}

/**
 * Génère un puzzle certifié ayant strictement UNE UNIQUE solution
 * grâce à l'élimination itérative des solutions alternatives.
 */
export function generatePuzzle(
  size: number,
  id: string,
  targetDifficulty?: DifficultyRating,
  maxAttempts = 150
): PuzzleDefinition | null {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const seeds = generateTreePlacement(size)
    if (!seeds) continue

    let biomes = generateBiomesFromSeeds(size, seeds)

    // Boucle de raffinement : élimination ciblée des solutions alternatives
    for (let ref = 0; ref < 200; ref++) {
      const res = solvePuzzle(size, biomes, 2)
      if (res.isUnique && res.solutions.length === 1) {
        if (!targetDifficulty || res.difficultyRating === targetDifficulty) {
          return {
            id,
            size,
            biomes,
            solution: seeds,
            difficultyRating: res.difficultyRating,
            deductionSteps: res.deductionSteps
          }
        }
        break
      }

      if (res.solutions.length < 2) break

      const altSol = res.solutions.find(
        sol => !sol.every((p, idx) => p.row === seeds[idx].row && p.col === seeds[idx].col)
      )
      if (!altSol) break

      // Trouver les arbres alternatifs non présents dans la solution cible
      const altTrees = altSol.filter(p => !seeds.some(s => s.row === p.row && s.col === p.col))
      if (altTrees.length === 0) break

      const chosenAlt = altTrees[Math.floor(Math.random() * altTrees.length)]
      const otherAltTrees = altSol.filter(p => p.row !== chosenAlt.row || p.col !== chosenAlt.col)
      const candidateBiomes = [...new Set(otherAltTrees.map(t => biomes[t.row][t.col]))]

      const neighbors = getOrthogonalNeighbors(chosenAlt.row, chosenAlt.col, size)
      const matchingNeighbor = neighbors.find(n => candidateBiomes.includes(biomes[n.row][n.col]))

      if (matchingNeighbor) {
        biomes[chosenAlt.row][chosenAlt.col] = biomes[matchingNeighbor.row][matchingNeighbor.col]
      } else {
        const anyNeighbor = neighbors.find(n => biomes[n.row][n.col] !== biomes[chosenAlt.row][chosenAlt.col])
        if (anyNeighbor) {
          biomes[chosenAlt.row][chosenAlt.col] = biomes[anyNeighbor.row][anyNeighbor.col]
        }
      }
    }
  }

  return null
}
