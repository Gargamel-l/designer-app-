import { useState } from 'react'
import { Box, Button } from '@mui/material'
import { ClothingCategory, ColorEntry } from '../../types'

type PhotoCaptureProps = {
  category: ClothingCategory
  onCapture: (dataUrl: string, color: ColorEntry | null) => void
}

export default function PhotoCapture({ onCapture }: PhotoCaptureProps) {
  const [preview, setPreview] = useState<string>('')

  const [color] = useState<ColorEntry>({
    name: 'Черный',
    hex: '#000000',
    family: 'black',
  })

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = e => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    setPreview(dataUrl)
  }

  const handleUse = () => {
    if (!preview) return
    onCapture(preview, color)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Button
        component="label"
        variant="outlined"
        sx={{
          minHeight: 44,
          borderColor: '#111',
          color: '#111',
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 600,
        }}
      >
        Выбрать фото
        <input hidden type="file" accept="image/*" onChange={handleFileChange} />
      </Button>

      {preview ? (
        <Box
          component="img"
          src={preview}
          alt="preview"
          sx={{
            width: '100%',
            maxHeight: 260,
            objectFit: 'contain',
            borderRadius: '14px',
            bgcolor: '#f7f7f7',
            p: 1,
          }}
        />
      ) : null}

      <Button
        variant="contained"
        onClick={handleUse}
        disabled={!preview}
        sx={{
          minHeight: 46,
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 700,
          bgcolor: '#111',
        }}
      >
        Продолжить
      </Button>
    </Box>
  )
}