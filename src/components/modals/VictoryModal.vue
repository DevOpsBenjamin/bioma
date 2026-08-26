<script setup lang="ts">
import { onMounted } from 'vue'
import confetti from 'canvas-confetti'
import { Sparkles, ArrowRight, Grid, Star } from 'lucide-vue-next'
import { useGameStore } from '../../stores/game'

const emit = defineEmits<{
  (e: 'next'): void
  (e: 'menu'): void
}>()

const gameStore = useGameStore()
const currentProgress = gameStore.progressMap[gameStore.currentLevelNumber]
const hasOneShot = currentProgress?.hasOneShotStar

onMounted(() => {
  // Déclenchement de confettis dorés et émeraudes
  try {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#fbbf24', '#f59e0b', '#6ee7b7']
    })
  } catch {
    // Ignorer si indisponible
  }
})
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
    <div class="relative w-full max-w-sm p-6 text-center rounded-3xl bg-gradient-to-b from-emerald-950/90 to-black/90 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.25)]">
      <!-- Icône de célébration -->
      <div class="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-inner">
        <Sparkles class="w-8 h-8 animate-pulse" />
      </div>

      <h2 class="text-2xl font-bold text-emerald-100 mb-1">
        Harmonie Atteinte !
      </h2>
      <p class="text-xs text-emerald-300/70 mb-5">
        Niveau {{ gameStore.currentLevelNumber }} purifié
      </p>

      <!-- Badge Étoile One-Shot -->
      <div class="p-3 mb-6 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center gap-3">
        <Star
          class="w-6 h-6"
          :class="hasOneShot ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-slate-600'"
        />
        <div class="text-left">
          <div class="text-xs font-semibold" :class="hasOneShot ? 'text-amber-300' : 'text-slate-400'">
            {{ hasOneShot ? 'Étoile One-Shot remportée ! ⭐' : 'Niveau validé' }}
          </div>
          <div class="text-[10px] text-emerald-200/50">
            {{ hasOneShot ? 'Réussite parfaite au 1er essai sans faute' : 'Étoile perdue sur tentative précédente' }}
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col gap-2.5">
        <button
          v-if="gameStore.currentLevelNumber < gameStore.totalLevels"
          class="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-emerald-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 active:scale-98 rounded-xl shadow-lg transition-all cursor-pointer"
          @click="emit('next')"
        >
          <span>Niveau Suivant</span>
          <ArrowRight class="w-4 h-4" />
        </button>

        <button
          class="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-medium text-emerald-200/80 hover:text-emerald-100 bg-white/5 hover:bg-white/10 active:scale-98 rounded-xl border border-white/10 transition-all cursor-pointer"
          @click="emit('menu')"
        >
          <Grid class="w-3.5 h-3.5" />
          <span>Liste des Niveaux</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
