import { useState } from 'react'
import { Dialog, Box, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { v4 as uuidv4 } from 'uuid'
import {
  ClothingCategory,
  ClothingItem,
  ClothingStyle,
  ColorEntry,
} from '../../types'
import TypeSelector from './TypeSelector'
import PhotoCapture from './PhotoCapture'
import ColorAssign from './ColorAssign'
import StyleSelector from './StyleSelector'

type Step = 'type' | 'photo' | 'color'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (item: ClothingItem) => void
}

export default function UploadDialog({ open, onClose, onSave }: Props) {
  const [step, setStep] = useState<Step>('type')
  const [category, setCategory] = useState<ClothingCategory | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [detectedColor, setDetectedColor] = useState<ColorEntry | null>(null)

  // Пустой массив = без стиля = универсальная вещь.
  const [styles, setStyles] = useState<ClothingStyle[]>([])

  function resetState() {
    setStep('type')
    setCategory(null)
    setImage(null)
    setDetectedColor(null)
    setStyles([])
  }

  function handleClose() {
    onClose()
    resetState()
  }

  function handleTypeSelect(cat: ClothingCategory) {
    setCategory(cat)
    setStep('photo')
  }

  function handleCapture(dataUrl: string, color: ColorEntry | null) {
    setImage(dataUrl)
    setDetectedColor(color)
    setStep('color')
  }

  function handleSave(color: ColorEntry) {
    if (!category || !image) return

    onSave({
      id: uuidv4(),
      category,
      image,
      color,
      styles,
      createdAt: Date.now(),
    })

    handleClose()
  }

  function handleBack() {
    if (step === 'photo') {
      setStep('type')
      setCategory(null)
    }

    if (step === 'color') {
      setStep('photo')
      setImage(null)
      setDetectedColor(null)
    }
  }

  const stepTitles: Record<Step, string> = {
    type: 'ШАГ 1 — Тип одежды',
    photo: 'ШАГ 2 — Фотография',
    color: 'ШАГ 3 — Цвет и стиль',
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
          py: 1.5,
          px: 2,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {step !== 'type' && (
            <IconButton size="small" onClick={handleBack} sx={{ p: 0.5 }}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          )}

          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {stepTitles[step]}
          </Typography>
        </Box>

        <IconButton size="small" onClick={handleClose} sx={{ p: 0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ overflowY: 'auto' }}>
        {step === 'type' && (
          <TypeSelector onSelect={handleTypeSelect} />
        )}

        {step === 'photo' && category && (
          <PhotoCapture category={category} onCapture={handleCapture} />
        )}

        {step === 'color' && image && (
          <Box>
            <ColorAssign
              image={image}
              initialColor={detectedColor}
              onSave={handleSave}
            />

            <Box
              sx={{
                px: 2,
                pb: 2,
                pt: 1,
                borderTop: '1px solid #e0e0e0',
              }}
            >
              <StyleSelector
                value={styles}
                onChange={setStyles}
                label="Стиль одежды"
              />
            </Box>
          </Box>
        )}
      </Box>
    </Dialog>
  )
}