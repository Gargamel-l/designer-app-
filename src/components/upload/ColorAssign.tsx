import { useState } from 'react'
import { Box, Typography, Button, Tooltip } from '@mui/material'
import { ColorEntry, ColorFamily } from '../../types'
import { PALETTE_BY_FAMILY, FAMILY_LABELS } from '../../data/colors'

interface Props {
  image: string
  initialColor?: ColorEntry | null
  onSave: (color: ColorEntry) => void
}

const FAMILIES: ColorFamily[] = ['blue', 'gray', 'red', 'yellow', 'green']

export default function ColorAssign({ image, initialColor, onSave }: Props) {
  const [selected, setSelected] = useState<ColorEntry | null>(initialColor ?? null)

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ width: '100%', paddingBottom: '80%', position: 'relative', bgcolor: '#e8e8e8', overflow: 'hidden' }}>
        <Box
          component="img"
          src={image}
          alt="item"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', p: 1 }}
        />
      </Box>

      <Box>
        {FAMILIES.map(family => (
          <Box key={family} sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>
              {FAMILY_LABELS[family]}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {PALETTE_BY_FAMILY[family].map(color => (
                <Tooltip key={color.hex} title={color.name} arrow placement="top">
                  <Box
                    onClick={() => setSelected(color)}
                    sx={{
                      width: 24, height: 24, bgcolor: color.hex, cursor: 'pointer',
                      border: selected?.hex === color.hex ? '2.5px solid #000' : '1.5px solid rgba(0,0,0,0.1)',
                      transition: 'transform 0.1s',
                      '&:hover': { transform: 'scale(1.2)', zIndex: 1 },
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {selected && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, border: '1px solid #e0e0e0' }}>
          <Box sx={{ width: 32, height: 32, bgcolor: selected.hex, flexShrink: 0, border: '1px solid #ccc' }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{selected.name}</Typography>
            <Typography variant="body2" sx={{ color: '#999', fontFamily: 'monospace', fontSize: '0.7rem' }}>{selected.hex}</Typography>
          </Box>
          {initialColor && selected.hex === initialColor.hex && (
            <Typography sx={{ fontSize: '0.6rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
              Авто
            </Typography>
          )}
        </Box>
      )}

      <Button
        variant="contained"
        fullWidth
        disabled={!selected}
        onClick={() => selected && onSave(selected)}
        sx={{
          bgcolor: '#000', color: '#fff', fontWeight: 700, py: 1.5, fontSize: '0.85rem', letterSpacing: '0.1em',
          '&:disabled': { bgcolor: '#ccc', color: '#888' },
        }}
      >
        СОХРАНИТЬ РЕЗУЛЬТАТ
      </Button>
    </Box>
  )
}
