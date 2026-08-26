import type { Position, Grid, ValidationResult, InvariantViolation } from './types'

/**
 * Vérifie si deux positions sont voisines au sens de Moore (8-voisins : adjacentes horizontalement, verticalement ou diagonalement).
 */
export function areMooreNeighbors(p1: Position, p2: Position): boolean {
  const dr = Math.abs(p1.row - p2.row)
  const dc = Math.abs(p1.col - p2.col)
  return (dr <= 1 && dc <= 1) && !(dr === 0 && dc === 0)
}

/**
 * Retourne les positions des 8 voisins de Moore valides dans la grille.
 */
export function getMooreNeighbors(row: number, col: number, size: number): Position[] {
  const neighbors: Position[] = []
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = row + dr
      const nc = col + dc
      if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
        neighbors.push({ row: nr, col: nc })
      }
    }
  }
  return neighbors
}

/**
 * Retourne les 4 voisins orthogonaux valides dans la grille (connexité 4).
 */
export function getOrthogonalNeighbors(row: number, col: number, size: number): Position[] {
  const neighbors: Position[] = []
  const deltas = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ]
  for (const [dr, dc] of deltas) {
    const nr = row + dr
    const nc = col + dc
    if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
      neighbors.push({ row: nr, col: nc })
    }
  }
  return neighbors
}

/**
 * Vérifie si une position candidate fait partie de la solution unique du puzzle (Évaluation Hardcore One-Strike).
 */
export function isPositionInSolution(target: Position, solution: Position[]): boolean {
  return solution.some(p => p.row === target.row && p.col === target.col)
}

/**
 * Valide l'ensemble de la grille pour vérifier les 4 invariants fondamentaux :
 * 1. Exactement 1 arbre par ligne
 * 2. Exactement 1 arbre par colonne
 * 3. Exactement 1 arbre par biome
 * 4. Aucun contact parmi les 8-voisins de Moore
 */
export function validateBoard(size: number, biomes: number[][], trees: Position[]): ValidationResult {
  const violations: InvariantViolation[] = []

  // 1. Vérification du nombre d'arbres total
  if (trees.length !== size) {
    violations.push({
      type: 'ROW',
      positions: [...trees],
      message: `La grille doit contenir exactement ${size} arbres (actuellement ${trees.length}).`
    })
  }

  // 2. Unicité par Ligne
  const rowMap = new Map<number, Position[]>()
  for (const tree of trees) {
    const list = rowMap.get(tree.row) || []
    list.push(tree)
    rowMap.set(tree.row, list)
  }
  for (let r = 0; r < size; r++) {
    const inRow = rowMap.get(r) || []
    if (inRow.length !== 1) {
      violations.push({
        type: 'ROW',
        positions: inRow,
        message: `La ligne ${r + 1} doit contenir exactement 1 arbre (${inRow.length} présents).`
      })
    }
  }

  // 3. Unicité par Colonne
  const colMap = new Map<number, Position[]>()
  for (const tree of trees) {
    const list = colMap.get(tree.col) || []
    list.push(tree)
    colMap.set(tree.col, list)
  }
  for (let c = 0; c < size; c++) {
    const inCol = colMap.get(c) || []
    if (inCol.length !== 1) {
      violations.push({
        type: 'COL',
        positions: inCol,
        message: `La colonne ${c + 1} doit contenir exactement 1 arbre (${inCol.length} présents).`
      })
    }
  }

  // 4. Unicité par Biome
  const biomeMap = new Map<number, Position[]>()
  for (const tree of trees) {
    const bId = biomes[tree.row]?.[tree.col]
    if (bId !== undefined) {
      const list = biomeMap.get(bId) || []
      list.push(tree)
      biomeMap.set(bId, list)
    }
  }
  for (let b = 0; b < size; b++) {
    const inBiome = biomeMap.get(b) || []
    if (inBiome.length !== 1) {
      violations.push({
        type: 'BIOME',
        positions: inBiome,
        message: `Le biome ${b + 1} doit contenir exactement 1 arbre (${inBiome.length} présents).`
      })
    }
  }

  // 5. Règle des 8-voisins de Moore
  for (let i = 0; i < trees.length; i++) {
    for (let j = i + 1; j < trees.length; j++) {
      const t1 = trees[i]
      const t2 = trees[j]
      if (areMooreNeighbors(t1, t2)) {
        violations.push({
          type: 'NEIGHBOR',
          positions: [t1, t2],
          message: `Les arbres en (${t1.row + 1}, ${t1.col + 1}) et (${t2.row + 1}, ${t2.col + 1}) se touchent (8-voisins interdits).`
        })
      }
    }
  }

  return {
    isValid: violations.length === 0,
    violations
  }
}

/**
 * Extrait toutes les positions des arbres posés sur la grille.
 */
export function getPlantedTrees(grid: Grid): Position[] {
  const trees: Position[] = []
  for (let r = 0; r < grid.size; r++) {
    for (let c = 0; c < grid.size; c++) {
      if (grid.cells[r][c].state === 'TREE') {
        trees.push({ row: r, col: c })
      }
    }
  }
  return trees
}
