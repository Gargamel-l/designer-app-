import { ColorEntry, ColorFamily } from '../types'

export const COLOR_PALETTE: ColorEntry[] = [
  { name: 'Черный', hex: '#000000', family: 'black' },
  { name: 'Белый', hex: '#FFFFFF', family: 'white' },
  { name: 'Серый', hex: '#808080', family: 'gray' },
  { name: 'Красный', hex: '#D32F2F', family: 'red' },
  { name: 'Оранжевый', hex: '#F57C00', family: 'orange' },
  { name: 'Желтый', hex: '#FBC02D', family: 'yellow' },
  { name: 'Зеленый', hex: '#388E3C', family: 'green' },
  { name: 'Синий', hex: '#1976D2', family: 'blue' },
  { name: 'Фиолетовый', hex: '#7B1FA2', family: 'purple' },
  { name: 'Розовый', hex: '#E91E63', family: 'pink' },
  { name: 'Коричневый', hex: '#6D4C41', family: 'brown' },
  { name: 'Бежевый', hex: '#D7CCC8', family: 'beige' },
]

export const COLORS = COLOR_PALETTE

export const PALETTE_BY_FAMILY: Record<ColorFamily, ColorEntry[]> = {
  black: COLOR_PALETTE.filter(c => c.family === 'black'),
  white: COLOR_PALETTE.filter(c => c.family === 'white'),
  gray: COLOR_PALETTE.filter(c => c.family === 'gray'),
  red: COLOR_PALETTE.filter(c => c.family === 'red'),
  orange: COLOR_PALETTE.filter(c => c.family === 'orange'),
  yellow: COLOR_PALETTE.filter(c => c.family === 'yellow'),
  green: COLOR_PALETTE.filter(c => c.family === 'green'),
  blue: COLOR_PALETTE.filter(c => c.family === 'blue'),
  purple: COLOR_PALETTE.filter(c => c.family === 'purple'),
  pink: COLOR_PALETTE.filter(c => c.family === 'pink'),
  brown: COLOR_PALETTE.filter(c => c.family === 'brown'),
  beige: COLOR_PALETTE.filter(c => c.family === 'beige'),
}

export const FAMILY_LABELS: Record<ColorFamily, string> = {
  black: 'Черные',
  white: 'Белые',
  gray: 'Серые',
  red: 'Красные',
  orange: 'Оранжевые',
  yellow: 'Желтые',
  green: 'Зеленые',
  blue: 'Синие',
  purple: 'Фиолетовые',
  pink: 'Розовые',
  brown: 'Коричневые',
  beige: 'Бежевые',
}