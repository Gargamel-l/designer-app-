import { useRef, useState, useCallback } from 'react'
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'
import { ClothingCategory, ColorEntry, CATEGORY_SHORT } from '../../types'
import { removeBackground } from '@imgly/background-removal'
import { detectDominantColor } from '../../utils/colorDetection'

interface Props {
  category: ClothingCategory
  onCapture: (dataUrl: string, detectedColor: ColorEntry | null) => void
}

export default function PhotoCapture({ category, onCapture }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('Удаление фона…')

  const processImage = useCallback(async (file: File) => {
    setError(null)
    setProcessing(true)
    setStatus('Удаление фона…')
    try {
      const raw = await new Promise<string>((res, rej) => {
        const reader = new FileReader()
        reader.onload = e => res(e.target!.result as string)
        reader.onerror = rej
        reader.readAsDataURL(file)
      })
      setPreview(raw)

      const blob = await removeBackground(file, {
        model: 'isnet_quint8',
        output: { format: 'image/png', quality: 0.9 },
      })

      const dataUrl = await new Promise<string>((res, rej) => {
        const reader = new FileReader()
        reader.onload = e => res(e.target!.result as string)
        reader.onerror = rej
        reader.readAsDataURL(blob)
      })

      setStatus('Определение цвета…')
      const detectedColor = await detectDominantColor(dataUrl)

      onCapture(dataUrl, detectedColor)
    } catch (err) {
      console.error(err)
      setError('Не удалось обработать изображение. Попробуйте ещё раз.')
      setProcessing(false)
      setPreview(null)
    }
  }, [onCapture])

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processImage(file)
    e.target.value = ''
  }, [processImage])

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h3" sx={{ textAlign: 'center' }}>
        {CATEGORY_SHORT[category]}
      </Typography>

      <Box sx={{ position: 'relative', width: '100%', paddingBottom: '100%', bgcolor: '#d0d0d0', overflow: 'hidden' }}>
        {preview ? (
          <Box
            component="img"
            src={preview}
            alt="preview"
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CameraAltOutlinedIcon sx={{ fontSize: 64, color: '#888' }} />
          </Box>
        )}
        {processing && (
          <Box sx={{
            position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
          }}>
            <CircularProgress sx={{ color: '#fff' }} size={36} />
            <Typography sx={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>{status}</Typography>
          </Box>
        )}
      </Box>

      {error && (
        <Typography sx={{ color: 'error.main', fontSize: '0.8rem', textAlign: 'center' }}>{error}</Typography>
      )}

      <Typography variant="body2" sx={{ textAlign: 'center', color: '#666' }}>
        Подгоните элемент под рамку и сделайте фото
      </Typography>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined" fullWidth disabled={processing} onClick={() => cameraRef.current?.click()}
          sx={{ borderColor: '#000', color: '#000', fontWeight: 700 }}>
          Камера
        </Button>
        <Button variant="contained" fullWidth disabled={processing} onClick={() => fileRef.current?.click()}
          sx={{ bgcolor: '#000', color: '#fff', fontWeight: 700 }}>
          Из галереи
        </Button>
      </Box>

      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFile} />
    </Box>
  )
}
