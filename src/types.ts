export type Tab = 'wardrobe' | 'match' | 'outfits'

export type ClothingCategory =
  | 'jacket'
  | 'tshirt'
  | 'longsleeve'
  | 'tanktop'
  | 'pants'
  | 'shorts'
  | 'shoes'

export type ClothingStyle = 'sport' | 'casual' | 'festive' | 'formal'

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

export type ColorFamily =
  | 'black'
  | 'white'
  | 'gray'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'brown'
  | 'beige'

export type ColorEntry = {
  name: string
  hex: string
  family: ColorFamily
}

export interface ClothingItem {
  id: string
  category: ClothingCategory
  image: string
  color: ColorEntry
  createdAt: number
  style?: ClothingStyle
}

export interface Outfit {
  id: string
  itemIds: string[]
  isFavorite: boolean
  createdAt: number
  tags?: OutfitTag[]
}

export const CATEGORY_LABELS: Record<ClothingCategory, string> = {
  jacket: 'Куртка / верхний слой',
  tshirt: 'Футболка',
  longsleeve: 'Лонгслив',
  tanktop: 'Майка',
  pants: 'Брюки',
  shorts: 'Шорты',
  shoes: 'Обувь',
}

export const CATEGORY_SHORT: Record<ClothingCategory, string> = {
  jacket: 'Куртка',
  tshirt: 'Футболка',
  longsleeve: 'Лонгслив',
  tanktop: 'Майка',
  pants: 'Брюки',
  shorts: 'Шорты',
  shoes: 'Обувь',
}