import type { Position, DifficultyRating } from './types'
import { getMooreNeighbors } from './invariants'

export interface SolverResult {
  solutions: Position[][]
  isUnique: boolean
  difficultyRating: DifficultyRating
  deductionSteps: number
}

/**
 * Solveur de Contraintes (CSP Engine) pour le puzzle Bioma.
 * Utilise la propagation de contraintes (cases forcées, exclusions induites)
 * et le backtracking avec arrêt précoce à S=2 pour prouver l'unicité stricte.
 */
export function solvePuzzle(
  size: number,
  biomes: number[][],
  maxSolutions = 2
): SolverResult {
  // Matrice de candidats : true = la case peut potentiellement accueillir un arbre
  const candidates: boolean[][] = Array.from({ length: size }, () => Array(size).fill(true))

  // Pré-calcul des positions par biome
  const biomeCells: Position[][] = Array.from({ length: size }, () => [])
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const bId = biomes[r][c]
      if (bId >= 0 && bId < size) {
        biomeCells[bId].push({ row: r, col: c })
      }
    }
  }

  let deductionSteps = 0
  const solutions: Position[][] = []

  // Propagation de contraintes déductives (Singletons, Exclusions de lignes/colonnes induites)
  function propagate(cands: boolean[][]): { changed: boolean; valid: boolean; forcedTrees: Position[] } {
    let changed = false
    const forcedTrees: Position[] = []

    let progress = true
    while (progress) {
      progress = false
      deductionSteps++

      // 1. Vérification des singletons par Ligne
      for (let r = 0; r < size; r++) {
        const available: Position[] = []
        for (let c = 0; c < size; c++) {
          if (cands[r][c]) available.push({ row: r, col: c })
        }
        if (available.length === 0) return { changed, valid: false, forcedTrees }
        if (available.length === 1 && !forcedTrees.some(p => p.row === available[0].row && p.col === available[0].col)) {
          const tree = available[0]
          forcedTrees.push(tree)
          if (applyTreeConstraints(cands, tree)) {
            progress = true
            changed = true
          }
        }
      }

      // 2. Vérification des singletons par Colonne
      for (let c = 0; c < size; c++) {
        const available: Position[] = []
        for (let r = 0; r < size; r++) {
          if (cands[r][c]) available.push({ row: r, col: c })
        }
        if (available.length === 0) return { changed, valid: false, forcedTrees }
        if (available.length === 1 && !forcedTrees.some(p => p.row === available[0].row && p.col === available[0].col)) {
          const tree = available[0]
          forcedTrees.push(tree)
          if (applyTreeConstraints(cands, tree)) {
            progress = true
            changed = true
          }
        }
      }

      // 3. Vérification des singletons par Biome
      for (let b = 0; b < size; b++) {
        const available = biomeCells[b].filter(p => cands[p.row][p.col])
        if (available.length === 0) return { changed, valid: false, forcedTrees }
        if (available.length === 1 && !forcedTrees.some(p => p.row === available[0].row && p.col === available[0].col)) {
          const tree = available[0]
          forcedTrees.push(tree)
          if (applyTreeConstraints(cands, tree)) {
            progress = true
            changed = true
          }
        }
      }

      // 4. Exclusions induites : Si toutes les cases candidates d'un biome se trouvent sur la même ligne r,
      // éliminer toutes les autres cases candidates de la ligne r hors de ce biome.
      for (let b = 0; b < size; b++) {
        const available = biomeCells[b].filter(p => cands[p.row][p.col])
        if (available.length > 1) {
          const firstRow = available[0].row
          if (available.every(p => p.row === firstRow)) {
            for (let c = 0; c < size; c++) {
              if (cands[firstRow][c] && biomes[firstRow][c] !== b) {
                cands[firstRow][c] = false
                progress = true
                changed = true
              }
            }
          }

          const firstCol = available[0].col
          if (available.every(p => p.col === firstCol)) {
            for (let r = 0; r < size; r++) {
              if (cands[r][firstCol] && biomes[r][firstCol] !== b) {
                cands[r][firstCol] = false
                progress = true
                changed = true
              }
            }
          }
        }
      }
    }

    return { changed, valid: true, forcedTrees }
  }

  // Applique l'élimination des candidats autour d'un arbre posé
  function applyTreeConstraints(cands: boolean[][], tree: Position): boolean {
    let modified = false
    const { row, col } = tree
    const biome = biomes[row][col]

    // Éliminer dans la ligne
    for (let c = 0; c < size; c++) {
      if (c !== col && cands[row][c]) {
        cands[row][c] = false
        modified = true
      }
    }

    // Éliminer dans la colonne
    for (let r = 0; r < size; r++) {
      if (r !== row && cands[r][col]) {
        cands[r][col] = false
        modified = true
      }
    }

    // Éliminer dans le biome
    if (biomeCells[biome]) {
      for (const cell of biomeCells[biome]) {
        if ((cell.row !== row || cell.col !== col) && cands[cell.row][cell.col]) {
          cands[cell.row][cell.col] = false
          modified = true
        }
      }
    }

    // Éliminer les 8-voisins de Moore
    const neighbors = getMooreNeighbors(row, col, size)
    for (const n of neighbors) {
      if (cands[n.row][n.col]) {
        cands[n.row][n.col] = false
        modified = true
      }
    }

    return modified
  }

  // Backtracking avec clonage de matrice
  function search(cands: boolean[][], trees: Position[], targetRow: number) {
    if (solutions.length >= maxSolutions) return

    // Propagation de contraintes
    const prop = propagate(cands)
    if (!prop.valid) return

    // Fusionner les arbres forcés
    const allTrees = [...trees]
    for (const ft of prop.forcedTrees) {
      if (!allTrees.some(p => p.row === ft.row && p.col === ft.col)) {
        allTrees.push(ft)
      }
    }

    // Si on a placé tous les arbres nécessaires
    if (allTrees.length === size) {
      solutions.push([...allTrees].sort((a, b) => a.row - b.row))
      return
    }

    // Trouver la prochaine ligne non assignée ayant le minimum de candidats (MRV heuristic)
    let nextRow = -1
    let minCandidates = Infinity

    for (let r = 0; r < size; r++) {
      if (allTrees.some(t => t.row === r)) continue
      let count = 0
      for (let c = 0; c < size; c++) {
        if (cands[r][c]) count++
      }
      if (count === 0) return // Conflit non résoluble
      if (count < minCandidates) {
        minCandidates = count
        nextRow = r
      }
    }

    if (nextRow === -1) return

    // Explorer chaque candidat possible sur cette ligne
    for (let c = 0; c < size; c++) {
      if (!cands[nextRow][c]) continue
      if (solutions.length >= maxSolutions) return

      // Cloner la matrice de candidats
      const nextCands = cands.map(row => [...row])
      const newTree: Position = { row: nextRow, col: c }
      applyTreeConstraints(nextCands, newTree)

      search(nextCands, [...allTrees, newTree], targetRow + 1)
    }
  }

  // Lancement de la résolution
  search(candidates, [], 0)

  // Classification de difficulté
  let difficultyRating: DifficultyRating = 'easy'
  if (deductionSteps > 15 && deductionSteps <= 40) {
    difficultyRating = 'medium'
  } else if (deductionSteps > 40) {
    difficultyRating = 'hard'
  }

  return {
    solutions,
    isUnique: solutions.length === 1,
    difficultyRating,
    deductionSteps
  }
}
