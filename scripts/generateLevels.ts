import { writeFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { generatePuzzle } from '../src/core/generator'
import { encodeLevel, type CompactLevel } from '../src/core/codec'
import type { PuzzleDefinition } from '../src/core/types'

async function run() {
  console.log('🌲 Génération du catalogue de 520 niveaux ultra-compacts pour Bioma...\n')

  const totalLevels = 520
  const compactLevels: CompactLevel[] = []

  function getSizeForLevel(index: number): number {
    const levelNum = index + 1
    if (levelNum <= 100) {
      const pattern = [6, 6, 7, 6, 8, 7, 6, 9, 7, 8]
      return pattern[index % pattern.length]
    } else if (levelNum <= 250) {
      const pattern = [7, 8, 7, 9, 8, 10, 8, 11, 9, 10]
      return pattern[index % pattern.length]
    } else if (levelNum <= 400) {
      const pattern = [8, 10, 9, 11, 9, 12, 10, 11, 10, 12]
      return pattern[index % pattern.length]
    } else {
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

    compactLevels.push(encodeLevel(puzzle))
    generated++

    if (generated % 100 === 0 || generated === totalLevels) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
      console.log(`✨ [${generated}/${totalLevels}] Niveaux générés et encodés (${elapsed}s)`)
    }
  }

  const outputPath = fileURLToPath(new URL('../src/assets/levels/campaign.json', import.meta.url))
  writeFileSync(outputPath, JSON.stringify(compactLevels), 'utf-8')

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log(`\n🎉 Succès ! 520 niveaux compacts écrits dans ${outputPath} en ${totalTime}s.`)
}

run().catch(err => {
  console.error('Erreur de génération :', err)
  process.exit(1)
})
