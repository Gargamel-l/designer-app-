import { useEffect, useState } from 'react'
import { Box, Button, Dialog, DialogContent, DialogTitle } from '@mui/material'
import { v4 as uuidv4 } from 'uuid'
import { ClothingCategory, ClothingItem, ClothingStyle, ColorEntry } from '../../types'
import TypeSelector from './TypeSelector'
import PhotoCapture from './PhotoCapture'
import ColorAssign from './ColorAssign'
import StyleSelector from './StyleSelector'

type Step = 'type' | 'photo' | 'color' | 'style'

type Props = {
  open: boolean
  onClose: () => void
  onSave: (item: ClothingItem) => void
}

export default function UploadDialog({ open, onClose, onSave }: Props) {
  const [step, setStep] = useState<Step>('type')
  const [category, setCategory] = useState<ClothingCategory | null>(null)
  const [image, setImage] = useState<string>('')
  const [color, setColor] = useState<ColorEntry | null>(null)
  const [style, setStyle] = useState<ClothingStyle>('casual')

  const reset = () => {
    setStep('type')
    setCategory(null)
    setImage('')
    setColor(null)
    setStyle('casual')
  }

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open])

  const handleClose = () => {
    onClose()
    reset()
  }

  const handleCapture = (dataUrl: string, detectedColor: ColorEntry | null) => {
    setImage(dataUrl)
    setColor(detectedColor)
    setStep('color')
  }

  const handleSave = () => {
    if (!category || !image || !color) return

    onSave({
      id: uuidv4(),
      category,
      image,
      color,
      createdAt: Date.now(),
      style,
    })

    handleClose()
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          reset()
          setStep('type')
        }}
        sx={{
          minHeight: 46,
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 700,
          bgcolor: '#111',
        }}
      >
        Добавить вещь
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {step === 'type' && 'Категория'}
          {step === 'photo' && 'Фото'}
          {step === 'color' && 'Цвет'}
          {step === 'style' && 'Стиль'}
        </DialogTitle>

        <DialogContent>
          {step === 'type' && (
            <TypeSelector
              value={category}
              onChange={(value) => {
                setCategory(value)
                setStep('photo')
              }}
            />
          )}

          {step === 'photo' && category && (
            <PhotoCapture category={category} onCapture={handleCapture} />
          )}

          {step === 'color' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <ColorAssign value={color} onChange={(value) => setColor(value)} />

              <Button
                variant="contained"
                onClick={() => setStep('style')}
                disabled={!color}
                sx={{
                  minHeight: 46,
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 700,
                  bgcolor: '#111',
                }}
              >
                Далее
              </Button>
            </Box>
          )}

          {step === 'style' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <StyleSelector value={style} onChange={setStyle} />

              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  minHeight: 46,
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 700,
                  bgcolor: '#111',
                }}
              >
                Сохранить вещь
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}