import { describe, it, expect } from 'vitest'
import { encodeLevel, decodeLevel } from '@/core/codec'
import type { PuzzleDefinition } from '@/core/types'
import { validateBoard } from '@/core/invariants'

describe('Compact Level Codec', () => {
  it('encodes and decodes a 6x6 puzzle losslessly', () => {
    const original: PuzzleDefinition = {
      id: 'level-1',
      size: 6,
      biomes: [
        [0, 0, 1, 1, 2, 2],
        [0, 0, 1, 1, 2, 2],
        [3, 3, 4, 4, 2, 2],
        [3, 3, 4, 4, 5, 5],
        [3, 3, 4, 4, 5, 5],
        [3, 3, 4, 4, 5, 5]
      ],
      solution: [
        { row: 0, col: 1 },
        { row: 1, col: 3 },
        { row: 2, col: 5 },
        { row: 3, col: 0 },
        { row: 4, col: 2 },
        { row: 5, col: 4 }
      ],
      difficultyRating: 'easy',
      deductionSteps: 8
    }

    const compact = encodeLevel(original)
    expect(compact.id).toBe(1)
    expect(compact.b).toHaveLength(36)
    expect(compact.d).toBe('easy')
    expect(compact.s).toBe(8)

    const decoded = decodeLevel(compact)
    expect(decoded.id).toBe('level-1')
    expect(decoded.size).toBe(6)
    expect(decoded.biomes).toEqual(original.biomes)
    expect(decoded.solution).toEqual(original.solution)
    expect(decoded.difficultyRating).toBe('easy')
    expect(decoded.deductionSteps).toBe(8)

    const validation = validateBoard(decoded.size, decoded.biomes, decoded.solution)
    expect(validation.isValid).toBe(true)
  })

  it('throws error when string length is not a square number', () => {
    expect(() => {
      decodeLevel({
        id: 1,
        b: 'abcdefg', // 7 chars, not a square
        d: 'easy',
        s: 5
      })
    }).toThrow()
  })
})
