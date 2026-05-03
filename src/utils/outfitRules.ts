import { ClothingItem, ClothingStyle } from '../types'

const STYLE_COMPATIBILITY: Record<ClothingStyle, ClothingStyle[]> = {
  sport: ['sport', 'casual'],
  casual: ['sport', 'casual', 'festive', 'formal'],
  festive: ['casual', 'festive', 'formal'],
  formal: ['casual', 'festive', 'formal'],
}

export function areStylesCompatible(items: ClothingItem[]): boolean {
  const styles = items
    .map(item => item.style)
    .filter((style): style is ClothingStyle => Boolean(style))

  if (!styles.length) return true

  for (let i = 0; i < styles.length; i++) {
    for (let j = i + 1; j < styles.length; j++) {
      const a = styles[i]
      const b = styles[j]

      if (!STYLE_COMPATIBILITY[a].includes(b) || !STYLE_COMPATIBILITY[b].includes(a)) {
        return false
      }
    }
  }

  return true
}

export function isOutfitValid(items: ClothingItem[]): boolean {
  if (!items.length) return false
  if (!areStylesCompatible(items)) return false

  const top = items.find(i =>
    i.category === 'tshirt' || i.category === 'longsleeve' || i.category === 'tanktop',
  )
  const bottom = items.find(i => i.category === 'pants' || i.category === 'shorts')
  const shoes = items.find(i => i.category === 'shoes')
  const jacket = items.find(i => i.category === 'jacket')

  if (!top || !bottom) return false

  if (bottom.style === 'sport' && shoes?.style === 'formal') return false
  if (bottom.style === 'formal' && shoes?.style === 'sport') return false

  if (top.style === 'sport' && shoes?.style === 'formal') return false
  if (top.style === 'formal' && shoes?.style === 'sport') return false

  if (jacket?.style === 'formal' && bottom.style === 'sport') return false
  if (jacket?.style === 'sport' && shoes?.style === 'formal') return false

  return true
}