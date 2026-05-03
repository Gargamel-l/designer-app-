import { Box } from '@mui/material'
import { ClothingItem, ClothingCategory } from '../types'

interface Props {
  items: ClothingItem[]
  size?: 'small' | 'large'
}

// Render order: items earlier in array go behind later items (lower DOM order = behind)
// zIndex ensures correct visual stacking regardless of render order
const LAYER_ORDER: ClothingCategory[] = [
  'shoes', 'pants', 'shorts', 'tanktop', 'tshirt', 'longsleeve', 'jacket',
]

function getLayout(category: ClothingCategory): React.CSSProperties {
  // Flat-lay layout: upper body top-left, lower body bottom-center, shoes bottom-right
  // zIndex: jacket(5) > tops(3) > bottoms(2) > shoes(1)
  const layouts: Partial<Record<ClothingCategory, React.CSSProperties>> = {
    pants:      { bottom: '2%',  left: '18%', width: '54%', height: '65%', zIndex: 2 },
    shorts:     { bottom: '2%',  left: '18%', width: '54%', height: '48%', zIndex: 2 },
    jacket:     { top:    '3%',  left: '3%',  width: '65%', height: '56%', zIndex: 5 },
    longsleeve: { top:    '6%',  left: '20%', width: '52%', height: '47%', zIndex: 3 },
    tshirt:     { top:    '6%',  left: '20%', width: '52%', height: '43%', zIndex: 3 },
    tanktop:    { top:    '8%',  left: '22%', width: '50%', height: '39%', zIndex: 3 },
    shoes: { bottom: '10%', right: '8%', width: '32%', height: '22%', zIndex: 1 },
  }
  return layouts[category] ?? { top: '10%', left: '10%', width: '80%', height: '80%', zIndex: 1 }
}

export default function OutfitComposite({ items, size = 'large' }: Props) {
  const sorted = [...items].sort(
    (a, b) => LAYER_ORDER.indexOf(a.category) - LAYER_ORDER.indexOf(b.category)
  )

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        paddingBottom: size === 'small' ? '105%' : '112%',
        bgcolor: '#f0f0f0',
        overflow: 'hidden',
      }}
    >
      {sorted.map(item => {
        const layout = getLayout(item.category)
        return (
        <Box
          key={item.id}
          component="img"
          src={item.image}
          alt={item.category}
          sx={{
            position: 'absolute',
            objectFit: 'contain',
            imageRendering: 'auto',
            pointerEvents: 'none',
            userSelect: 'none',
            ...layout,
          }}
        />
        )
      })}
    </Box>
  )
}
