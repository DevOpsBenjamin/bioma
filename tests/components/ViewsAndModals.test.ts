import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import LevelSelectView from '@/components/LevelSelectView.vue'
import VictoryModal from '@/components/modals/VictoryModal.vue'
import FailModal from '@/components/modals/FailModal.vue'
import MindfulBreakModal from '@/components/modals/MindfulBreakModal.vue'
import SettingsModal from '@/components/modals/SettingsModal.vue'
import { useGameStore } from '@/stores/game'

vi.mock('canvas-confetti', () => ({
  default: vi.fn()
}))

describe('Views and Modals Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders LevelSelectView with all 520 levels and filters by wave', async () => {
    const wrapper = mount(LevelSelectView)
    expect(wrapper.text()).toContain('BIOMA')
    expect(wrapper.text()).toContain('520 Biomes')

    // Filter by Wave 1 (100 levels)
    const wave1Btn = wrapper.findAll('button').find(b => b.text().includes('Vague 1'))
    expect(wave1Btn).toBeDefined()
    await wave1Btn!.trigger('click')

    const levelCards = wrapper.findAll('.grid > div')
    expect(levelCards.length).toBe(100)
  })

  it('emits select-level when an unlocked level is clicked', async () => {
    const wrapper = mount(LevelSelectView)
    const firstLevelCard = wrapper.findAll('.grid > div')[0]

    await firstLevelCard.trigger('click')
    expect(wrapper.emitted('select-level')).toBeTruthy()
    expect(wrapper.emitted('select-level')![0]).toEqual([1])
  })

  it('emits next and menu events from VictoryModal', async () => {
    const game = useGameStore()
    game.loadLevel(1)

    const wrapper = mount(VictoryModal)
    expect(wrapper.text()).toContain('Harmonie Atteinte !')

    const nextBtn = wrapper.findAll('button').find(b => b.text().includes('Niveau Suivant'))
    await nextBtn?.trigger('click')
    expect(wrapper.emitted('next')).toBeTruthy()

    const menuBtn = wrapper.findAll('button').find(b => b.text().includes('Liste des Niveaux'))
    await menuBtn?.trigger('click')
    expect(wrapper.emitted('menu')).toBeTruthy()
  })

  it('emits retry and menu events from FailModal', async () => {
    const wrapper = mount(FailModal)
    expect(wrapper.text()).toContain('Harmonie Rompue !')

    const retryBtn = wrapper.findAll('button').find(b => b.text().includes('Recommencer'))
    await retryBtn?.trigger('click')
    expect(wrapper.emitted('retry')).toBeTruthy()

    const menuBtn = wrapper.findAll('button').find(b => b.text().includes('Menu des Niveaux'))
    await menuBtn?.trigger('click')
    expect(wrapper.emitted('menu')).toBeTruthy()
  })

  it('emits dismiss event from MindfulBreakModal', async () => {
    const wrapper = mount(MindfulBreakModal)
    expect(wrapper.text()).toContain('Pause Bienveillante')

    const continueBtn = wrapper.find('button')
    await continueBtn.trigger('click')
    expect(wrapper.emitted('dismiss')).toBeTruthy()
  })

  it('renders SettingsModal and emits close', async () => {
    const wrapper = mount(SettingsModal)
    expect(wrapper.text()).toContain('Réglages du Sanctuaire')

    const closeBtn = wrapper.findAll('button')[0]
    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
