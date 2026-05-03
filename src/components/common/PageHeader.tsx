import { Box, Typography } from '@mui/material'

type PageHeaderProps = {
  title: string
}

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <Box sx={{ px: 1.5, pt: 1.5, mb: 2 }}>
      <Typography
        sx={{
          fontSize: 26,
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.01em',
          color: '#111',
          lineHeight: 1,
          mb: 1.5,
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          width: '100%',
          height: '2px',
          bgcolor: '#111',
        }}
      />
    </Box>
  )
}