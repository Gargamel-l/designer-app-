import React, { createContext, useContext, useState } from 'react'
import { ClothingItem, Outfit, Tab } from './types'
import { useWardrobe } from './hooks/useWardrobe'
import { useOutfits } from './hooks/useOutfits'

interface AppContextValue {
  tab: Tab
  setTab: (t: Tab) => void
  items: ClothingItem[]
  addItem: (item: ClothingItem) => void
  removeItem: (id: string) => void
  updateItem: (item: ClothingItem) => void
  outfits: Outfit[]
  favoriteOutfits: Outfit[]
  saveOutfit: (o: Outfit) => void
  removeOutfit: (id: string) => void
  toggleFavorite: (id: string) => void
  uploadOpen: boolean
  setUploadOpen: (v: boolean) => void
}

const AppContext = createContext<AppContextValue>(null!)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<Tab>('outfits')
  const [uploadOpen, setUploadOpen] = useState(false)
  const wardrobe = useWardrobe()
  const outfitStore = useOutfits()

  return (
    <AppContext.Provider
      value={{
        tab, setTab,
        ...wardrobe,
        ...outfitStore,
        uploadOpen, setUploadOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
