import { ColorEntry, ColorFamily } from '../types'

function makeShades(
  family: ColorFamily,
  hexes: string[],
  lightnessStart = 95,
  lightnessStep = -8
): ColorEntry[] {
  return hexes.map((hex, i) => ({
    name: `${family.charAt(0).toUpperCase() + family.slice(1)} ${i * 10}`,
    hex,
    family,
    lightness: Math.max(0, lightnessStart + i * lightnessStep),
  }))
}

const blues = makeShades('blue', [
  '#EBF0FF', '#D6E2FF', '#BDD0FF', '#9DBDFF', '#79A8FF',
  '#5590FF', '#2D77FF', '#0060FF', '#004FD6', '#003FAD',
  '#002E84',
])

const grays = makeShades('gray', [
  '#FFFFFF', '#F5F5F5', '#E8E8E8', '#D4D4D4', '#ABABAB',
  '#8A8A8A', '#6B6B6B', '#4E4E4E', '#333333', '#1A1A1A',
  '#000000',
])

const reds = makeShades('red', [
  '#FFF5F5', '#FFE0E0', '#FFC5C5', '#FFA3A3', '#FF7878',
  '#FF4D4D', '#FF2020', '#E60000', '#BD0000', '#940000',
  '#6B0000',
])

const yellows = makeShades('yellow', [
  '#FFFDE0', '#FFF8B0', '#FFF080', '#FFE54D', '#FFD900',
  '#FFCC00', '#FFBF00', '#E6A800', '#BD8800', '#946800',
  '#6B4A00',
])

const greens = makeShades('green', [
  '#F0FBF0', '#D6F5D6', '#AEEAAE', '#80DC80', '#50CE50',
  '#28BF28', '#0FAF0F', '#0A9A0A', '#077A07', '#045A04',
  '#023A02',
])

export const COLOR_PALETTE: ColorEntry[] = [
  ...blues,
  ...grays,
  ...reds,
  ...yellows,
  ...greens,
]

export const PALETTE_BY_FAMILY: Record<ColorFamily, ColorEntry[]> = {
  blue: blues,
  gray: grays,
  red: reds,
  yellow: yellows,
  green: greens,
}

export const FAMILY_LABELS: Record<ColorFamily, string> = {
  blue: 'Синий',
  gray: 'Серый',
  red: 'Красный',
  yellow: 'Жёлтый',
  green: 'Зелёный',
}
