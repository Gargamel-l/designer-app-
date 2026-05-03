import { Box, Typography, IconButton } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { ClothingItem, CATEGORY_SHORT } from '../types'

interface Props {
  item: ClothingItem
  onDelete?: () => void
  onClick?: () => void
}

export default function ClothingCard({ item, onDelete, onClick }: Props) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        bgcolor: '#e8e8e8',
        aspectRatio: '1',
        overflow: 'hidden',
        '&:hover .delete-btn': { opacity: 1 },
      }}
    >
      <Box
        component="img"
        src={item.image}
        alt={item.category}
        sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 1 }}
      />
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, bgcolor: item.color.hex }} />
      <Box sx={{ position: 'absolute', top: 4, left: 4, bgcolor: 'rgba(255,255,255,0.85)', px: 0.5, py: 0.25 }}>
        <Typography variant="caption" sx={{ fontSize: '0.55rem', fontWeight: 700 }}>
          {CATEGORY_SHORT[item.category]}
        </Typography>
      </Box>
      {onDelete && (
        <IconButton
          className="delete-btn"
          size="small"
          onClick={e => { e.stopPropagation(); onDelete() }}
          sx={{
            position: 'absolute', top: 2, right: 2, opacity: 0,
            transition: 'opacity 0.2s', bgcolor: 'rgba(255,255,255,0.9)', p: 0.3,
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
          }}
        >
          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
        </IconButton>
      )}
    </Box>
  )
}
