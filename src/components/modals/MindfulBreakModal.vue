<script setup lang="ts">
import { Heart, Sparkles } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'dismiss'): void
}>()
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
    <div class="relative w-full max-w-sm p-6 text-center rounded-3xl bg-gradient-to-b from-teal-950/90 to-black/95 border border-teal-500/30 shadow-[0_0_50px_rgba(20,184,166,0.25)]">
      <!-- Icône Zen -->
      <div class="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40 shadow-inner">
        <Heart class="w-8 h-8 animate-pulse text-teal-300" />
      </div>

      <h2 class="text-2xl font-bold text-teal-100 mb-1">
        Pause Bienveillante 🌿
      </h2>
      <p class="text-xs text-teal-300/70 mb-4">
        10 niveaux résolus d'affilée !
      </p>

      <div class="p-3 mb-6 rounded-2xl bg-black/40 border border-teal-500/20 text-xs text-teal-200/80 leading-relaxed">
        Prenez une profonde inspiration, buvez une gorgée d'eau et détendez vos yeux quelques secondes avant de replonger dans la forêt.
      </div>

      <button
        class="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-teal-950 bg-gradient-to-r from-teal-400 to-emerald-300 hover:from-teal-300 hover:to-emerald-200 active:scale-98 rounded-xl shadow-lg transition-all cursor-pointer"
        @click="emit('dismiss')"
      >
        <Sparkles class="w-4 h-4" />
        <span>Continuer le voyage</span>
      </button>
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
