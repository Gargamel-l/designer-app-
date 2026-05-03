import { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material'

interface Props {
  error: string | null
  onLogin: (login: string, password: string) => boolean
}

export default function AuthScreen({ error, onLogin }: Props) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    onLogin(login, password)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        px: 3,
        py: 4,
      }}
    >
      <Box
        sx={{
          borderBottom: '2px solid #000',
          pb: 1.5,
          mb: 4,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: '1.8rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.03em',
          }}
        >
          Вход
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <TextField
          label="Логин"
          value={login}
          onChange={event => setLogin(event.target.value)}
          autoComplete="username"
          fullWidth
          size="small"
          InputProps={{
            sx: {
              borderRadius: 0,
              fontWeight: 700,
            },
          }}
        />

        <TextField
          label="Пароль"
          value={password}
          onChange={event => setPassword(event.target.value)}
          autoComplete="current-password"
          type="password"
          fullWidth
          size="small"
          InputProps={{
            sx: {
              borderRadius: 0,
              fontWeight: 700,
            },
          }}
        />

        {error && (
          <Typography
            sx={{
              color: '#e53935',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 1,
            height: 46,
            bgcolor: '#000',
            color: '#fff',
            borderRadius: 0,
            boxShadow: 'none',
            fontWeight: 900,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            '&:hover': {
              bgcolor: '#222',
              boxShadow: 'none',
            },
          }}
        >
          Войти
        </Button>
      </Box>

      <Box
        sx={{
          mt: 'auto',
          pt: 4,
          color: '#777',
        }}
      >
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            mb: 0.5,
          }}
        >
          Тестовые аккаунты:
        </Typography>

        <Typography sx={{ fontSize: '0.72rem' }}>
          root / root
        </Typography>

        <Typography sx={{ fontSize: '0.72rem' }}>
          user / user123
        </Typography>
      </Box>
    </Box>
  )
}