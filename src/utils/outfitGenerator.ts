import { ClothingItem, ClothingCategory, Outfit } from '../types'
import { outfitColorScore } from './colorCompatibility'
import { isOutfitValid } from './outfitRules'
import { v4 as uuidv4 } from 'uuid'

const OUTER_LAYERS: ClothingCategory[] = ['jacket']
const TOPS: ClothingCategory[] = ['tshirt', 'longsleeve', 'tanktop']
const BOTTOMS: ClothingCategory[] = ['pants', 'shorts']
const FOOTWEAR: ClothingCategory[] = ['shoes']

function byCategory(items: ClothingItem[], cats: ClothingCategory[]) {
  return items.filter(i => cats.includes(i.category))
}

function comboKey(combo: ClothingItem[]): string {
  return combo.map(i => i.id).sort().join('|')
}

// Full cartesian product of all provided arrays (no filtering)
function cartesian(...groups: ClothingItem[][]): ClothingItem[][] {
  return groups.reduce<ClothingItem[][]>(
    (acc, group) => acc.flatMap(combo => group.map(item => [...combo, item])),
    [[]],
  )
}

export function generateOutfits(
  items: ClothingItem[],
  existingOutfitIds: Set<string>,
): Outfit[] {
  const outers = byCategory(items, OUTER_LAYERS)
  const tops = byCategory(items, TOPS)
  const bottoms = byCategory(items, BOTTOMS)
  const shoes = byCategory(items, FOOTWEAR)

  const allCandidates: ClothingItem[][] = []

  function add(groups: ClothingItem[][]): void {
    for (const combo of cartesian(...groups)) {
      allCandidates.push(combo)
    }
  }

  // Правило: каждый образ содержит (верх ИЛИ куртку) + низ
  // Куртка может выступать как верхняя вещь при отсутствии tops

  // 4 предмета: куртка + верх + низ + обувь
  if (outers.length && tops.length && bottoms.length && shoes.length) {
    add([outers, tops, bottoms, shoes])
  }

  // 3 предмета с курткой
  if (outers.length && tops.length && bottoms.length) {
    add([outers, tops, bottoms])
  }

  if (outers.length && bottoms.length && shoes.length) {
    add([outers, bottoms, shoes]) // куртка = верх + низ + обувь
  }

  // 3 предмета без куртки
  if (tops.length && bottoms.length && shoes.length) {
    add([tops, bottoms, shoes])
  }

  // 2 предмета: верх + низ (минимальный образ)
  if (tops.length && bottoms.length) {
    add([tops, bottoms])
  }

  if (outers.length && bottoms.length) {
    add([outers, bottoms]) // куртка = верх + низ
  }

  // Дедупликация по ключу из отсортированных id
  const seen = new Set<string>()
  const scored: Array<{ combo: ClothingItem[]; score: number }> = []

  for (const combo of allCandidates) {
    // Новая логика: сначала проверяем совместимость стилей.
    // Старая цветовая логика остаётся ниже без изменений.
    if (!isOutfitValid(combo)) continue

    const key = comboKey(combo)
    if (seen.has(key)) continue

    // На будущее: если потребуется не генерировать уже сохранённые образы,
    // можно сверять key с existingOutfitIds. Сейчас старую логику не меняем.
    void existingOutfitIds

    seen.add(key)

    scored.push({
      combo,
      score: outfitColorScore(combo.map(i => i.color)),
    })
  }

  // Сортировка по совместимости цветов (лучшие — первые)
  scored.sort((a, b) => b.score - a.score)

  // Умный порог: предпочитаем score >= 0.5
  // Если хороших комбинаций нет — показываем все (чтобы экран не был пустым)
  const GOOD_THRESHOLD = 0.5
  const good = scored.filter(x => x.score >= GOOD_THRESHOLD)
  const toUse = good.length >= 1 ? good : scored

  return toUse.map(({ combo }) => ({
    id: uuidv4(),
    itemIds: combo.map(i => i.id),
    isFavorite: false,
    createdAt: Date.now(),
  }))
}