import { ClothingItem, ClothingStyle } from '../types'

export function getItemStyles(item: ClothingItem): ClothingStyle[] {
  if (Array.isArray(item.styles)) return item.styles
  if (item.style) return [item.style]

  return []
}

function isUniversal(item: ClothingItem): boolean {
  return getItemStyles(item).length === 0
}

function haveCommonStyle(a: ClothingItem, b: ClothingItem): boolean {
  if (isUniversal(a) || isUniversal(b)) return true

  const aStyles = getItemStyles(a)
  const bStyles = getItemStyles(b)

  return aStyles.some(style => bStyles.includes(style))
}

export function areStylesCompatible(items: ClothingItem[]): boolean {
  if (!items.length) return true

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (!haveCommonStyle(items[i], items[j])) {
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
    i.category === 'tshirt' ||
    i.category === 'longsleeve' ||
    i.category === 'tanktop',
  )

  const bottom = items.find(i =>
    i.category === 'pants' ||
    i.category === 'shorts',
  )

  const jacket = items.find(i => i.category === 'jacket')

  // Старая логика структуры образа:
  // нужен низ и хотя бы верх или куртка.
  if (!bottom) return false
  if (!top && !jacket) return false

  return true
}