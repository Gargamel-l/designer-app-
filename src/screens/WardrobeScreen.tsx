import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import ScreenHeader from '../components/ScreenHeader'
import ClothingCard from '../components/ClothingCard'
import ItemDetailDialog from '../components/ItemDetailDialog'
import { useApp } from '../AppContext'
import { ClothingItem } from '../types'

export default function WardrobeScreen() {
  const { items, removeItem, updateItem } = useApp()
  const [selected, setSelected] = useState<ClothingItem | null>(null)

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: 'background.paper' }}>
      <ScreenHeader
        title="ГАРДЕРОБ"
        right={
          <Typography variant="body2" sx={{ color: '#999', alignSelf: 'center' }}>
            {items.length} вещей
          </Typography>
        }
      />

      {items.length === 0 ? (
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
            Добавьте одежду
          </Typography>
        </Box>
      ) : (
        <Box sx={{ p: 1.5 }}>
          <Grid container spacing={1.5}>
            {items.map(item => (
              <Grid item xs={6} key={item.id}>
                <ClothingCard
                  item={item}
                  onClick={() => setSelected(item)}
                  onDelete={() => removeItem(item.id)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <ItemDetailDialog
        item={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onUpdate={updated => { updateItem(updated); setSelected(null) }}
        onDelete={id => { removeItem(id); setSelected(null) }}
      />
    </Box>
  )
}
