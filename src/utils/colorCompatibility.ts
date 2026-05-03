import { ColorEntry, ColorFamily } from '../types'

// Color wheel complementary pairs
// Blue↔green added — a common and visually strong pairing
const COMPLEMENTARY: Partial<Record<ColorFamily, ColorFamily[]>> = {
  blue:   ['red', 'yellow', 'green'],
  red:    ['blue', 'green'],
  yellow: ['blue', 'green'],
  green:  ['red', 'yellow', 'blue'],
}

export function areColorsCompatible(a: ColorEntry, b: ColorEntry): boolean {
  // Neutrals (gray) go with everything
  if (a.family === 'gray' || b.family === 'gray') return true

  // Same family always works (monochrome looks)
  if (a.family === b.family) return true

  // Complementary pairings
  const aComps = COMPLEMENTARY[a.family] ?? []
  if (aComps.includes(b.family)) return true

  return false
}

export function outfitColorScore(colors: ColorEntry[]): number {
  if (colors.length <= 1) return 1
  let compatible = 0
  let total = 0
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      total++
      if (areColorsCompatible(colors[i], colors[j])) compatible++
    }
  }
  return total === 0 ? 1 : compatible / total
}
