import { Box, Typography, Button, Divider } from '@mui/material'
import ScreenHeader from '../components/ScreenHeader'
import { useApp } from '../AppContext'

export default function ProfileScreen() {
  const { items, outfits, favoriteOutfits } = useApp()

  const stats = [
    { label: 'Вещей в гардеробе', value: items.length },
    { label: 'Сохранённых образов', value: favoriteOutfits.length },
    { label: 'Всего образов', value: outfits.length },
  ]

  function handleClearWardrobe() {
    if (confirm('Удалить весь гардероб?')) { localStorage.removeItem('wardrobe_v1'); window.location.reload() }
  }

  function handleClearOutfits() {
    if (confirm('Удалить все образы?')) { localStorage.removeItem('outfits_v1'); window.location.reload() }
  }

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: 'background.paper' }}>
      <ScreenHeader title="МОИ ДАННЫЕ" />
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          {stats.map((s, i) => (
            <Box key={s.label}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
                <Typography variant="body2" sx={{ color: '#444' }}>{s.label}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{s.value}</Typography>
              </Box>
              {i < stats.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
        <Divider sx={{ my: 1 }} />
        <Typography variant="caption" sx={{ color: '#999' }}>Данные хранятся локально на устройстве</Typography>
        <Button variant="outlined" fullWidth onClick={handleClearWardrobe}
          sx={{ borderColor: '#e53935', color: '#e53935', fontWeight: 700, mt: 2 }}>
          Очистить гардероб
        </Button>
        <Button variant="outlined" fullWidth onClick={handleClearOutfits}
          sx={{ borderColor: '#e53935', color: '#e53935', fontWeight: 700 }}>
          Очистить образы
        </Button>
      </Box>
    </Box>
  )
}
