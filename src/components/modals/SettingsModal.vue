<script setup lang="ts">
import { ref } from 'vue'
import { X, Volume2, Vibrate, Eye, Download, Upload, Check, Trees, Shield } from 'lucide-vue-next'
import { useSettingsStore } from '../../stores/settings'
import { useGameStore } from '../../stores/game'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const settingsStore = useSettingsStore()
const gameStore = useGameStore()

const exportSuccess = ref(false)
const importSuccess = ref(false)
const importError = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

async function handleExport() {
  const json = await gameStore.exportBackup()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bioma-save-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)

  exportSuccess.value = true
  setTimeout(() => (exportSuccess.value = false), 3000)
}

function triggerImport() {
  fileInput.value?.click()
}

async function handleFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    const success = await gameStore.importBackup(text)
    if (success) {
      importSuccess.value = true
      importError.value = false
      setTimeout(() => (importSuccess.value = false), 3000)
    } else {
      importError.value = true
    }
  } catch {
    importError.value = true
  } finally {
    target.value = ''
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
    <div class="relative w-full max-w-md max-h-[90vh] overflow-y-auto p-6 rounded-3xl bg-emerald-950/90 border border-emerald-500/30 shadow-2xl text-emerald-100">
      <!-- En-tête -->
      <div class="flex items-center justify-between mb-5 pb-3 border-b border-emerald-500/20">
        <h2 class="text-xl font-bold text-emerald-50">Réglages du Sanctuaire</h2>
        <button
          class="p-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-emerald-300 hover:text-white transition-all cursor-pointer"
          @click="emit('close')"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="space-y-6">
        <!-- 1. Options des Racines Végétales -->
        <section class="space-y-3">
          <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <Trees class="w-4 h-4" />
            <span>Déploiement des Racines</span>
          </div>

          <div class="space-y-2 text-xs">
            <label class="flex items-center justify-between p-3 rounded-2xl bg-black/30 border border-white/5 cursor-pointer hover:bg-black/40">
              <span class="font-medium text-emerald-100">Ligne & Colonne de l'arbre</span>
              <input
                type="checkbox"
                class="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                :checked="settingsStore.autoRootsRowCol"
                @change="settingsStore.toggleAutoRootsRowCol"
              />
            </label>

            <label class="flex items-center justify-between p-3 rounded-2xl bg-black/30 border border-white/5 cursor-pointer hover:bg-black/40">
              <span class="font-medium text-emerald-100">8 Voisins de Moore (autour de l'arbre)</span>
              <input
                type="checkbox"
                class="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                :checked="settingsStore.autoRootsNeighbors"
                @change="settingsStore.toggleAutoRootsNeighbors"
              />
            </label>

            <label class="flex items-center justify-between p-3 rounded-2xl bg-black/30 border border-white/5 cursor-pointer hover:bg-black/40">
              <div>
                <span class="font-medium text-emerald-100">Biome entier</span>
                <p class="text-[10px] text-emerald-300/50">Verrouille tout le biome après la pose</p>
              </div>
              <input
                type="checkbox"
                class="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                :checked="settingsStore.autoRootsBiome"
                @change="settingsStore.toggleAutoRootsBiome"
              />
            </label>
          </div>
        </section>

        <!-- 2. Retours Sensoriels & Accessibilité -->
        <section class="space-y-3">
          <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <Eye class="w-4 h-4" />
            <span>Sensations & Accessibilité</span>
          </div>

          <div class="space-y-2 text-xs">
            <label class="flex items-center justify-between p-3 rounded-2xl bg-black/30 border border-white/5 cursor-pointer hover:bg-black/40">
              <div class="flex items-center gap-2">
                <Vibrate class="w-4 h-4 text-emerald-400" />
                <span class="font-medium text-emerald-100">Retours Haptiques (Vibrations)</span>
              </div>
              <input
                type="checkbox"
                class="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                :checked="settingsStore.hapticsEnabled"
                @change="settingsStore.toggleHaptics"
              />
            </label>

            <label class="flex items-center justify-between p-3 rounded-2xl bg-black/30 border border-white/5 cursor-pointer hover:bg-black/40">
              <div class="flex items-center gap-2">
                <Volume2 class="w-4 h-4 text-emerald-400" />
                <span class="font-medium text-emerald-100">Effets Sonores (Web Audio)</span>
              </div>
              <input
                type="checkbox"
                class="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                :checked="settingsStore.soundEnabled"
                @change="settingsStore.toggleSound"
              />
            </label>

            <label class="flex items-center justify-between p-3 rounded-2xl bg-black/30 border border-white/5 cursor-pointer hover:bg-black/40">
              <div>
                <span class="font-medium text-emerald-100">Mode Daltonien (Textures géométriques)</span>
                <p class="text-[10px] text-emerald-300/50">Affiche des motifs SVG discrets sur chaque biome</p>
              </div>
              <input
                type="checkbox"
                class="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                :checked="settingsStore.colorblindMode"
                @change="settingsStore.toggleColorblindMode"
              />
            </label>
          </div>
        </section>

        <!-- 3. Sauvegarde & Restauration -->
        <section class="space-y-3">
          <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <Shield class="w-4 h-4" />
            <span>Persistance & Sauvegarde (IndexedDB)</span>
          </div>

          <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleFileSelected" />

          <div class="grid grid-cols-2 gap-2 text-xs">
            <button
              class="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-500/20 active:scale-95 transition-all cursor-pointer text-emerald-200"
              @click="handleExport"
            >
              <Check v-if="exportSuccess" class="w-4 h-4 text-emerald-400" />
              <Download v-else class="w-4 h-4" />
              <span>{{ exportSuccess ? 'Exporté !' : 'Exporter JSON' }}</span>
            </button>

            <button
              class="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-500/20 active:scale-95 transition-all cursor-pointer text-emerald-200"
              @click="triggerImport"
            >
              <Check v-if="importSuccess" class="w-4 h-4 text-emerald-400" />
              <Upload v-else class="w-4 h-4" />
              <span>{{ importSuccess ? 'Restauré !' : 'Importer JSON' }}</span>
            </button>
          </div>
          <p v-if="importError" class="text-[11px] text-rose-400 text-center">Fichier de sauvegarde invalide</p>
        </section>
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
  animation: fadeIn 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
