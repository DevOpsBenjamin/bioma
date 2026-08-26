<script setup lang="ts">
import { ref } from 'vue'

const title = ref('Bioma')
const subtitle = ref('Harmonie végétale & réflexion zen')
</script>

<template>
  <main class="min-h-screen bg-[#091310] text-[#ecfdf5] flex flex-col items-center justify-center p-6 text-center select-none">
    <div class="max-w-md w-full glass rounded-3xl p-8 shadow-2xl border border-emerald-500/20 flex flex-col items-center gap-6">
      <div class="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-4xl shadow-inner shadow-emerald-500/20">
        🌲
      </div>
      
      <div class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          <span>{{ title }}</span>
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">v0.1</span>
        </h1>
        <p class="text-sm text-emerald-200/70">{{ subtitle }}</p>
      </div>

      <div class="w-full py-3 px-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300/80">
        ✨ Prêt pour la phase de conception & architecture.
      </div>
    </div>
  </main>
</template>

