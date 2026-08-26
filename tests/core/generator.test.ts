import { describe, it, expect } from 'vitest'
import { generateTreePlacement, generateBiomesFromSeeds, generatePuzzle } from '@/core/generator'
import { validateBoard, areMooreNeighbors } from '@/core/invariants'
import { solvePuzzle } from '@/core/solver'

describe('Procedural Generator', () => {
  it('generates valid non-touching tree placements for different grid sizes', () => {
    for (const size of [6, 7, 8, 9, 10, 11, 12]) {
      const trees = generateTreePlacement(size)
      expect(trees).not.toBeNull()
      expect(trees).toHaveLength(size)

      // Verify no two trees touch
      for (let i = 0; i < size; i++) {
        for (let j = i + 1; j < size; j++) {
          expect(areMooreNeighbors(trees![i], trees![j])).toBe(false)
        }
      }

      // Verify exactly 1 tree per row and col
      const rows = new Set(trees!.map(t => t.row))
      const cols = new Set(trees!.map(t => t.col))
      expect(rows.size).toBe(size)
      expect(cols.size).toBe(size)
    }
  })

  it('generates 4-connected continuous biomes from tree seeds', () => {
    const size = 6
    const seeds = generateTreePlacement(size)!
    const biomes = generateBiomesFromSeeds(size, seeds)

    // Check all cells are filled
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        expect(biomes[r][c]).toBeGreaterThanOrEqual(0)
        expect(biomes[r][c]).toBeLessThan(size)
      }
    }

    // Check each seed has its own biome
    for (let i = 0; i < size; i++) {
      expect(biomes[seeds[i].row][seeds[i].col]).toBe(i)
    }
  })

  it('generates a complete puzzle guaranteed to have a single unique solution', () => {
    const puzzle = generatePuzzle(6, 'test-level-1')
    expect(puzzle).not.toBeNull()
    expect(puzzle!.size).toBe(6)

    // Verify solver confirms single solution
    const solveCheck = solvePuzzle(puzzle!.size, puzzle!.biomes, 2)
    expect(solveCheck.isUnique).toBe(true)
    expect(solveCheck.solutions).toHaveLength(1)

    // Verify invariants pass
    const validation = validateBoard(puzzle!.size, puzzle!.biomes, puzzle!.solution)
    expect(validation.isValid).toBe(true)
  })
})
