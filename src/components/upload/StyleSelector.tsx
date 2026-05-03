import { Box, Chip, Typography } from '@mui/material'
import { ClothingStyle } from '../../types'
import { STYLE_LABELS, STYLE_OPTIONS } from '../../constants/styleLabels'

type StyleSelectorProps = {
  value: ClothingStyle
  onChange: (style: ClothingStyle) => void
}

export default function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 700,
          color: '#111',
          mb: 1.5,
        }}
      >
        Стиль
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {STYLE_OPTIONS.map(style => {
          const selected = value === style

          return (
            <Chip
              key={style}
              label={STYLE_LABELS[style]}
              clickable
              onClick={() => onChange(style)}
              sx={{
                borderRadius: '10px',
                fontWeight: 600,
                bgcolor: selected ? '#111' : '#f2f2f2',
                color: selected ? '#fff' : '#111',
              }}
            />
          )
        })}
      </Box>
    </Box>
  )
}