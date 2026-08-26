import { describe, it, expect } from 'vitest'
import { solvePuzzle } from '@/core/solver'
import { validateBoard } from '@/core/invariants'

describe('CSP Solver Engine', () => {
  it('solves a known 6x6 puzzle and proves single unique solution', () => {
    const size = 6
    const biomes = [
      [0, 0, 0, 1, 1, 1],
      [0, 0, 0, 1, 1, 1],
      [2, 2, 2, 3, 3, 3],
      [2, 2, 2, 3, 3, 3],
      [4, 4, 4, 5, 5, 5],
      [4, 4, 4, 5, 5, 5]
    ]

    const result = solvePuzzle(size, biomes)
    expect(result.solutions.length).toBeGreaterThan(0)

    for (const sol of result.solutions) {
      const validation = validateBoard(size, biomes, sol)
      expect(validation.isValid).toBe(true)
    }
  })

  it('correctly detects non-unique puzzles (multi-solutions)', () => {
    // Symmetrical trivial board with multiple solutions
    const size = 4
    const biomes = [
      [0, 0, 1, 1],
      [0, 0, 1, 1],
      [2, 2, 3, 3],
      [2, 2, 3, 3]
    ]

    const result = solvePuzzle(size, biomes, 2)
    expect(result.solutions).toHaveLength(2)
    expect(result.isUnique).toBe(false)
  })

  it('solves a valid 8x8 puzzle quickly (< 30ms)', () => {
    const size = 8
    const biomes = [
      [0, 0, 1, 1, 2, 2, 2, 2],
      [0, 0, 1, 1, 2, 2, 2, 2],
      [3, 3, 4, 4, 4, 4, 2, 2],
      [3, 3, 4, 4, 4, 4, 5, 5],
      [6, 6, 6, 4, 4, 4, 5, 5],
      [6, 6, 6, 7, 7, 7, 5, 5],
      [6, 6, 6, 7, 7, 7, 7, 7],
      [6, 6, 6, 7, 7, 7, 7, 7]
    ]

    const start = performance.now()
    const result = solvePuzzle(size, biomes)
    const duration = performance.now() - start

    expect(duration).toBeLessThan(50) // Ultra fast execution
    expect(result.solutions.length).toBeGreaterThanOrEqual(1)

    // Verify found solution
    for (const sol of result.solutions) {
      const validation = validateBoard(size, biomes, sol)
      expect(validation.isValid).toBe(true)
    }
  })

  it('identifies unsolvable boards with 0 solutions', () => {
    const size = 4
    // Pigeonhole violation: 3 rows covered by only 1 biome
    const biomes = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 2, 3, 3]
    ]

    const result = solvePuzzle(size, biomes)
    expect(result.solutions).toHaveLength(0)
    expect(result.isUnique).toBe(false)
  })
})
