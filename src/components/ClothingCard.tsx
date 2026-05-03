import { Box, Typography, IconButton } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { ClothingItem, CATEGORY_SHORT, ClothingStyle } from '../types'
import { STYLE_LABELS } from '../constants/styleLabels'

interface Props {
  item: ClothingItem
  onDelete?: () => void
  onClick?: () => void
}

function getStyles(item: ClothingItem): ClothingStyle[] {
  if (Array.isArray(item.styles)) return item.styles
  if (item.style) return [item.style]

  return []
}

function getStylesText(item: ClothingItem): string {
  const styles = getStyles(item)

  if (!styles.length) return 'Без стиля'

  return styles
    .map(style => STYLE_LABELS[style])
    .join(' / ')
}

export default function ClothingCard({ item, onDelete, onClick }: Props) {
  const stylesText = getStylesText(item)

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
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          p: 1,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          bgcolor: item.color.hex,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: 4,
          left: 4,
          bgcolor: 'rgba(255,255,255,0.85)',
          px: 0.5,
          py: 0.25,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.55rem',
            fontWeight: 700,
          }}
        >
          {CATEGORY_SHORT[item.category]}
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: 28,
          left: 4,
          right: 4,
          bgcolor: 'rgba(0,0,0,0.78)',
          color: '#fff',
          px: 0.5,
          py: 0.25,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            fontSize: '0.48rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {stylesText}
        </Typography>
      </Box>

      {onDelete && (
        <IconButton
          className="delete-btn"
          size="small"
          onClick={e => {
            e.stopPropagation()
            onDelete()
          }}
          sx={{
            position: 'absolute',
            top: 2,
            right: 2,
            opacity: 0,
            transition: 'opacity 0.2s',
            bgcolor: 'rgba(255,255,255,0.9)',
            p: 0.3,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,1)',
            },
          }}
        >
          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
        </IconButton>
      )}
    </Box>
  )
}