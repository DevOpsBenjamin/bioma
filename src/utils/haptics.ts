/**
 * Module de retours haptiques via l'API Vibration du navigateur.
 */

let hapticsEnabled = true

export function setHapticsEnabled(enabled: boolean) {
  hapticsEnabled = enabled
}

export function isHapticsSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'
}

export function triggerHaptic(pattern: number | number[]): void {
  if (!hapticsEnabled || !isHapticsSupported()) return
  try {
    navigator.vibrate(pattern)
  } catch {
    // Ignorer silencieusement si bloqué par l'OS
  }
}

/** Micro-impulsion subtile pour pose/effacement de brouillon (10ms) */
export function hapticSoftMark(): void {
  triggerHaptic(10)
}

/** Clic franc et gratifiant lors de l'ancrage d'un Arbre (25ms) */
export function hapticTreePlant(): void {
  triggerHaptic(25)
}

/** Double impulsion végétale lors du déploiement des racines */
export function hapticRootsDeploy(): void {
  triggerHaptic([15, 20, 15])
}

/** Vibration sourde d'échec Hardcore */
export function hapticFail(): void {
  triggerHaptic([70, 40, 90])
}

/** Séquence rythmique ascendante de célébration de Victoire */
export function hapticVictory(): void {
  triggerHaptic([40, 30, 40, 30, 70, 40, 120])
}

/** Petit clic pour l'effacement global à la gomme */
export function hapticEraser(): void {
  triggerHaptic(15)
}
