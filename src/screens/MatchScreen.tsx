import { useMemo, useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import EmptyState from '../components/common/EmptyState'
import PageHeader from '../components/common/PageHeader'
import OutfitComposite from '../components/OutfitComposite'
import { useAppContext } from '../AppContext'
import { ClothingItem } from '../types'
import { generateOutfits } from '../utils/outfitGenerator'

const TOP_CATEGORIES = ['tshirt', 'longsleeve', 'tanktop'] as const
const BOTTOM_CATEGORIES = ['pants', 'shorts'] as const

export default function MatchScreen() {
  const { wardrobe, saveOutfit } = useAppContext()
  const generated = useMemo(() => generateOutfits(wardrobe), [wardrobe])
  const [index, setIndex] = useState(0)

  const resolved = useMemo(
    () =>
      generated.map(outfit => ({
        outfit,
        items: outfit.itemIds
          .map(id => wardrobe.find((item: ClothingItem) => item.id === id))
          .filter(Boolean) as ClothingItem[],
      })),
    [generated, wardrobe],
  )

  const current = resolved[index]

  const hasTop = wardrobe.some((item: ClothingItem) =>
    TOP_CATEGORIES.includes(item.category as (typeof TOP_CATEGORIES)[number]),
  )
  const hasBottom = wardrobe.some((item: ClothingItem) =>
    BOTTOM_CATEGORIES.includes(item.category as (typeof BOTTOM_CATEGORIES)[number]),
  )

  if (!hasTop || !hasBottom) {
    return (
      <Box sx={{ pb: 3 }}>
        <PageHeader title="Подобрать" />
        <EmptyState text="Нужна хотя бы одна верхняя вещь и одни брюки/шорты" />
      </Box>
    )
  }

  if (!resolved.length) {
    return (
      <Box sx={{ pb: 3 }}>
        <PageHeader title="Подобрать" />
        <EmptyState text="Не удалось подобрать совместимые образы по стилю. Попробуйте добавить больше вещей или изменить стили одежды." />
      </Box>
    )
  }

  const goNext = () => {
    setIndex(prev => (prev >= resolved.length - 1 ? 0 : prev + 1))
  }

  const onLike = () => {
    if (!current) return
    saveOutfit({
      ...current.outfit,
      tags: current.outfit.tags ?? [],
    })
    goNext()
  }

  const onDislike = () => {
    goNext()
  }

  return (
    <Box sx={{ pb: 3 }}>
      <PageHeader title="Подобрать" />

      <Box sx={{ px: 1.5 }}>
        <Box
          sx={{
            position: 'relative',
            borderRadius: '18px',
            bgcolor: '#f7f7f7',
            minHeight: 520,
            overflow: 'hidden',
            p: 1.5,
          }}
        >
          <OutfitComposite items={current.items} height={430} />

          <Typography
            sx={{
              mt: 1,
              fontSize: 13,
              color: '#6b6b6b',
              textAlign: 'center',
            }}
          >
            Образ {index + 1} из {resolved.length}
          </Typography>

          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              right: 12,
              display: 'flex',
              justifyContent: 'space-between',
              zIndex: 20,
            }}
          >
            <IconButton
              onClick={onDislike}
              sx={{
                width: 56,
                height: 56,
                bgcolor: '#fff',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              }}
            >
              <ThumbDownAltOutlinedIcon />
            </IconButton>

            <IconButton
              onClick={onLike}
              sx={{
                width: 56,
                height: 56,
                bgcolor: '#fff',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              }}
            >
              <ThumbUpAltOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}