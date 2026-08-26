import { describe, it, expect } from 'vitest'
import { areMooreNeighbors, getMooreNeighbors, getOrthogonalNeighbors, validateBoard, isPositionInSolution } from '@/core/invariants'
import type { Position } from '@/core/types'

describe('Invariants & Neighbors Logic', () => {
  it('correctly detects Moore 8-neighbors (orthogonal and diagonal)', () => {
    const center: Position = { row: 2, col: 2 }

    // Orthogonal neighbors
    expect(areMooreNeighbors(center, { row: 1, col: 2 })).toBe(true)
    expect(areMooreNeighbors(center, { row: 3, col: 2 })).toBe(true)
    expect(areMooreNeighbors(center, { row: 2, col: 1 })).toBe(true)
    expect(areMooreNeighbors(center, { row: 2, col: 3 })).toBe(true)

    // Diagonal neighbors
    expect(areMooreNeighbors(center, { row: 1, col: 1 })).toBe(true)
    expect(areMooreNeighbors(center, { row: 1, col: 3 })).toBe(true)
    expect(areMooreNeighbors(center, { row: 3, col: 1 })).toBe(true)
    expect(areMooreNeighbors(center, { row: 3, col: 3 })).toBe(true)

    // Same cell is not its own neighbor
    expect(areMooreNeighbors(center, { row: 2, col: 2 })).toBe(false)

    // Far away cell
    expect(areMooreNeighbors(center, { row: 0, col: 0 })).toBe(false)
    expect(areMooreNeighbors(center, { row: 4, col: 2 })).toBe(false)
  })

  it('returns exactly 8 neighbors inside grid, and fewer on borders/corners', () => {
    // Corner on 6x6 grid
    expect(getMooreNeighbors(0, 0, 6)).toHaveLength(3)
    // Edge on 6x6 grid
    expect(getMooreNeighbors(0, 3, 6)).toHaveLength(5)
    // Center on 6x6 grid
    expect(getMooreNeighbors(2, 2, 6)).toHaveLength(8)
  })

  it('returns valid 4-orthogonal neighbors', () => {
    expect(getOrthogonalNeighbors(0, 0, 6)).toHaveLength(2)
    expect(getOrthogonalNeighbors(2, 2, 6)).toHaveLength(4)
  })

  it('checks if a position belongs to the solution', () => {
    const solution: Position[] = [
      { row: 0, col: 1 },
      { row: 1, col: 3 },
      { row: 2, col: 0 },
      { row: 3, col: 2 }
    ]

    expect(isPositionInSolution({ row: 0, col: 1 }, solution)).toBe(true)
    expect(isPositionInSolution({ row: 0, col: 2 }, solution)).toBe(false)
  })

  it('validates a complete board against all 4 invariants', () => {
    // 4x4 valid board
    const size = 4
    const biomes = [
      [0, 0, 1, 1],
      [0, 0, 1, 1],
      [2, 2, 3, 3],
      [2, 2, 3, 3]
    ]
    const validTrees: Position[] = [
      { row: 0, col: 1 },
      { row: 1, col: 3 },
      { row: 2, col: 0 },
      { row: 3, col: 2 }
    ]

    const result = validateBoard(size, biomes, validTrees)
    expect(result.isValid).toBe(true)
    expect(result.violations).toHaveLength(0)
  })

  it('detects violations when two trees touch diagonally', () => {
    const size = 4
    const biomes = [
      [0, 0, 1, 1],
      [0, 0, 1, 1],
      [2, 2, 3, 3],
      [2, 2, 3, 3]
    ]
    // Trees at (0, 0) and (1, 1) touch diagonally!
    const invalidTrees: Position[] = [
      { row: 0, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 3 },
      { row: 3, col: 2 }
    ]

    const result = validateBoard(size, biomes, invalidTrees)
    expect(result.isValid).toBe(false)
    expect(result.violations.some(v => v.type === 'NEIGHBOR')).toBe(true)
  })

  it('detects violations when two trees share the same row, col, or biome', () => {
    const size = 4
    const biomes = [
      [0, 0, 1, 1],
      [0, 0, 1, 1],
      [2, 2, 3, 3],
      [2, 2, 3, 3]
    ]
    // Two trees in row 0: (0, 0) and (0, 3)
    const invalidTrees: Position[] = [
      { row: 0, col: 0 },
      { row: 0, col: 3 },
      { row: 2, col: 1 },
      { row: 3, col: 2 }
    ]

    const result = validateBoard(size, biomes, invalidTrees)
    expect(result.isValid).toBe(false)
    expect(result.violations.some(v => v.type === 'ROW')).toBe(true)
  })
})
