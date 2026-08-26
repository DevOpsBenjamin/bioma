import type { Position, PuzzleDefinition, DifficultyRating } from './types'
import { getOrthogonalNeighbors, areMooreNeighbors, areAllBiomes4Connected } from './invariants'
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
 * à partir des N graines d'arbres en favorisant des formes compactes et organiques.
 */
export function generateBiomesFromSeeds(size: number, seeds: Position[]): number[][] {
  const biomes: number[][] = Array.from({ length: size }, () => Array(size).fill(-1))
  const biomeLists: Position[][] = seeds.map(s => [{ row: s.row, col: s.col }])

  for (let i = 0; i < size; i++) {
    biomes[seeds[i].row][seeds[i].col] = i
  }

  let unassigned = size * size - size
  let maxIters = 2500

  while (unassigned > 0 && maxIters-- > 0) {
    // Trier les biomes par taille croissante pour équilibrer les territoires
    const sortedBiomes = Array.from({ length: size }, (_, i) => i).sort(
      (a, b) => biomeLists[a].length - biomeLists[b].length
    )

    let progress = false
    for (const b of sortedBiomes) {
      if (unassigned === 0) break
      const seed = seeds[b]
      const neighbors: { row: number; col: number; dist: number }[] = []

      for (const cell of biomeLists[b]) {
        for (const n of getOrthogonalNeighbors(cell.row, cell.col, size)) {
          if (biomes[n.row][n.col] === -1 && !neighbors.some(p => p.row === n.row && p.col === n.col)) {
            const dist = Math.hypot(n.row - seed.row, n.col - seed.col) + Math.random() * 0.6
            neighbors.push({ row: n.row, col: n.col, dist })
          }
        }
      }

      if (neighbors.length > 0) {
        neighbors.sort((a, b) => a.dist - b.dist)
        const chosen = neighbors[0]
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
 * Vérification ultra-rapide (en sous-graphe local) qu'en retirant (r, c),
 * le biome d'origine reste strictement 4-connexe sans être coupé en deux.
 */
function isBiomeConnectedAfterRemoval(
  size: number,
  biomes: number[][],
  r: number,
  c: number,
  biomeId: number
): boolean {
  const neighbors = getOrthogonalNeighbors(r, c, size).filter(n => biomes[n.row][n.col] === biomeId)
  if (neighbors.length === 0) return false
  if (neighbors.length === 1) return true // Nœud feuille : ne coupe jamais le graphe !

  // BFS local pour vérifier que neighbors[0] est connecté aux autres voisins dans biomeId sans passer par (r, c)
  const targetKeys = new Set(neighbors.slice(1).map(n => `${n.row},${n.col}`))
  const visited = new Set<string>()
  const queue = [neighbors[0]]
  visited.add(`${neighbors[0].row},${neighbors[0].col}`)
  visited.add(`${r},${c}`) // Bloquer le nœud retiré

  while (queue.length > 0) {
    const curr = queue.shift()!
    const nextNeighbors = getOrthogonalNeighbors(curr.row, curr.col, size).filter(
      n => biomes[n.row][n.col] === biomeId && !visited.has(`${n.row},${n.col}`)
    )
    for (const n of nextNeighbors) {
      const key = `${n.row},${n.col}`
      visited.add(key)
      targetKeys.delete(key)
      if (targetKeys.size === 0) return true
      queue.push(n)
    }
  }

  return targetKeys.size === 0
}

/**
 * Génère un puzzle certifié ayant strictement UNE UNIQUE solution
 * et garantissant que TOUS les biomes sont 100% 4-connexes (d'un seul tenant).
 */
export function generatePuzzle(
  size: number,
  id: string,
  targetDifficulty?: DifficultyRating,
  maxAttempts = 500
): PuzzleDefinition | null {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const seeds = generateTreePlacement(size)
    if (!seeds) continue

    const biomes = generateBiomesFromSeeds(size, seeds)

    // Boucle de raffinement : élimination ciblée des alternatives avec préservation 4-connexe
    for (let ref = 0; ref < 200; ref++) {
      const res = solvePuzzle(size, biomes, 2)
      if (res.isUnique && res.solutions.length === 1 && areAllBiomes4Connected(size, biomes)) {
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

      let modified = false
      for (const t of altTrees) {
        const curB = biomes[t.row][t.col]
        if (!isBiomeConnectedAfterRemoval(size, biomes, t.row, t.col, curB)) continue
        const neighbors = getOrthogonalNeighbors(t.row, t.col, size)
        const diffNeighbors = neighbors.filter(n => biomes[n.row][n.col] !== curB)
        if (diffNeighbors.length > 0) {
          const chosen = diffNeighbors[Math.floor(Math.random() * diffNeighbors.length)]
          biomes[t.row][t.col] = biomes[chosen.row][chosen.col]
          modified = true
          break
        }
      }

      if (!modified) {
        const borders: { r: number; c: number; nb: number }[] = []
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (seeds.some(s => s.row === r && s.col === c)) continue
            const curB = biomes[r][c]
            if (!isBiomeConnectedAfterRemoval(size, biomes, r, c, curB)) continue
            const nbs = getOrthogonalNeighbors(r, c, size).filter(n => biomes[n.row][n.col] !== curB)
            if (nbs.length > 0) {
              borders.push({ r, c, nb: biomes[nbs[0].row][nbs[0].col] })
            }
          }
        }
        if (borders.length > 0) {
          const ch = borders[Math.floor(Math.random() * borders.length)]
          biomes[ch.r][ch.c] = ch.nb
        }
      }
    }
  }

  return null
}
