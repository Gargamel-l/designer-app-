import { Box } from '@mui/material'
import PageHeader from '../components/common/PageHeader'
import { useAppContext } from '../AppContext'
import UploadDialog from '../components/upload/UploadDialog'
import { ClothingItem } from '../types'

export default function WardrobeScreen() {
  const { addClothingItem, uploadOpen, setUploadOpen } = useAppContext()

  const handleSave = (item: ClothingItem) => {
    addClothingItem({
      ...item,
      style: item.style ?? 'casual',
    })
  }

  return (
    <Box sx={{ pb: 3 }}>
      <PageHeader title="Гардероб" />

      <Box sx={{ px: 1.5 }}>
        <UploadDialog
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          onSave={handleSave}
        />
      </Box>
    </Box>
  )
}