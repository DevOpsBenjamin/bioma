import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import GridBoard from '@/components/GridBoard.vue'
import GridCell from '@/components/GridCell.vue'
import TreeIcon from '@/components/icons/TreeIcon.vue'
import RootIcon from '@/components/icons/RootIcon.vue'
import LeafMarkIcon from '@/components/icons/LeafMarkIcon.vue'
import { useGameStore } from '@/stores/game'

describe('GridBoard & GridCell UI Components', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders GridBoard with correct number of cells for level 1', () => {
    const game = useGameStore()
    game.loadLevel(1)

    const wrapper = mount(GridBoard)
    const cells = wrapper.findAllComponents(GridCell)

    expect(cells.length).toBe(game.grid!.size * game.grid!.size)
  })

  it('renders TreeIcon when cell state is TREE', () => {
    const wrapper = mount(GridCell, {
      props: {
        cell: { row: 0, col: 0, biomeId: 0, state: 'TREE' },
        size: 6,
        borders: { top: true, right: true, bottom: true, left: true }
      }
    })

    expect(wrapper.findComponent(TreeIcon).exists()).toBe(true)
    expect(wrapper.findComponent(RootIcon).exists()).toBe(false)
  })

  it('renders RootIcon when cell state is HARD_ROOT', () => {
    const wrapper = mount(GridCell, {
      props: {
        cell: { row: 0, col: 0, biomeId: 0, state: 'HARD_ROOT' },
        size: 6,
        borders: { top: true, right: true, bottom: true, left: true }
      }
    })

    expect(wrapper.findComponent(RootIcon).exists()).toBe(true)
    expect(wrapper.findComponent(TreeIcon).exists()).toBe(false)
  })

  it('renders LeafMarkIcon when cell state is SOFT_MARK', () => {
    const wrapper = mount(GridCell, {
      props: {
        cell: { row: 0, col: 0, biomeId: 0, state: 'SOFT_MARK' },
        size: 6,
        borders: { top: true, right: true, bottom: true, left: true }
      }
    })

    expect(wrapper.findComponent(LeafMarkIcon).exists()).toBe(true)
  })

  it('disables eraser button when softMarkCount is 0, enables when soft marks exist', async () => {
    const game = useGameStore()
    game.loadLevel(1)

    const wrapper = mount(GridBoard)
    const eraserBtn = wrapper.find('button[title="Effacer tous les brouillons"]')

    expect(eraserBtn.attributes('disabled')).toBeDefined()

    // Add soft mark
    game.placeSoftMark(0, 0)
    await wrapper.vm.$nextTick()

    expect(eraserBtn.attributes('disabled')).toBeUndefined()
    expect(eraserBtn.text()).toContain('(1)')

    // Click eraser
    await eraserBtn.trigger('click')
    await wrapper.vm.$nextTick()

    expect(game.grid?.cells[0][0].state).toBe('EMPTY')
    expect(eraserBtn.attributes('disabled')).toBeDefined()
  })
})
