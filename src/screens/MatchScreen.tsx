import { useState, useMemo } from 'react'
import { Box, Typography, IconButton, Button } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CloseIcon from '@mui/icons-material/Close'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ScreenHeader from '../components/ScreenHeader'
import OutfitComposite from '../components/OutfitComposite'
import { useApp } from '../AppContext'
import { generateOutfits } from '../utils/outfitGenerator'
import { Outfit } from '../types'

export default function MatchScreen() {
  const { items, outfits, saveOutfit } = useApp()
  const [index, setIndex] = useState(0)
  const [generated, setGenerated] = useState<Outfit[]>([])
  const [started, setStarted] = useState(false)

  const existingIds = useMemo(() => new Set(outfits.map(o => o.id)), [outfits])

  function handleGenerate() {
    const suggestions = generateOutfits(items, existingIds)
    setGenerated(suggestions)
    setIndex(0)
    setStarted(true)
  }

  function handleLike() {
    const outfit = generated[index]
    if (outfit) saveOutfit({ ...outfit, isFavorite: true })
    setIndex(i => i + 1)
  }

  function handleSkip() { setIndex(i => i + 1) }

  const current = generated[index]
  const currentItems = current
    ? current.itemIds.map(id => items.find(i => i.id === id)!).filter(Boolean)
    : []

  const hasEnoughItems =
    items.some(i => ['tshirt', 'longsleeve', 'tanktop', 'jacket'].includes(i.category)) &&
    items.some(i => ['pants', 'shorts'].includes(i.category))

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: 'background.paper' }}>
      <ScreenHeader title="ПОДОБРАТЬ" />
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {!hasEnoughItems ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography
            variant="body1"
            sx={{
              color: '#777',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              maxWidth: 320,
              mx: 'auto',
            }}
          >
            Нужна хотя бы одна верхняя вещь и одни брюки/шорты
          </Typography>
          </Box>
        ) : !started ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <AutoAwesomeIcon sx={{ fontSize: 48, mb: 2, color: '#ccc' }} />
            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              Нажмите кнопку, чтобы подобрать образы из вашего гардероба
            </Typography>
            <Button variant="contained" onClick={handleGenerate}
              sx={{ bgcolor: '#000', color: '#fff', fontWeight: 700, px: 4, py: 1.5 }}>
              ПОДОБРАТЬ ОБРАЗЫ
            </Button>
          </Box>
        ) : !current ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>Образы закончились</Typography>
            <Button variant="outlined" onClick={handleGenerate}
              sx={{ borderColor: '#000', color: '#000', fontWeight: 700 }}>
              ПОВТОРИТЬ
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ position: 'relative', bgcolor: '#e8e8e8' }}>
              <OutfitComposite items={currentItems} size="large" />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  left: 8,
                  right: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  zIndex: 20,
                  pointerEvents: 'auto',
                }}
              >
                <IconButton onClick={handleLike}
                  sx={{ bgcolor: 'rgba(255,255,255,0.9)', border: '1px solid #e0e0e0', '&:hover': { bgcolor: '#fff' } }}>
                  <FavoriteIcon sx={{ color: '#e53935', fontSize: 28 }} />
                </IconButton>
                <IconButton onClick={handleSkip}
                  sx={{ bgcolor: 'rgba(255,255,255,0.9)', border: '1px solid #e0e0e0', '&:hover': { bgcolor: '#fff' } }}>
                  <CloseIcon sx={{ fontSize: 28 }} />
                </IconButton>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ textAlign: 'center', color: '#999' }}>
              {index + 1} / {generated.length}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  )
}
