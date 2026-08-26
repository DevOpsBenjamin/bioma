<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/game'
import PatternDefs from './icons/PatternDefs.vue'
import GridCell from './GridCell.vue'
import { Eraser, RotateCcw } from 'lucide-vue-next'

const gameStore = useGameStore()

const grid = computed(() => gameStore.grid)
const size = computed(() => grid.value?.size || 6)

// Comptage des brouillons pour le badge du bouton Gomme
const softMarkCount = computed(() => {
  if (!grid.value) return 0
  let count = 0
  for (let r = 0; r < grid.value.size; r++) {
    for (let c = 0; c < grid.value.size; c++) {
      if (grid.value.cells[r][c].state === 'SOFT_MARK') count++
    }
  }
  return count
})

// Gestion du Double-Tap et du Drag-to-mark
const lastTapTime = ref(0)
const lastTapRow = ref(-1)
const lastTapCol = ref(-1)
const isDragging = ref(false)
const dragTargetState = ref<boolean | null>(null)

function getCellBorders(row: number, col: number) {
  if (!grid.value) return { top: true, right: true, bottom: true, left: true }
  const currentBiome = grid.value.cells[row][col].biomeId
  const sz = grid.value.size

  return {
    top: row === 0 || grid.value.cells[row - 1][col].biomeId !== currentBiome,
    bottom: row === sz - 1 || grid.value.cells[row + 1][col].biomeId !== currentBiome,
    left: col === 0 || grid.value.cells[row][col - 1].biomeId !== currentBiome,
    right: col === sz - 1 || grid.value.cells[row][col + 1].biomeId !== currentBiome
  }
}

function handlePointerDown(row: number, col: number, event: PointerEvent) {
  if (event.button !== 0) return // Seul le clic gauche / touch principal

  const now = Date.now()
  const isDoubleTap = now - lastTapTime.value < 320 && lastTapRow.value === row && lastTapCol.value === col

  if (isDoubleTap) {
    // 🌲 DOUBLE-TAP : Planter un Arbre
    lastTapTime.value = 0
    lastTapRow.value = -1
    lastTapCol.value = -1
    isDragging.value = false
    gameStore.plantTree(row, col)
    return
  }

  // Premier tap : enregistrement pour double-tap éventuel
  lastTapTime.value = now
  lastTapRow.value = row
  lastTapCol.value = col

  // Initialisation du drag-to-mark
  const cell = grid.value?.cells[row][col]
  if (cell && cell.state !== 'TREE' && cell.state !== 'HARD_ROOT') {
    isDragging.value = true
    dragTargetState.value = cell.state !== 'SOFT_MARK'
    gameStore.setSoftMark(row, col, dragTargetState.value)
  }
}

function handlePointerEnter(row: number, col: number) {
  if (!isDragging.value || dragTargetState.value === null) return
  gameStore.setSoftMark(row, col, dragTargetState.value)
}

function handlePointerUp() {
  isDragging.value = false
  dragTargetState.value = null
}

function handleContextMenu(row: number, col: number) {
  // Clic droit sur desktop : planter directement
  gameStore.plantTree(row, col)
}
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full select-none" @pointerup="handlePointerUp" @pointercancel="handlePointerUp">
    <!-- SVG Pattern Definitions pour le daltonisme -->
    <PatternDefs />

    <!-- Container de la grille avec bordures arrondies et glassmorphism -->
    <div
      v-if="grid"
      class="relative w-full max-w-[min(92vw,500px)] aspect-square p-1 rounded-2xl bg-black/40 backdrop-blur-md shadow-2xl border-2 border-white/10 overflow-hidden"
    >
      <div
        class="grid w-full h-full rounded-xl overflow-hidden touch-none"
        :style="{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`
        }"
      >
        <template v-for="(row, r) in grid.cells" :key="r">
          <GridCell
            v-for="(cell, c) in row"
            :key="`${r}-${c}`"
            :cell="cell"
            :size="size"
            :borders="getCellBorders(r, c)"
            @pointerdown="handlePointerDown(r, c, $event)"
            @pointerenter="() => handlePointerEnter(r, c)"
            @contextmenu.prevent="() => handleContextMenu(r, c)"
          />
        </template>
      </div>
    </div>

    <!-- Barre d'outils tactile discrète sous la grille -->
    <div class="flex items-center justify-between w-full max-w-[min(92vw,500px)] mt-4 px-2">
      <!-- Bouton Recommencer (Anti-mémorisation) -->
      <button
        class="flex items-center gap-2 px-3 py-2 text-xs font-medium text-emerald-200/70 hover:text-emerald-100 bg-emerald-950/40 hover:bg-emerald-900/60 active:scale-95 rounded-xl border border-emerald-500/20 transition-all cursor-pointer"
        title="Recommencer avec nouvelle rotation"
        @click="gameStore.retryCurrentLevel"
      >
        <RotateCcw class="w-4 h-4" />
        <span>Recommencer</span>
      </button>

      <!-- Bouton Gomme pour effacer tous les brouillons -->
      <button
        class="flex items-center gap-2 px-3 py-2 text-xs font-medium text-amber-200/70 hover:text-amber-100 bg-amber-950/40 hover:bg-amber-900/60 active:scale-95 rounded-xl border border-amber-500/20 transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
        :disabled="softMarkCount === 0"
        title="Effacer tous les brouillons"
        @click="gameStore.clearAllSoftMarks"
      >
        <Eraser class="w-4 h-4" />
        <span>Gomme ({{ softMarkCount }})</span>
      </button>
    </div>
  </div>
</template>
