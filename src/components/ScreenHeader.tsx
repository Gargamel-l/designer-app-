import { Box, Typography } from '@mui/material'

interface Props {
  title: string
  right?: React.ReactNode
}

export default function ScreenHeader({ title, right }: Props) {
  return (
    <Box sx={{ px: 2, pt: 2.5, pb: 0, bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h1" sx={{ fontSize: { xs: '1.75rem', sm: '2rem' } }}>
          {title}
        </Typography>
        {right}
      </Box>
      <Box sx={{ borderBottom: '2px solid #000', mb: 0 }} />
    </Box>
  )
}
