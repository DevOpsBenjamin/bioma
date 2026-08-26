import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import campaignData from '../assets/levels/campaign.json'
import { decodeLevel, type CompactLevel } from '../core/codec'
import { applyAntiMemorizationTransform, type IsometryType } from '../core/antiMemorization'
import { getMooreNeighbors } from '../core/invariants'
import {
  getAllProgress,
  saveLevelProgress,
  exportSaveBackup,
  importSaveBackup,
  type LevelProgress
} from '../storage/indexedDb'
import { useSettingsStore } from './settings'
import type { Grid, Position, PuzzleDefinition } from '../core/types'

const campaignLevels = campaignData as CompactLevel[]

export const useGameStore = defineStore('game', () => {
  const settingsStore = useSettingsStore()

  const currentLevelNumber = ref(1)
  const activePuzzle = ref<PuzzleDefinition | null>(null)
  const grid = ref<Grid | null>(null)
  const gameState = ref<'PLAYING' | 'WON' | 'FAILED'>('PLAYING')
  const progressMap = ref<Record<number, LevelProgress>>({})
  const sessionWins = ref(0)
  const showMindfulBreak = ref(false)
  const activeTransform = ref<IsometryType | 'none'>('none')
  const levelStartTime = ref(Date.now())

  // Initialisation de la persistance IndexedDB
  async function initStore() {
    await settingsStore.loadSettings()
    progressMap.value = await getAllProgress()
  }

  // Getters
  const totalLevels = computed(() => campaignLevels.length)

  const completedCount = computed(() => {
    return Object.values(progressMap.value).filter(p => p.completed).length
  })

  const totalStars = computed(() => {
    return Object.values(progressMap.value).filter(p => p.hasOneShotStar).length
  })

  const harmonyRank = computed(() => {
    const stars = totalStars.value
    if (stars >= 450) return 'Grand Esprit de la Terre 🌌'
    if (stars >= 300) return 'Maître de la Forêt 🌲'
    if (stars >= 150) return 'Druide de la Canopée 🍃'
    if (stars >= 50) return 'Gardien des Bosquets 🌿'
    return 'Apprenti Bourgeon 🌱'
  })

  function isLevelUnlocked(levelId: number): boolean {
    if (levelId === 1) return true
    const prev = progressMap.value[levelId - 1]
    return prev ? prev.completed : false
  }

  function hasStar(levelId: number): boolean {
    return progressMap.value[levelId]?.hasOneShotStar === true
  }

  function isCompleted(levelId: number): boolean {
    return progressMap.value[levelId]?.completed === true
  }

  // Actions
  function loadLevel(levelNum: number, forceTransform = false) {
    if (levelNum < 1 || levelNum > totalLevels.value) return

    currentLevelNumber.value = levelNum
    const rawCompact = campaignLevels[levelNum - 1]
    let puzzle = decodeLevel(rawCompact)

    const prevProgress = progressMap.value[levelNum]
    const shouldTransform = forceTransform || (prevProgress && !prevProgress.completed && prevProgress.attempts > 0)

    if (shouldTransform) {
      const transformed = applyAntiMemorizationTransform(puzzle.size, puzzle.biomes, puzzle.solution)
      puzzle = {
        ...puzzle,
        biomes: transformed.biomes,
        solution: transformed.solution
      }
      activeTransform.value = transformed.transformApplied
    } else {
      activeTransform.value = 'none'
    }

    activePuzzle.value = puzzle

    // Créer la grille réactive
    const size = puzzle.size
    grid.value = {
      size,
      cells: Array.from({ length: size }, (_, r) =>
        Array.from({ length: size }, (_, c) => ({
          row: r,
          col: c,
          biomeId: puzzle.biomes[r][c],
          state: 'EMPTY'
        }))
      )
    }

    gameState.value = 'PLAYING'
    levelStartTime.value = Date.now()
  }

  function placeSoftMark(row: number, col: number) {
    if (gameState.value !== 'PLAYING' || !grid.value) return
    const cell = grid.value.cells[row][col]

    // Ne pas modifier les arbres ou les racines protégées
    if (cell.state === 'TREE' || cell.state === 'HARD_ROOT') return

    cell.state = cell.state === 'SOFT_MARK' ? 'EMPTY' : 'SOFT_MARK'
  }

  function setSoftMark(row: number, col: number, state: boolean) {
    if (gameState.value !== 'PLAYING' || !grid.value) return
    const cell = grid.value.cells[row][col]
    if (cell.state === 'TREE' || cell.state === 'HARD_ROOT') return
    cell.state = state ? 'SOFT_MARK' : 'EMPTY'
  }

  function clearAllSoftMarks() {
    if (gameState.value !== 'PLAYING' || !grid.value) return
    for (let r = 0; r < grid.value.size; r++) {
      for (let c = 0; c < grid.value.size; c++) {
        if (grid.value.cells[r][c].state === 'SOFT_MARK') {
          grid.value.cells[r][c].state = 'EMPTY'
        }
      }
    }
  }

  async function plantTree(row: number, col: number) {
    if (gameState.value !== 'PLAYING' || !grid.value || !activePuzzle.value) return
    const cell = grid.value.cells[row][col]
    if (cell.state === 'TREE' || cell.state === 'HARD_ROOT') return

    const levelId = currentLevelNumber.value
    const isSolution = activePuzzle.value.solution.some(p => p.row === row && p.col === col)

    const existingProgress = progressMap.value[levelId] || {
      levelId,
      completed: false,
      hasOneShotStar: true,
      attempts: 0
    }

    if (!isSolution) {
      // 💥 ÉCHEC HARDCORE ONE-STRIKE !
      gameState.value = 'FAILED'
      existingProgress.attempts++
      existingProgress.hasOneShotStar = false // Étoile perdue à jamais sur ce niveau

      progressMap.value[levelId] = existingProgress
      await saveLevelProgress(existingProgress)
      return
    }

    // 🌲 ARBRE VALIDE ANCRÉ !
    cell.state = 'TREE'

    // Déploiement automatique des Racines Végétales
    deployRootsAroundTree({ row, col })

    // Vérifier la victoire
    const plantedTrees: Position[] = []
    for (let r = 0; r < grid.value.size; r++) {
      for (let c = 0; c < grid.value.size; c++) {
        if (grid.value.cells[r][c].state === 'TREE') {
          plantedTrees.push({ row: r, col: c })
        }
      }
    }

    if (plantedTrees.length === activePuzzle.value.size) {
      // 🎉 VICTOIRE !
      gameState.value = 'WON'
      sessionWins.value++
      if (sessionWins.value % 10 === 0) {
        showMindfulBreak.value = true
      }

      const elapsedSeconds = Math.round((Date.now() - levelStartTime.value) / 1000)
      existingProgress.completed = true
      existingProgress.attempts = Math.max(1, existingProgress.attempts + 1)
      if (existingProgress.bestTimeSeconds === undefined || elapsedSeconds < existingProgress.bestTimeSeconds) {
        existingProgress.bestTimeSeconds = elapsedSeconds
      }
      existingProgress.completedAt = new Date().toISOString()

      progressMap.value[levelId] = existingProgress
      await saveLevelProgress(existingProgress)
    }
  }

  function deployRootsAroundTree(tree: Position) {
    if (!grid.value || !activePuzzle.value) return
    const size = grid.value.size
    const biome = grid.value.cells[tree.row][tree.col].biomeId

    // 1. Ligne & Colonne
    if (settingsStore.autoRootsRowCol) {
      for (let c = 0; c < size; c++) {
        if (c !== tree.col) lockAsRoot(tree.row, c, tree)
      }
      for (let r = 0; r < size; r++) {
        if (r !== tree.row) lockAsRoot(r, tree.col, tree)
      }
    }

    // 2. 8-Voisins de Moore
    if (settingsStore.autoRootsNeighbors) {
      const neighbors = getMooreNeighbors(tree.row, tree.col, size)
      for (const n of neighbors) {
        lockAsRoot(n.row, n.col, tree)
      }
    }

    // 3. Biome entier
    if (settingsStore.autoRootsBiome) {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (grid.value.cells[r][c].biomeId === biome && (r !== tree.row || c !== tree.col)) {
            lockAsRoot(r, c, tree)
          }
        }
      }
    }
  }

  function lockAsRoot(r: number, c: number, origin: Position) {
    if (!grid.value) return
    const target = grid.value.cells[r][c]
    if (target.state !== 'TREE') {
      target.state = 'HARD_ROOT'
      target.originTree = origin
    }
  }

  function retryCurrentLevel() {
    loadLevel(currentLevelNumber.value, true)
  }

  function nextLevel() {
    if (currentLevelNumber.value < totalLevels.value) {
      loadLevel(currentLevelNumber.value + 1)
    }
  }

  function dismissMindfulBreak() {
    showMindfulBreak.value = false
  }

  async function exportBackup(): Promise<string> {
    return exportSaveBackup(settingsStore.getSettingsSnapshot())
  }

  async function importBackup(jsonString: string): Promise<boolean> {
    try {
      const backup = await importSaveBackup(jsonString)
      await initStore()
      if (backup.settings) {
        await settingsStore.loadSettings()
      }
      return true
    } catch {
      return false
    }
  }

  return {
    currentLevelNumber,
    activePuzzle,
    grid,
    gameState,
    progressMap,
    sessionWins,
    showMindfulBreak,
    activeTransform,
    totalLevels,
    completedCount,
    totalStars,
    harmonyRank,
    initStore,
    isLevelUnlocked,
    hasStar,
    isCompleted,
    loadLevel,
    placeSoftMark,
    setSoftMark,
    clearAllSoftMarks,
    plantTree,
    retryCurrentLevel,
    nextLevel,
    dismissMindfulBreak,
    exportBackup,
    importBackup
  }
})
