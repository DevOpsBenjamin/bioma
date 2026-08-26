import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getStoredSettings, saveStoredSettings, type UserSettings } from '../storage/indexedDb'

export const useSettingsStore = defineStore('settings', () => {
  const autoRootsRowCol = ref(true)
  const autoRootsNeighbors = ref(true)
  const autoRootsBiome = ref(false)
  const hapticsEnabled = ref(true)
  const soundEnabled = ref(true)
  const colorblindMode = ref(true)

  async function loadSettings() {
    const stored = await getStoredSettings()
    if (stored) {
      autoRootsRowCol.value = stored.autoRootsRowCol
      autoRootsNeighbors.value = stored.autoRootsNeighbors
      autoRootsBiome.value = stored.autoRootsBiome
      hapticsEnabled.value = stored.hapticsEnabled
      soundEnabled.value = stored.soundEnabled
      colorblindMode.value = stored.colorblindMode
    }
  }

  function getSettingsSnapshot(): UserSettings {
    return {
      autoRootsRowCol: autoRootsRowCol.value,
      autoRootsNeighbors: autoRootsNeighbors.value,
      autoRootsBiome: autoRootsBiome.value,
      hapticsEnabled: hapticsEnabled.value,
      soundEnabled: soundEnabled.value,
      colorblindMode: colorblindMode.value
    }
  }

  async function persist() {
    await saveStoredSettings(getSettingsSnapshot())
  }

  function toggleAutoRootsRowCol() {
    autoRootsRowCol.value = !autoRootsRowCol.value
    persist()
  }

  function toggleAutoRootsNeighbors() {
    autoRootsNeighbors.value = !autoRootsNeighbors.value
    persist()
  }

  function toggleAutoRootsBiome() {
    autoRootsBiome.value = !autoRootsBiome.value
    persist()
  }

  function toggleHaptics() {
    hapticsEnabled.value = !hapticsEnabled.value
    persist()
  }

  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
    persist()
  }

  function toggleColorblindMode() {
    colorblindMode.value = !colorblindMode.value
    persist()
  }

  return {
    autoRootsRowCol,
    autoRootsNeighbors,
    autoRootsBiome,
    hapticsEnabled,
    soundEnabled,
    colorblindMode,
    loadSettings,
    getSettingsSnapshot,
    toggleAutoRootsRowCol,
    toggleAutoRootsNeighbors,
    toggleAutoRootsBiome,
    toggleHaptics,
    toggleSound,
    toggleColorblindMode
  }
})
