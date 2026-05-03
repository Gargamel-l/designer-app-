import { useMemo, useState } from 'react'
import { Box, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import EmptyState from '../components/common/EmptyState'
import PageHeader from '../components/common/PageHeader'
import OutfitComposite from '../components/OutfitComposite'
import OutfitTagsEditor from '../components/common/outfits/OutfitTagsEditor'
import { useAppContext } from '../AppContext'
import { ClothingItem, Outfit, OutfitTag } from '../types'
import { OUTFIT_TAG_LABELS } from '../constants/styleLabels'

type ResolvedOutfit = Outfit & {
  items: ClothingItem[]
  tags: OutfitTag[]
}

export default function OutfitsScreen() {
  const { outfits, wardrobe, removeOutfit, updateOutfitTags, toggleFavorite } = useAppContext()
  const [selected, setSelected] = useState<ResolvedOutfit | null>(null)

  const resolvedOutfits = useMemo<ResolvedOutfit[]>(() => {
    return outfits.map((outfit: Outfit) => ({
      ...outfit,
      tags: outfit.tags ?? [],
      items: outfit.itemIds
        .map((id: string) => wardrobe.find((item: ClothingItem) => item.id === id))
        .filter(Boolean) as ClothingItem[],
    }))
  }, [outfits, wardrobe])

  if (!resolvedOutfits.length) {
    return (
      <Box sx={{ pb: 3 }}>
        <PageHeader title="Образы" />
        <EmptyState text="Составьте образы" />
      </Box>
    )
  }

  return (
    <Box sx={{ pb: 3 }}>
      <PageHeader title="Образы" />

      <Box sx={{ px: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {resolvedOutfits.map((outfit: ResolvedOutfit) => (
          <Box
            key={outfit.id}
            sx={{
              position: 'relative',
              borderRadius: '16px',
              bgcolor: '#f7f7f7',
              overflow: 'hidden',
              p: 1.5,
            }}
          >
            <OutfitComposite items={outfit.items} height={340} />

            <Box
              sx={{
                mt: 1,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              {outfit.tags.map((tag: OutfitTag) => (
                <Box
                  key={tag}
                  sx={{
                    px: 1.25,
                    py: 0.5,
                    borderRadius: '999px',
                    bgcolor: '#111',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {OUTFIT_TAG_LABELS[tag]}
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 1.5,
                zIndex: 20,
                position: 'relative',
              }}
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton onClick={() => toggleFavorite(outfit.id)}>
                  {outfit.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>

                <IconButton onClick={() => setSelected(outfit)}>
                  <LocalOfferOutlinedIcon />
                </IconButton>
              </Box>

              <IconButton onClick={() => removeOutfit(outfit.id)}>
                <DeleteOutlineIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
        <DialogTitle>Теги образа</DialogTitle>
        <DialogContent>
          {selected ? (
            <OutfitTagsEditor
              value={selected.tags}
              onChange={(tags) => updateOutfitTags(selected.id, tags)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </Box>
  )
}