import { ColorEntry } from '../types'
import { COLOR_PALETTE } from '../data/colors'

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
}

function colorDist(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) {
  // Perceptual weights (luminance-adjusted)
  return Math.sqrt(2 * (r1-r2)**2 + 4 * (g1-g2)**2 + 3 * (b1-b2)**2)
}

export async function detectDominantColor(dataUrl: string): Promise<ColorEntry | null> {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const maxDim = 80
      const scale = Math.min(maxDim / img.width, maxDim / img.height, 1)
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)

      const { data } = ctx.getImageData(0, 0, w, h)
      const votes = new Map<string, number>(COLOR_PALETTE.map(c => [c.hex, 0]))

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue // skip transparent
        const r = data[i], g = data[i + 1], b = data[i + 2]

        let minDist = Infinity
        let nearest = COLOR_PALETTE[0]
        for (const color of COLOR_PALETTE) {
          const [pr, pg, pb] = hexToRgb(color.hex)
          const d = colorDist(r, g, b, pr, pg, pb)
          if (d < minDist) { minDist = d; nearest = color }
        }
        votes.set(nearest.hex, (votes.get(nearest.hex) ?? 0) + 1)
      }

      let best: ColorEntry | null = null
      let maxVotes = 0
      for (const color of COLOR_PALETTE) {
        const v = votes.get(color.hex) ?? 0
        if (v > maxVotes) { maxVotes = v; best = color }
      }
      resolve(best)
    }
    img.onerror = () => resolve(null)
    img.src = dataUrl
  })
}
