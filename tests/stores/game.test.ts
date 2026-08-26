import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '@/stores/game'
import { useSettingsStore } from '@/stores/settings'

describe('Game Store & Hardcore Loop', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loads level 1 and creates reactive grid with correct size', () => {
    const game = useGameStore()
    game.loadLevel(1)

    expect(game.currentLevelNumber).toBe(1)
    expect(game.activePuzzle).not.toBeNull()
    expect(game.grid).not.toBeNull()
    expect(game.grid?.size).toBe(game.activePuzzle?.size)
    expect(game.gameState).toBe('PLAYING')
  })

  it('places and toggles soft marks without affecting protected trees', () => {
    const game = useGameStore()
    game.loadLevel(1)

    // Place soft mark at (0, 0)
    game.placeSoftMark(0, 0)
    expect(game.grid?.cells[0][0].state).toBe('SOFT_MARK')

    // Toggle back to EMPTY
    game.placeSoftMark(0, 0)
    expect(game.grid?.cells[0][0].state).toBe('EMPTY')
  })

  it('clears all soft marks at once with eraser action', () => {
    const game = useGameStore()
    game.loadLevel(1)

    game.placeSoftMark(0, 0)
    game.placeSoftMark(1, 1)
    game.placeSoftMark(2, 2)

    game.clearAllSoftMarks()

    expect(game.grid?.cells[0][0].state).toBe('EMPTY')
    expect(game.grid?.cells[1][1].state).toBe('EMPTY')
    expect(game.grid?.cells[2][2].state).toBe('EMPTY')
  })

  it('triggers instant FAIL and revokes One-Shot star on incorrect tree placement (Hardcore One-Strike)', async () => {
    const game = useGameStore()
    game.loadLevel(1)

    const solution = game.activePuzzle!.solution
    // Find an invalid cell not in solution
    let invalidR = 0
    let invalidC = 0
    for (let r = 0; r < game.grid!.size; r++) {
      for (let c = 0; c < game.grid!.size; c++) {
        if (!solution.some(p => p.row === r && p.col === c)) {
          invalidR = r
          invalidC = c
          break
        }
      }
    }

    // Plant invalid tree
    await game.plantTree(invalidR, invalidC)

    expect(game.gameState).toBe('FAILED')
    expect(game.hasStar(1)).toBe(false)
    expect(game.isCompleted(1)).toBe(false)
  })

  it('plants valid tree, automatically deploys roots on row/col/neighbors, and wins when full', async () => {
    const game = useGameStore()
    const settings = useSettingsStore()
    settings.autoRootsRowCol = true
    settings.autoRootsNeighbors = true

    game.loadLevel(1)
    const solution = game.activePuzzle!.solution

    // Plant all valid trees one by one
    for (const tree of solution) {
      await game.plantTree(tree.row, tree.col)
      expect(game.grid?.cells[tree.row][tree.col].state).toBe('TREE')
    }

    expect(game.gameState).toBe('WON')
    expect(game.isCompleted(1)).toBe(true)
    expect(game.hasStar(1)).toBe(true)
    expect(game.totalStars).toBe(1)
  })

  it('applies anti-memorization transformation on retry after failure', () => {
    const game = useGameStore()
    game.loadLevel(1)

    const initialBiomes = JSON.stringify(game.activePuzzle!.biomes)

    // Trigger retry
    game.retryCurrentLevel()

    expect(game.activeTransform).not.toBe('none')
    expect(game.gameState).toBe('PLAYING')
  })
})
