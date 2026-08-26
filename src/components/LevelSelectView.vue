<script setup lang="ts">
import { ref, computed } from 'vue'
import { Star, Lock, Settings, CheckCircle2, Sparkles, Sprout } from 'lucide-vue-next'
import { useGameStore } from '../stores/game'
import SettingsModal from './modals/SettingsModal.vue'

const emit = defineEmits<{
  (e: 'select-level', levelNumber: number): void
}>()

const gameStore = useGameStore()
const showSettings = ref(false)
const activeWave = ref<'ALL' | 'WAVE_1' | 'WAVE_2' | 'WAVE_3' | 'WAVE_4'>('ALL')

const filteredLevels = computed(() => {
  const all: number[] = Array.from({ length: gameStore.totalLevels }, (_, i) => i + 1)
  if (activeWave.value === 'WAVE_1') return all.slice(0, 100)
  if (activeWave.value === 'WAVE_2') return all.slice(100, 250)
  if (activeWave.value === 'WAVE_3') return all.slice(250, 400)
  if (activeWave.value === 'WAVE_4') return all.slice(400, 520)
  return all
})

function getLevelSize(num: number): number {
  if (num <= 100) {
    const pattern = [6, 6, 7, 6, 8, 7, 6, 9, 7, 8]
    return pattern[(num - 1) % pattern.length]
  } else if (num <= 250) {
    const pattern = [7, 8, 7, 9, 8, 10, 8, 11, 9, 10]
    return pattern[(num - 1) % pattern.length]
  } else if (num <= 400) {
    const pattern = [8, 10, 9, 11, 9, 12, 10, 11, 10, 12]
    return pattern[(num - 1) % pattern.length]
  } else {
    const pattern = [9, 11, 10, 12, 11, 12, 10, 12, 11, 12]
    return pattern[(num - 1) % pattern.length]
  }
}
</script>

<template>
  <div class="flex flex-col w-full max-w-2xl min-h-screen mx-auto p-4 select-none pb-12">
    <!-- En-tête Principal -->
    <header class="flex items-center justify-between py-4 mb-3 border-b border-emerald-500/20">
      <div class="flex items-center gap-3">
        <div class="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Sprout class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl font-extrabold tracking-wider bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">
            BIOMA
          </h1>
          <div class="flex items-center gap-2 text-xs text-emerald-300/70">
            <span>{{ gameStore.harmonyRank }}</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Badge Étoiles -->
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner">
          <Star class="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{{ gameStore.totalStars }}</span>
        </div>

        <!-- Bouton Réglages -->
        <button
          class="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-emerald-200 border border-white/10 transition-all cursor-pointer"
          title="Réglages"
          @click="showSettings = true"
        >
          <Settings class="w-5 h-5" />
        </button>
      </div>
    </header>

    <!-- Carte Progression globale -->
    <div class="p-4 mb-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-emerald-950/60 border border-emerald-500/20 shadow-lg flex items-center justify-between text-xs">
      <div>
        <div class="font-semibold text-emerald-100 mb-0.5">Campagne des 520 Biomes</div>
        <div class="text-emerald-300/60">
          {{ gameStore.completedCount }} / {{ gameStore.totalLevels }} niveaux purifiés ({{ Math.round((gameStore.completedCount / gameStore.totalLevels) * 100) }}%)
        </div>
      </div>
      <div class="flex items-center gap-1 text-emerald-400">
        <Sparkles class="w-4 h-4" />
        <span class="font-bold">{{ gameStore.totalStars }} / 520 ⭐</span>
      </div>
    </div>

    <!-- Filtres par Vagues de difficulté -->
    <div class="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none text-xs">
      <button
        class="px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer"
        :class="activeWave === 'ALL' ? 'bg-emerald-500 text-emerald-950 font-bold shadow' : 'bg-white/5 text-emerald-200/70 hover:bg-white/10'"
        @click="activeWave = 'ALL'"
      >
        Tous (520)
      </button>
      <button
        class="px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer"
        :class="activeWave === 'WAVE_1' ? 'bg-emerald-500 text-emerald-950 font-bold shadow' : 'bg-white/5 text-emerald-200/70 hover:bg-white/10'"
        @click="activeWave = 'WAVE_1'"
      >
        Vague 1 (1-100)
      </button>
      <button
        class="px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer"
        :class="activeWave === 'WAVE_2' ? 'bg-emerald-500 text-emerald-950 font-bold shadow' : 'bg-white/5 text-emerald-200/70 hover:bg-white/10'"
        @click="activeWave = 'WAVE_2'"
      >
        Vague 2 (101-250)
      </button>
      <button
        class="px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer"
        :class="activeWave === 'WAVE_3' ? 'bg-emerald-500 text-emerald-950 font-bold shadow' : 'bg-white/5 text-emerald-200/70 hover:bg-white/10'"
        @click="activeWave = 'WAVE_3'"
      >
        Vague 3 (251-400)
      </button>
      <button
        class="px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer"
        :class="activeWave === 'WAVE_4' ? 'bg-emerald-500 text-emerald-950 font-bold shadow' : 'bg-white/5 text-emerald-200/70 hover:bg-white/10'"
        @click="activeWave = 'WAVE_4'"
      >
        Vague 4 (401-520)
      </button>
    </div>

    <!-- Grille des Cartes de Niveaux -->
    <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
      <div
        v-for="num in filteredLevels"
        :key="num"
        class="relative flex flex-col items-center justify-between p-3 rounded-2xl border transition-all duration-200"
        :class="[
          gameStore.isLevelUnlocked(num)
            ? 'bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-500/25 cursor-pointer active:scale-95 shadow-md'
            : 'bg-black/40 border-white/5 opacity-40 cursor-not-allowed',
          gameStore.isCompleted(num) ? 'ring-1 ring-emerald-500/40' : ''
        ]"
        @click="gameStore.isLevelUnlocked(num) ? emit('select-level', num) : null"
      >
        <!-- Badge Étoile One-Shot -->
        <div class="w-full flex items-center justify-between mb-1">
          <span class="text-[10px] font-mono text-emerald-300/60">{{ getLevelSize(num) }}x{{ getLevelSize(num) }}</span>
          <Star
            v-if="gameStore.hasStar(num)"
            class="w-3.5 h-3.5 fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]"
          />
          <CheckCircle2
            v-else-if="gameStore.isCompleted(num)"
            class="w-3.5 h-3.5 text-emerald-400/80"
          />
          <Lock
            v-else-if="!gameStore.isLevelUnlocked(num)"
            class="w-3.5 h-3.5 text-slate-500"
          />
          <span v-else class="w-3.5 h-3.5"></span>
        </div>

        <!-- Numéro de Niveau -->
        <span class="text-base font-bold" :class="gameStore.isLevelUnlocked(num) ? 'text-emerald-100' : 'text-slate-500'">
          {{ num }}
        </span>

        <!-- Statut d'état bas -->
        <div class="mt-1 text-[9px] text-emerald-400/70 font-medium">
          {{ gameStore.isCompleted(num) ? 'Harmonisé' : (gameStore.isLevelUnlocked(num) ? 'À purifier' : 'Verrouillé') }}
        </div>
      </div>
    </div>

    <!-- Modale Réglages -->
    <SettingsModal v-if="showSettings" @close="showSettings = false" />
  </div>
</template>
