<script setup lang="ts">
import { AlertCircle, RotateCcw, Grid, StarOff } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'retry'): void
  (e: 'menu'): void
}>()
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
    <div class="relative w-full max-w-sm p-6 text-center rounded-3xl bg-gradient-to-b from-rose-950/90 to-black/95 border border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.25)]">
      <!-- Icône d'échec Hardcore -->
      <div class="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-inner">
        <AlertCircle class="w-8 h-8" />
      </div>

      <h2 class="text-2xl font-bold text-rose-100 mb-1">
        Harmonie Rompue !
      </h2>
      <p class="text-xs text-rose-300/70 mb-4">
        Un arbre mal placé perturbe les flux de la forêt.
      </p>

      <!-- Avertissement One-Strike & Anti-Mémorisation -->
      <div class="p-3 mb-6 rounded-2xl bg-black/50 border border-rose-500/20 text-left flex flex-col gap-2">
        <div class="flex items-center gap-2 text-xs font-semibold text-rose-300">
          <StarOff class="w-4 h-4 text-rose-400 shrink-0" />
          <span>Étoile One-Shot perdue ⭐</span>
        </div>
        <p class="text-[11px] text-rose-200/60 leading-relaxed">
          Pour éviter toute mémorisation visuelle involontaire, la grille va subir une <strong>rotation</strong> et un <strong>changement de couleurs</strong> lors du retry.
        </p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col gap-2.5">
        <button
          class="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-rose-950 bg-gradient-to-r from-rose-400 to-amber-300 hover:from-rose-300 hover:to-amber-200 active:scale-98 rounded-xl shadow-lg transition-all cursor-pointer"
          @click="emit('retry')"
        >
          <RotateCcw class="w-4 h-4" />
          <span>Recommencer (Nouveau regard)</span>
        </button>

        <button
          class="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-medium text-rose-200/80 hover:text-rose-100 bg-white/5 hover:bg-white/10 active:scale-98 rounded-xl border border-white/10 transition-all cursor-pointer"
          @click="emit('menu')"
        >
          <Grid class="w-3.5 h-3.5" />
          <span>Menu des Niveaux</span>
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
