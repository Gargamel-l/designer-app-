import { Box, Chip, Typography } from '@mui/material'
import { OutfitTag } from '../../../types'
import { OUTFIT_TAG_LABELS, OUTFIT_TAG_OPTIONS } from '../../../constants/styleLabels'

type OutfitTagsEditorProps = {
  value: OutfitTag[]
  onChange: (tags: OutfitTag[]) => void
}

export default function OutfitTagsEditor({ value, onChange }: OutfitTagsEditorProps) {
  const toggleTag = (tag: OutfitTag) => {
    if (value.includes(tag)) {
      onChange(value.filter(item => item !== tag))
      return
    }

    onChange([...value, tag])
  }

  return (
    <Box>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 700,
          color: '#111',
          mb: 1.5,
        }}
      >
        Теги образа
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {OUTFIT_TAG_OPTIONS.map((tag: OutfitTag) => {
          const selected = value.includes(tag)

          return (
            <Chip
              key={tag}
              label={OUTFIT_TAG_LABELS[tag]}
              clickable
              onClick={() => toggleTag(tag)}
              sx={{
                borderRadius: '10px',
                fontWeight: 600,
                bgcolor: selected ? '#111' : '#f2f2f2',
                color: selected ? '#fff' : '#111',
              }}
            />
          )
        })}
      </Box>
    </Box>
  )
}