import { writeFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { generatePuzzle } from '../src/core/generator'
import type { PuzzleDefinition } from '../src/core/types'

async function run() {
  console.log('🌲 Génération du catalogue de 520 niveaux de Campagne pour Bioma...\n')

  const totalLevels = 520
  const levels: PuzzleDefinition[] = []

  // Définition des vagues non-linéaires de tailles
  function getSizeForLevel(index: number): number {
    const levelNum = index + 1
    if (levelNum <= 100) {
      // Vague 1 (1-100) : 6x6, 7x7, 8x8, 9x9 alternés
      const pattern = [6, 6, 7, 6, 8, 7, 6, 9, 7, 8]
      return pattern[index % pattern.length]
    } else if (levelNum <= 250) {
      // Vague 2 (101-250) : 7x7, 8x8, 9x9, 10x10, 11x11 alternés
      const pattern = [7, 8, 7, 9, 8, 10, 8, 11, 9, 10]
      return pattern[index % pattern.length]
    } else if (levelNum <= 400) {
      // Vague 3 (251-400) : 8x8, 9x9, 10x10, 11x11, 12x12 alternés
      const pattern = [8, 10, 9, 11, 9, 12, 10, 11, 10, 12]
      return pattern[index % pattern.length]
    } else {
      // Vague 4 (401-520) : 9x9, 10x10, 11x11, 12x12
      const pattern = [9, 11, 10, 12, 11, 12, 10, 12, 11, 12]
      return pattern[index % pattern.length]
    }
  }

  const startTime = Date.now()
  let generated = 0

  for (let i = 0; i < totalLevels; i++) {
    const size = getSizeForLevel(i)
    const id = `level-${i + 1}`

    let puzzle: PuzzleDefinition | null = null
    while (!puzzle) {
      puzzle = generatePuzzle(size, id)
    }

    levels.push(puzzle)
    generated++

    if (generated % 50 === 0 || generated === totalLevels) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
      console.log(`✨ [${generated}/${totalLevels}] Niveaux générés et certifiés uniques (${elapsed}s)`)
    }
  }

  const outputPath = fileURLToPath(new URL('../src/assets/levels/campaign.json', import.meta.url))
  writeFileSync(outputPath, JSON.stringify(levels, null, 2), 'utf-8')

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log(`\n🎉 Succès ! 520 niveaux écrits dans ${outputPath} en ${totalTime}s.`)
}

run().catch(err => {
  console.error('Erreur de génération :', err)
  process.exit(1)
})
