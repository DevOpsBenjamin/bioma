import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  setHapticsEnabled,
  isHapticsSupported,
  triggerHaptic,
  hapticSoftMark,
  hapticTreePlant,
  hapticRootsDeploy,
  hapticFail,
  hapticVictory,
  hapticEraser
} from '@/utils/haptics'

describe('Haptics Module', () => {
  beforeEach(() => {
    setHapticsEnabled(true)
    vi.restoreAllMocks()
  })

  it('detects vibration support safely', () => {
    expect(typeof isHapticsSupported()).toBe('boolean')
  })

  it('triggers vibration patterns when supported and enabled', () => {
    const vibrateMock = vi.fn()
    vi.stubGlobal('navigator', {
      vibrate: vibrateMock
    })

    hapticSoftMark()
    expect(vibrateMock).toHaveBeenCalledWith(10)

    hapticTreePlant()
    expect(vibrateMock).toHaveBeenCalledWith(25)

    hapticRootsDeploy()
    expect(vibrateMock).toHaveBeenCalledWith([15, 20, 15])

    hapticFail()
    expect(vibrateMock).toHaveBeenCalledWith([70, 40, 90])

    hapticVictory()
    expect(vibrateMock).toHaveBeenCalledWith([40, 30, 40, 30, 70, 40, 120])

    hapticEraser()
    expect(vibrateMock).toHaveBeenCalledWith(15)
  })

  it('respects disabled haptics toggle', () => {
    const vibrateMock = vi.fn()
    vi.stubGlobal('navigator', {
      vibrate: vibrateMock
    })

    setHapticsEnabled(false)
    triggerHaptic(50)
    expect(vibrateMock).not.toHaveBeenCalled()
  })
})
