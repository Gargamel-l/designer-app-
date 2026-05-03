import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#000000' },
    secondary: { main: '#ffffff' },
    background: { default: '#f5f5f5', paper: '#ffffff' },
    text: { primary: '#000000', secondary: '#666666' },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: { fontWeight: 900, fontSize: '2rem', letterSpacing: '-0.02em', textTransform: 'uppercase' },
    h2: { fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.05em', textTransform: 'uppercase' },
    h3: { fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase' },
    body1: { fontWeight: 400, fontSize: '0.875rem' },
    body2: { fontWeight: 400, fontSize: '0.75rem', color: '#666' },
    caption: { fontWeight: 500, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  },
  shape: { borderRadius: 0 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 0, boxShadow: 'none' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: '0.1em',
          boxShadow: 'none',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderTop: '1px solid #e0e0e0',
          height: 64,
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 40,
          padding: '6px 0',
          color: '#999',
          '&.Mui-selected': { color: '#000' },
        },
        label: {
          fontSize: '0.6rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          '&.Mui-selected': { fontSize: '0.6rem' },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { borderRadius: 0 } },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 0 } },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 2 } },
    },
  },
})

export default theme
