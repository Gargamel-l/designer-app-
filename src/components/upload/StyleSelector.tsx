import {
  Box,
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { ClothingStyle } from '../../types'
import { STYLE_LABELS, STYLE_OPTIONS } from '../../constants/styleLabels'

type StyleSelectorProps = {
  value: ClothingStyle[]
  onChange: (styles: ClothingStyle[]) => void
  label?: string
  helperText?: string
}

export default function StyleSelector({
  value,
  onChange,
  label = 'Стиль одежды',
  helperText = 'Если стиль не выбран, вещь считается универсальной и подходит ко всем стилям.',
}: StyleSelectorProps) {
  const selected = Array.isArray(value) ? value : []

  return (
    <Box>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 800,
          color: '#111',
          mb: 1,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </Typography>

      <FormControl fullWidth size="small">
        <Select
          multiple
          value={selected}
          displayEmpty
          renderValue={(selectedValues) => {
            const selectedStyles = selectedValues as ClothingStyle[]

            if (!selectedStyles.length) {
              return (
                <Typography
                  component="span"
                  sx={{
                    color: '#777',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                  }}
                >
                  Без стиля
                </Typography>
              )
            }

            return (
              <Typography
                component="span"
                sx={{
                  color: '#111',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                }}
              >
                {selectedStyles
                  .map(style => STYLE_LABELS[style])
                  .join(', ')}
              </Typography>
            )
          }}
          onChange={(event) => {
            const nextValue = event.target.value

            const nextStyles =
              typeof nextValue === 'string'
                ? nextValue.split(',').filter(Boolean) as ClothingStyle[]
                : nextValue as ClothingStyle[]

            onChange(nextStyles)
          }}
          sx={{
            borderRadius: 0,
            fontWeight: 700,
            bgcolor: '#fff',
            '& .MuiSelect-select': {
              minHeight: '20px',
              py: 1.1,
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          {STYLE_OPTIONS.map(style => (
            <MenuItem key={style} value={style}>
              <Checkbox
                checked={selected.includes(style)}
                sx={{
                  p: 0.5,
                  mr: 1,
                }}
              />
              <ListItemText
                primary={STYLE_LABELS[style]}
                primaryTypographyProps={{
                  sx: {
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  },
                }}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography
        variant="body2"
        sx={{
          mt: 1,
          color: '#888',
          fontSize: '0.7rem',
          lineHeight: 1.35,
        }}
      >
        {helperText}
      </Typography>
    </Box>
  )
}