<script setup lang="ts">
import { computed } from 'vue'
import { BIOME_THEMES } from '../constants/biomes'
import { useSettingsStore } from '../stores/settings'
import TreeIcon from './icons/TreeIcon.vue'
import RootIcon from './icons/RootIcon.vue'
import LeafMarkIcon from './icons/LeafMarkIcon.vue'
import type { Cell } from '../core/types'

const props = defineProps<{
  cell: Cell
  size: number
  borders: {
    top: boolean
    right: boolean
    bottom: boolean
    left: boolean
  }
}>()

const settingsStore = useSettingsStore()

const theme = computed(() => {
  const biomeIndex = props.cell.biomeId % BIOME_THEMES.length
  return BIOME_THEMES[biomeIndex] || BIOME_THEMES[0]
})

const borderClasses = computed(() => {
  return [
    props.borders.top ? 'border-t-[2.5px] border-emerald-200/50' : 'border-t border-white/[0.07]',
    props.borders.right ? 'border-r-[2.5px] border-emerald-200/50' : 'border-r border-white/[0.07]',
    props.borders.bottom ? 'border-b-[2.5px] border-emerald-200/50' : 'border-b border-white/[0.07]',
    props.borders.left ? 'border-l-[2.5px] border-emerald-200/50' : 'border-l border-white/[0.07]'
  ]
})
</script>

<template>
  <div
    class="relative flex items-center justify-center select-none w-full h-full cursor-pointer transition-colors duration-150 overflow-hidden"
    :class="borderClasses"
    :style="{ backgroundColor: theme.color + '45' }"
    :data-row="cell.row"
    :data-col="cell.col"
  >
    <!-- Texture d'accessibilité daltonienne -->
    <svg
      v-if="settingsStore.colorblindMode"
      class="absolute inset-0 w-full h-full pointer-events-none opacity-40 text-white"
    >
      <rect width="100%" height="100%" :fill="`url(#${theme.patternId})`" />
    </svg>

    <!-- Rendu de l'élément de cellule -->
    <TreeIcon v-if="cell.state === 'TREE'" />
    <RootIcon v-else-if="cell.state === 'HARD_ROOT'" />
    <LeafMarkIcon v-else-if="cell.state === 'SOFT_MARK'" />
  </div>
</template>
