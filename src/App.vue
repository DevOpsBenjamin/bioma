<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGameStore } from './stores/game'
import LevelSelectView from './components/LevelSelectView.vue'
import GameView from './components/GameView.vue'

const gameStore = useGameStore()
const currentView = ref<'LEVEL_SELECT' | 'GAME'>('LEVEL_SELECT')

onMounted(async () => {
  await gameStore.initStore()
})

function handleSelectLevel(levelNumber: number) {
  gameStore.loadLevel(levelNumber)
  currentView.value = 'GAME'
}

function handleBackToLevelSelect() {
  currentView.value = 'LEVEL_SELECT'
}
</script>

<template>
  <div class="min-h-screen bg-radial from-emerald-950 via-[#052e23] to-[#021812] text-slate-100 antialiased font-sans">
    <transition name="fade-view" mode="out-in">
      <LevelSelectView
        v-if="currentView === 'LEVEL_SELECT'"
        @select-level="handleSelectLevel"
      />
      <GameView
        v-else-if="currentView === 'GAME'"
        @back="handleBackToLevelSelect"
      />
    </transition>
  </div>
</template>

<style scoped>
.fade-view-enter-active,
.fade-view-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}

.fade-view-enter-from {
  opacity: 0;
  transform: scale(0.98);
}

.fade-view-leave-to {
  opacity: 0;
  transform: scale(1.02);
}
</style>
