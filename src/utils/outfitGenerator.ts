import { ClothingCategory, ClothingItem, Outfit } from '../types'
import { outfitColorScore } from './colorCompatibility'
import { isOutfitValid } from './outfitRules'

const OUTER_LAYERS: ClothingCategory[] = ['jacket']
const TOPS: ClothingCategory[] = ['tshirt', 'longsleeve', 'tanktop']
const BOTTOMS: ClothingCategory[] = ['pants', 'shorts']
const SHOES: ClothingCategory[] = ['shoes']

function pickByCategory(items: ClothingItem[], categories: ClothingCategory[]) {
  return items.filter(item => categories.includes(item.category))
}

function combinations<T>(arr: T[][]): T[][] {
  return arr.reduce<T[][]>(
    (acc, group) => acc.flatMap(prefix => group.map(item => [...prefix, item])),
    [[]],
  )
}

export function generateOutfits(items: ClothingItem[]): Outfit[] {
  const outerwear = pickByCategory(items, OUTER_LAYERS)
  const tops = pickByCategory(items, TOPS)
  const bottoms = pickByCategory(items, BOTTOMS)
  const shoes = pickByCategory(items, SHOES)

  if (!tops.length || !bottoms.length) return []

  const baseGroups: ClothingItem[][] = [tops, bottoms]
  const optionalGroups: ClothingItem[][] = []

  if (outerwear.length) optionalGroups.push([null as never, ...outerwear])
  if (shoes.length) optionalGroups.push([null as never, ...shoes])

  const combos = combinations([...baseGroups, ...optionalGroups])
    .map(combo => combo.filter(Boolean) as ClothingItem[])
    .filter(combo => combo.length >= 2)
    .filter(combo => isOutfitValid(combo))

  const scored = combos.map(combo => ({
    combo,
    score: outfitColorScore(combo.map(i => i.color)),
  }))

  scored.sort((a, b) => b.score - a.score)

  const unique = new Map<string, { combo: ClothingItem[]; score: number }>()
  for (const item of scored) {
    const key = item.combo
      .map(i => i.id)
      .sort()
      .join('_')

    if (!unique.has(key)) {
      unique.set(key, item)
    }
  }

  const toUse = Array.from(unique.values())

  return toUse.map(({ combo }) => ({
    id: combo
      .map(i => i.id)
      .sort()
      .join('_'),
    itemIds: combo.map(i => i.id),
    isFavorite: false,
    createdAt: Date.now(),
    tags: [],
  }))
}