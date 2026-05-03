import { Box, Typography } from '@mui/material'
import { ColorEntry, ColorFamily } from '../../types'
import { FAMILY_LABELS, PALETTE_BY_FAMILY } from '../../data/colors'

type Props =
  | {
      value: ColorEntry | null
      onChange: (value: ColorEntry) => void
      image?: never
      onSave?: never
    }
  | {
      image?: string
      onSave: (value: ColorEntry) => void
      value?: never
      onChange?: never
    }

const FAMILIES: ColorFamily[] = [
  'black',
  'white',
  'gray',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'brown',
  'beige',
]

export default function ColorAssign(props: Props) {
  const currentValue = 'value' in props ? props.value : null

  const handleSelect = (color: ColorEntry) => {
    if ('onChange' in props && props.onChange) {
      props.onChange(color)
      return
    }

    if ('onSave' in props && props.onSave) {
      props.onSave(color)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {FAMILIES.map((family) => {
        const colors = PALETTE_BY_FAMILY[family]
        if (!colors.length) return null

        return (
          <Box key={family}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>
              {FAMILY_LABELS[family]}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {colors.map((color) => {
                const selected = currentValue?.hex === color.hex

                return (
                  <Box
                    key={color.hex}
                    onClick={() => handleSelect(color)}
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: '10px',
                      bgcolor: color.hex,
                      cursor: 'pointer',
                      border: selected ? '3px solid #111' : '1px solid #ccc',
                      boxSizing: 'border-box',
                    }}
                    title={color.name}
                  />
                )
              })}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}