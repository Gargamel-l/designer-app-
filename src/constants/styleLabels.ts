import { ClothingStyle, OutfitTag } from '../types'

export const STYLE_LABELS: Record<ClothingStyle, string> = {
  sport: 'Спортивный',
  casual: 'Повседневный',
  festive: 'Праздничный',
  formal: 'Официальный',
}

export const OUTFIT_TAG_LABELS: Record<OutfitTag, string> = {
  sport: 'Спорт',
  casual: 'Повседневный',
  festive: 'На выход',
  formal: 'Официальный',
  work: 'На работу',
  date: 'Свидание',
  summer: 'Лето',
  winter: 'Зима',
  favorite: 'Любимое',
}

export const STYLE_OPTIONS: ClothingStyle[] = ['sport', 'casual', 'festive', 'formal']

export const OUTFIT_TAG_OPTIONS: OutfitTag[] = [
  'sport',
  'casual',
  'festive',
  'formal',
  'work',
  'date',
  'summer',
  'winter',
  'favorite',
]