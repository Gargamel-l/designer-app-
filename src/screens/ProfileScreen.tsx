import {
  Box,
  Button,
  Typography,
} from '@mui/material'
import { AuthUser } from '../auth'

interface Props {
  user: AuthUser
  wardrobeCount: number
  outfitsCount: number
  favoriteOutfitsCount: number
  onLogout: () => void
}

export default function ProfileScreen({
  user,
  wardrobeCount,
  outfitsCount,
  favoriteOutfitsCount,
  onLogout,
}: Props) {
  function handleLogout() {
    if (confirm('Выйти из аккаунта?')) {
      onLogout()
    }
  }

  return (
    <Box sx={{ p: 2, pb: 10 }}>
      <Box
        sx={{
          borderBottom: '2px solid #000',
          pb: 1,
          mb: 3,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: '1.6rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.03em',
          }}
        >
          Мои данные
        </Typography>
      </Box>

      <Box
        sx={{
          border: '1px solid #e0e0e0',
          p: 2,
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: '0.7rem',
            color: '#888',
            fontWeight: 700,
            textTransform: 'uppercase',
            mb: 0.5,
          }}
        >
          Аккаунт
        </Typography>

        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 900,
            textTransform: 'uppercase',
          }}
        >
          {user.displayName}
        </Typography>

        <Typography
          sx={{
            fontSize: '0.75rem',
            color: '#777',
            fontWeight: 700,
            mt: 0.5,
          }}
        >
          Логин: {user.login}
        </Typography>
      </Box>

      <Box
        sx={{
          border: '1px solid #e0e0e0',
          p: 2,
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: '0.7rem',
            color: '#888',
            fontWeight: 700,
            textTransform: 'uppercase',
            mb: 1.5,
          }}
        >
          Статистика
        </Typography>

        <Box sx={{ display: 'grid', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
            Вещей в гардеробе: {wardrobeCount}
          </Typography>

          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
            Образов: {outfitsCount}
          </Typography>

          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
            Избранных образов: {favoriteOutfitsCount}
          </Typography>
        </Box>
      </Box>

      <Button
        fullWidth
        variant="outlined"
        onClick={handleLogout}
        sx={{
          height: 44,
          borderRadius: 0,
          borderColor: '#000',
          color: '#000',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          '&:hover': {
            borderColor: '#000',
            bgcolor: '#f5f5f5',
          },
        }}
      >
        Выйти из аккаунта
      </Button>
    </Box>
  )
}