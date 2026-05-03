import { Box, Typography, ButtonBase } from '@mui/material'
import { ClothingCategory, CATEGORY_LABELS } from '../../types'

const CATEGORIES: ClothingCategory[] = [
  'jacket', 'tshirt', 'longsleeve', 'tanktop', 'pants', 'shorts', 'shoes',
]

interface Props {
  onSelect: (cat: ClothingCategory) => void
}

export default function TypeSelector({ onSelect }: Props) {
  return (
    <Box sx={{ p: 3, pt: 2 }}>
      <Typography variant="h2" sx={{ mb: 2, fontSize: '1rem' }}>
        ВЫБЕРИТЕ ФОРМУ ЗАГРУЗКИ ОДЕЖДЫ
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {CATEGORIES.map(cat => (
          <ButtonBase
            key={cat}
            onClick={() => onSelect(cat)}
            sx={{
              display: 'block',
              textAlign: 'left',
              py: 1.75,
              px: 1,
              borderBottom: '1px solid #e0e0e0',
              '&:hover': { bgcolor: '#f5f5f5' },
              '&:last-child': { borderBottom: 'none' },
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
              {CATEGORY_LABELS[cat]}
            </Typography>
          </ButtonBase>
        ))}
      </Box>
    </Box>
  )
}
