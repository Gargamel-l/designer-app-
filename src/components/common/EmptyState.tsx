import { Box, Typography } from '@mui/material'
import { ReactNode } from 'react'

type EmptyStateProps = {
  title?: string
  text: string
  action?: ReactNode
}

export default function EmptyState({ title, text, action }: EmptyStateProps) {
  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        textAlign: 'center',
      }}
    >
      {title ? (
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            mb: 2,
            color: '#111',
          }}
        >
          {title}
        </Typography>
      ) : null}

      <Typography
        sx={{
          fontSize: 14,
          lineHeight: 1.6,
          color: '#6b6b6b',
          maxWidth: 300,
          mb: action ? 3 : 0,
        }}
      >
        {text}
      </Typography>

      {action}
    </Box>
  )
}