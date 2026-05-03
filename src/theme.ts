import { createTheme } from '@mui/material/styles'

const APP_FONT =
  '"Inter", "Roboto", "Arial", sans-serif'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#000000' },
    secondary: { main: '#ffffff' },
    background: { default: '#f5f5f5', paper: '#ffffff' },
    text: { primary: '#000000', secondary: '#666666' },
  },

  typography: {
    fontFamily: APP_FONT,

    h1: {
      fontFamily: APP_FONT,
      fontWeight: 900,
      fontSize: '2rem',
      letterSpacing: '-0.02em',
      textTransform: 'uppercase',
      lineHeight: 1,
    },

    h2: {
      fontFamily: APP_FONT,
      fontWeight: 800,
      fontSize: '1.25rem',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      lineHeight: 1.15,
    },

    h3: {
      fontFamily: APP_FONT,
      fontWeight: 700,
      fontSize: '1rem',
      textTransform: 'uppercase',
      lineHeight: 1.2,
    },

    body1: {
      fontFamily: APP_FONT,
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.45,
    },

    body2: {
      fontFamily: APP_FONT,
      fontWeight: 500,
      fontSize: '0.75rem',
      lineHeight: 1.45,
      color: '#666',
    },

    caption: {
      fontFamily: APP_FONT,
      fontWeight: 600,
      fontSize: '0.65rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      lineHeight: 1.3,
    },

    button: {
      fontFamily: APP_FONT,
      fontWeight: 800,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
  },

  shape: { borderRadius: 0 },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontFamily: APP_FONT,
        },
        body: {
          fontFamily: APP_FONT,
          fontStyle: 'normal',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '*': {
          boxSizing: 'border-box',
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: APP_FONT,
          fontStyle: 'normal',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'uppercase',
          fontWeight: 800,
          letterSpacing: '0.08em',
          boxShadow: 'none',
          fontFamily: APP_FONT,
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
          fontFamily: APP_FONT,
          '&.Mui-selected': { color: '#000' },
        },
        label: {
          fontFamily: APP_FONT,
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          '&.Mui-selected': { fontSize: '0.6rem' },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 0 },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 0 },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          fontFamily: APP_FONT,
          fontWeight: 600,
        },
      },
    },
  },
})

export default theme