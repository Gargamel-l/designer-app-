import { Box, Typography, IconButton, Grid } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ScreenHeader from '../components/ScreenHeader'
import OutfitComposite from '../components/OutfitComposite'
import { useApp } from '../AppContext'

export default function OutfitsScreen() {
  const { favoriteOutfits, items, toggleFavorite, removeOutfit } = useApp()
  const getItems = (ids: string[]) => ids.map(id => items.find(i => i.id === id)!).filter(Boolean)

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: 'background.paper' }}>
      <ScreenHeader title="ОБРАЗЫ" />
      {favoriteOutfits.length === 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <Typography
            variant="body1"
            sx={{
              color: '#777',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Составьте образы
          </Typography>
        </Box>
      ) : (
        <Box sx={{ p: 1.5 }}>
          <Grid container spacing={1.5}>
            {favoriteOutfits.map(outfit => {
              const outfitItems = getItems(outfit.itemIds)
              if (outfitItems.length === 0) return null
              return (
                <Grid item xs={6} key={outfit.id}>
                  <Box sx={{ position: 'relative', bgcolor: '#e8e8e8' }}>
                    <OutfitComposite items={outfitItems} />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 4,
                        left: 4,
                        right: 4,
                        display: 'flex',
                        justifyContent: 'space-between',
                        zIndex: 20,
                        pointerEvents: 'auto',
                      }}
                    >
                      <IconButton size="small" onClick={() => toggleFavorite(outfit.id)}
                        sx={{ p: 0.5, bgcolor: 'rgba(255,255,255,0.85)' }}>
                        {outfit.isFavorite
                          ? <FavoriteIcon sx={{ fontSize: 18, color: '#e53935' }} />
                          : <FavoriteBorderIcon sx={{ fontSize: 18 }} />}
                      </IconButton>
                      <IconButton size="small" onClick={() => removeOutfit(outfit.id)}
                        sx={{ p: 0.5, bgcolor: 'rgba(255,255,255,0.85)' }}>
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </Box>
      )}
    </Box>
  )
}
