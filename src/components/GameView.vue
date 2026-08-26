<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft, Settings, Star } from 'lucide-vue-next'
import { useGameStore } from '../stores/game'
import GridBoard from './GridBoard.vue'
import VictoryModal from './modals/VictoryModal.vue'
import FailModal from './modals/FailModal.vue'
import MindfulBreakModal from './modals/MindfulBreakModal.vue'
import SettingsModal from './modals/SettingsModal.vue'

const emit = defineEmits<{
  (e: 'back'): void
}>()

const gameStore = useGameStore()
const showSettings = ref(false)

const currentProgress = computed(() => {
  return gameStore.progressMap[gameStore.currentLevelNumber]
})

const hasStarStillAtRisk = computed(() => {
  if (!currentProgress.value) return true
  return currentProgress.value.hasOneShotStar
})

function handleNext() {
  gameStore.nextLevel()
}

function handleRetry() {
  gameStore.retryCurrentLevel()
}

function handleMenu() {
  emit('back')
}
</script>

<template>
  <div class="flex flex-col items-center justify-between w-full max-w-lg min-h-screen mx-auto p-4 select-none">
    <!-- En-tête de Jeu -->
    <header class="flex items-center justify-between w-full py-3 mb-2">
      <!-- Bouton Retour -->
      <button
        class="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-200/80 hover:text-emerald-100 bg-white/5 hover:bg-white/10 active:scale-95 rounded-xl border border-white/10 transition-all cursor-pointer"
        @click="emit('back')"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Niveaux</span>
      </button>

      <!-- Titre du Niveau & Grille -->
      <div class="text-center">
        <h2 class="text-base font-bold text-emerald-50">
          Niveau {{ gameStore.currentLevelNumber }}
        </h2>
        <div class="text-[11px] text-emerald-300/60 font-mono">
          Grille {{ gameStore.grid?.size }}x{{ gameStore.grid?.size }} • {{ gameStore.activePuzzle?.difficultyRating }}
        </div>
      </div>

      <!-- Bouton Réglages & Indicateur Étoile -->
      <div class="flex items-center gap-1.5">
        <div
          class="p-2 rounded-xl border transition-all"
          :class="hasStarStillAtRisk ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/5 text-slate-500'"
          :title="hasStarStillAtRisk ? 'Étoile One-Shot en jeu ⭐' : 'Étoile One-Shot déjà perdue'"
        >
          <Star class="w-4 h-4" :class="hasStarStillAtRisk ? 'fill-amber-400' : ''" />
        </div>

        <button
          class="p-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-emerald-200 border border-white/10 transition-all cursor-pointer"
          title="Réglages"
          @click="showSettings = true"
        >
          <Settings class="w-4 h-4" />
        </button>
      </div>
    </header>

    <!-- Grille de Jeu -->
    <main class="flex-1 flex flex-col items-center justify-center w-full my-auto">
      <GridBoard />
    </main>

    <!-- Modales de Jeu -->
    <VictoryModal
      v-if="gameStore.gameState === 'WON'"
      @next="handleNext"
      @menu="handleMenu"
    />

    <FailModal
      v-if="gameStore.gameState === 'FAILED'"
      @retry="handleRetry"
      @menu="handleMenu"
    />

    <MindfulBreakModal
      v-if="gameStore.showMindfulBreak"
      @dismiss="gameStore.dismissMindfulBreak"
    />

    <SettingsModal
      v-if="showSettings"
      @close="showSettings = false"
    />
  </div>
</template>
