import { useState } from 'react'
import { Dialog, Box, Typography, IconButton, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import {
  ClothingItem,
  ClothingStyle,
  ColorEntry,
  CATEGORY_SHORT,
} from '../types'
import ColorAssign from './upload/ColorAssign'
import StyleSelector from './upload/StyleSelector'
import { STYLE_LABELS } from '../constants/styleLabels'

interface Props {
  item: ClothingItem | null
  open: boolean
  onClose: () => void
  onUpdate: (item: ClothingItem) => void
  onDelete: (id: string) => void
}

function getStyles(item: ClothingItem): ClothingStyle[] {
  if (Array.isArray(item.styles)) return item.styles
  if (item.style) return [item.style]

  return []
}

function getStylesText(styles: ClothingStyle[]): string {
  if (!styles.length) return 'Без стиля'

  return styles.map(style => STYLE_LABELS[style]).join(', ')
}

export default function ItemDetailDialog({
  item,
  open,
  onClose,
  onUpdate,
  onDelete,
}: Props) {
  const [colorMode, setColorMode] = useState(false)

  if (!item) return null

  const itemStyles = getStyles(item)

  function handleColorSave(color: ColorEntry) {
    onUpdate({ ...item!, color })
    setColorMode(false)
    onClose()
  }

  function handleStylesChange(styles: ClothingStyle[]) {
    onUpdate({
      ...item!,
      styles,
    })
  }

  function handleDelete() {
    if (confirm('Удалить элемент из гардероба?')) {
      onDelete(item!.id)
      onClose()
    }
  }

  function handleClose() {
    setColorMode(false)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          m: 1,
          width: 'calc(100% - 16px)',
          maxHeight: '95vh',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Typography variant="h2" sx={{ fontSize: '1rem' }}>
          {CATEGORY_SHORT[item.category]}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button
            variant={colorMode ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setColorMode(v => !v)}
            sx={{
              fontWeight: 700,
              fontSize: '0.7rem',
              px: 1.5,
              py: 0.5,
              borderColor: '#000',
              color: colorMode ? '#fff' : '#000',
              bgcolor: colorMode ? '#000' : 'transparent',
              '&:hover': {
                bgcolor: colorMode ? '#333' : '#f5f5f5',
                borderColor: '#000',
              },
            }}
          >
            ЦВЕТ
          </Button>

          <IconButton size="small" onClick={handleDelete} sx={{ color: '#e53935' }}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>

          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ overflowY: 'auto' }}>
        {colorMode ? (
          <ColorAssign image={item.image} onSave={handleColorSave} />
        ) : (
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                width: '100%',
                paddingBottom: '100%',
                position: 'relative',
                bgcolor: '#e8e8e8',
                mb: 2,
              }}
            >
              <Box
                component="img"
                src={item.image}
                alt={item.category}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  p: 2,
                }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                border: '1px solid #e0e0e0',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: item.color.hex,
                  flexShrink: 0,
                  border: '1px solid #ccc',
                }}
              />

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {item.color.name}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#999',
                    fontFamily: 'monospace',
                    fontSize: '0.7rem',
                  }}
                >
                  {item.color.hex}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <StyleSelector
                value={itemStyles}
                onChange={handleStylesChange}
                label="Стиль / категория образа"
              />

              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: '#999',
                  fontSize: '0.7rem',
                }}
              >
                Сейчас выбрано: {getStylesText(itemStyles)}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{
                mt: 2,
                color: '#888',
                textAlign: 'center',
              }}
            >
              Нажмите ЦВЕТ чтобы изменить цвет элемента
            </Typography>
          </Box>
        )}
      </Box>
    </Dialog>
  )
}