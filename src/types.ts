export type ClothingCategory =
  | 'jacket'
  | 'tshirt'
  | 'longsleeve'
  | 'tanktop'
  | 'pants'
  | 'shorts'
  | 'shoes'

export const CATEGORY_LABELS: Record<ClothingCategory, string> = {
  jacket: 'КУРТКА (верхний слой)',
  tshirt: 'ФУТБОЛКА (нижний слой)',
  longsleeve: 'ДЛИННЫЙ РУКАВ',
  tanktop: 'МАЙКА',
  pants: 'ШТАНЫ',
  shorts: 'ШОРТЫ',
  shoes: 'ОБУВЬ',
}

export const CATEGORY_SHORT: Record<ClothingCategory, string> = {
  jacket: 'КУРТКА',
  tshirt: 'ФУТБОЛКА',
  longsleeve: 'ДЛИННЫЙ РУКАВ',
  tanktop: 'МАЙКА',
  pants: 'ШТАНЫ',
  shorts: 'ШОРТЫ',
  shoes: 'ОБУВЬ',
}

export type ClothingStyle =
  | 'sport'
  | 'casual'
  | 'festive'
  | 'formal'

export const ALL_CLOTHING_STYLES: ClothingStyle[] = [
  'sport',
  'casual',
  'festive',
  'formal',
]

export type OutfitTag =
  | 'sport'
  | 'casual'
  | 'festive'
  | 'formal'
  | 'work'
  | 'date'
  | 'summer'
  | 'winter'
  | 'favorite'

export type ColorFamily = 'blue' | 'gray' | 'red' | 'yellow' | 'green'

export interface ColorEntry {
  name: string
  hex: string
  family: ColorFamily
  lightness: number
}

export interface ClothingItem {
  id: string
  category: ClothingCategory
  image: string
  color: ColorEntry

  /**
   * У одной вещи может быть несколько стилей.
   * Например: ['sport', 'casual'].
   */
  styles: ClothingStyle[]

  /**
   * Старое поле оставляем только для совместимости со старыми сохранёнными вещами.
   * В новой логике используется styles.
   */
  style?: ClothingStyle

  createdAt: number
}

export interface Outfit {
  id: string
  itemIds: string[]
  tags?: OutfitTag[]
  isFavorite: boolean
  createdAt: number
}

export type Tab = 'wardrobe' | 'outfits' | 'upload' | 'match' | 'profile'