import { describe, it, expect } from 'vitest'
import { applyIsometry, shuffleBiomeColors, applyAntiMemorizationTransform } from '@/core/antiMemorization'
import { validateBoard } from '@/core/invariants'
import type { Position } from '@/core/types'

describe('Anti-Memorization & Transformations', () => {
  const size = 4
  const biomes = [
    [0, 0, 1, 1],
    [0, 0, 1, 1],
    [2, 2, 3, 3],
    [2, 2, 3, 3]
  ]
  const solution: Position[] = [
    { row: 0, col: 1 },
    { row: 1, col: 3 },
    { row: 2, col: 0 },
    { row: 3, col: 2 }
  ]

  it('preserves validity after 90 degree rotation', () => {
    const rotated = applyIsometry(size, biomes, solution, 'rotate90')
    const validation = validateBoard(size, rotated.biomes, rotated.solution)

    expect(validation.isValid).toBe(true)
    expect(rotated.solution).toHaveLength(4)
  })

  it('preserves validity after 180 and 270 degree rotation', () => {
    const rot180 = applyIsometry(size, biomes, solution, 'rotate180')
    expect(validateBoard(size, rot180.biomes, rot180.solution).isValid).toBe(true)

    const rot270 = applyIsometry(size, biomes, solution, 'rotate270')
    expect(validateBoard(size, rot270.biomes, rot270.solution).isValid).toBe(true)
  })

  it('preserves validity after horizontal and vertical reflection', () => {
    const flipH = applyIsometry(size, biomes, solution, 'flipH')
    expect(validateBoard(size, flipH.biomes, flipH.solution).isValid).toBe(true)

    const flipV = applyIsometry(size, biomes, solution, 'flipV')
    expect(validateBoard(size, flipV.biomes, flipV.solution).isValid).toBe(true)
  })

  it('shuffles colors while maintaining identical connectivity and validation', () => {
    const recolored = shuffleBiomeColors(size, biomes)
    expect(validateBoard(size, recolored, solution).isValid).toBe(true)
  })

  it('applies full random anti-memorization transform', () => {
    const result = applyAntiMemorizationTransform(size, biomes, solution)
    expect(validateBoard(size, result.biomes, result.solution).isValid).toBe(true)
    expect(result.transformApplied).toBeDefined()
  })
})
