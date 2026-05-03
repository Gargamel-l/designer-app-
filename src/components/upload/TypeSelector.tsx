import { Box, Button } from '@mui/material'
import { CATEGORY_LABELS, ClothingCategory } from '../../types'

type Props = {
  value: ClothingCategory | null
  onChange: (value: ClothingCategory) => void
}

const CATEGORIES: ClothingCategory[] = [
  'jacket',
  'tshirt',
  'longsleeve',
  'tanktop',
  'pants',
  'shorts',
  'shoes',
]

export default function TypeSelector({ value, onChange }: Props) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1.25 }}>
      {CATEGORIES.map(category => {
        const active = value === category

        return (
          <Button
            key={category}
            variant={active ? 'contained' : 'outlined'}
            onClick={() => onChange(category)}
            sx={{
              minHeight: 46,
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: active ? '#111' : undefined,
              color: active ? '#fff' : '#111',
              borderColor: '#111',
            }}
          >
            {CATEGORY_LABELS[category]}
          </Button>
        )
      })}
    </Box>
  )
}