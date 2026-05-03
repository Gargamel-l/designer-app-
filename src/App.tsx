import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import { ThemeProvider, CssBaseline } from '@mui/material'

import HangerIcon from '@mui/icons-material/Checkroom'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'

import theme from './theme'
import { AppProvider, useApp } from './AppContext'
import OutfitsScreen from './screens/OutfitsScreen'
import WardrobeScreen from './screens/WardrobeScreen'
import MatchScreen from './screens/MatchScreen'
import ProfileScreen from './screens/ProfileScreen'
import UploadDialog from './components/upload/UploadDialog'

function AppShell() {
  const { tab, setTab, uploadOpen, setUploadOpen, addItem } = useApp()

  function handleNavChange(_: unknown, val: string) {
    if (val === 'upload') {
      setUploadOpen(true)
    } else {
      setTab(val as any)
    }
  }

  const screens: Record<string, JSX.Element> = {
    outfits: <OutfitsScreen />,
    wardrobe: <WardrobeScreen />,
    match: <MatchScreen />,
    profile: <ProfileScreen />,
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        maxWidth: 480,
        mx: 'auto',
        bgcolor: 'background.paper',
        boxShadow: '0 0 40px rgba(0,0,0,0.08)',
      }}
    >
      {screens[tab] ?? <OutfitsScreen />}

      <BottomNavigation
        value={tab}
        onChange={handleNavChange}
        sx={{ flexShrink: 0, zIndex: 10 }}
      >
        <BottomNavigationAction value="wardrobe" label="Гардероб" icon={<HangerIcon />} />
        <BottomNavigationAction value="outfits" label="Образы" icon={<FavoriteBorderIcon />} />
        <BottomNavigationAction
          value="upload"
          label="Загрузить"
          icon={
            <Box
              sx={{
                bgcolor: '#000',
                color: '#fff',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 0.5,
              }}
            >
              <AddBoxOutlinedIcon sx={{ fontSize: 24, color: '#fff' }} />
            </Box>
          }
        />
        <BottomNavigationAction value="match" label="Подобрать" icon={<AutoAwesomeOutlinedIcon />} />
        <BottomNavigationAction value="profile" label="Данные" icon={<PersonOutlineIcon />} />
      </BottomNavigation>

      <UploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSave={item => { addItem(item); setUploadOpen(false) }}
      />
    </Box>
  )
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <AppShell />
      </AppProvider>
    </ThemeProvider>
  )
}
