import { ColorEntry } from '../types'
import { COLOR_PALETTE } from '../data/colors'

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '')
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map(char => char + char)
          .join('')
      : normalized

  const num = parseInt(value, 16)

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

function colorDistance(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2)
}

export function detectNearestColor(hex: string): ColorEntry {
  const source = hexToRgb(hex)

  let best = COLOR_PALETTE[0]
  let minDistance = Number.POSITIVE_INFINITY

  for (const c of COLOR_PALETTE) {
    const distance = colorDistance(source, hexToRgb(c.hex))
    if (distance < minDistance) {
      minDistance = distance
      best = c
    }
  }

  return best
}