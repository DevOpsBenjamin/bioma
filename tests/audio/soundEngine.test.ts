import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  setSoundEnabled,
  playSoftMarkSound,
  playTreePlantSound,
  playRootsDeploySound,
  playFailSound,
  playVictoryFanfare,
  playEraserSound
} from '@/audio/soundEngine'

describe('Sound Engine Synthesizer', () => {
  beforeEach(() => {
    setSoundEnabled(true)
  })

  it('runs all procedural sound functions safely without throwing in Node / browser environment', () => {
    expect(() => playSoftMarkSound()).not.toThrow()
    expect(() => playTreePlantSound()).not.toThrow()
    expect(() => playRootsDeploySound()).not.toThrow()
    expect(() => playFailSound()).not.toThrow()
    expect(() => playVictoryFanfare()).not.toThrow()
    expect(() => playEraserSound()).not.toThrow()
  })

  it('respects sound enabled toggle', () => {
    setSoundEnabled(false)
    expect(() => playTreePlantSound()).not.toThrow()
  })

  it('synthesizes Web Audio oscillators when AudioContext is mocked', () => {
    const createOscillatorMock = vi.fn().mockReturnValue({
      type: 'sine',
      frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn()
    })
    const createGainMock = vi.fn().mockReturnValue({
      gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn()
    })

    class MockAudioContext {
      currentTime = 0
      state = 'running'
      destination = {}
      createOscillator = createOscillatorMock
      createGain = createGainMock
      resume = vi.fn().mockResolvedValue(undefined)
    }

    vi.stubGlobal('window', {
      AudioContext: MockAudioContext
    })

    playTreePlantSound()
    expect(createOscillatorMock).toHaveBeenCalled()
    expect(createGainMock).toHaveBeenCalled()
  })
})
