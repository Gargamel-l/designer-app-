import { Box } from '@mui/material'
import { ClothingCategory, ClothingItem } from '../types'

type OutfitCompositeProps = {
  items: ClothingItem[]
  height?: number | string
}

const layoutByCategory: Record<ClothingCategory, Record<string, string | number>> = {
  jacket: {
    top: '4%',
    left: '12%',
    width: '76%',
    height: '36%',
    zIndex: 5,
  },
  tshirt: {
    top: '8%',
    left: '18%',
    width: '64%',
    height: '28%',
    zIndex: 4,
  },
  longsleeve: {
    top: '8%',
    left: '16%',
    width: '68%',
    height: '29%',
    zIndex: 4,
  },
  tanktop: {
    top: '10%',
    left: '22%',
    width: '56%',
    height: '24%',
    zIndex: 4,
  },
  pants: {
    top: '34%',
    left: '22%',
    width: '56%',
    height: '31%',
    zIndex: 3,
  },
  shorts: {
    top: '36%',
    left: '24%',
    width: '52%',
    height: '24%',
    zIndex: 3,
  },
  shoes: {
    bottom: '12%',
    right: '10%',
    width: '28%',
    height: '16%',
    zIndex: 2,
  },
}

export default function OutfitComposite({ items, height = 460 }: OutfitCompositeProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height,
        overflow: 'hidden',
      }}
    >
      {items.map(item => {
        const layout = layoutByCategory[item.category]

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