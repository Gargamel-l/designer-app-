import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ClothingItem, Outfit, OutfitTag, Tab } from './types'

type AppContextValue = {
  uploadOpen: boolean
  setUploadOpen: React.Dispatch<React.SetStateAction<boolean>>

  tab: Tab
  setTab: React.Dispatch<React.SetStateAction<Tab>>

  wardrobe: ClothingItem[]
  items: ClothingItem[]

  addClothingItem: (item: ClothingItem) => void
  addItem: (item: ClothingItem) => void
  updateClothingItem: (item: ClothingItem) => void
  removeClothingItem: (id: string) => void

  outfits: Outfit[]
  favoriteOutfits: Outfit[]
  addOutfit: (outfit: Outfit) => void
  saveOutfit: (outfit: Outfit) => void
  removeOutfit: (id: string) => void
  toggleFavorite: (id: string) => void
  updateOutfitTags: (id: string, tags: OutfitTag[]) => void
}

const AppContext = createContext<AppContextValue | null>(null)

const WARDROBE_KEY = 'wardrobe_v3'
const OUTFITS_KEY = 'outfits_v3'
const TAB_KEY = 'tab_v1'

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [tab, setTab] = useState<Tab>(() => loadJson<Tab>(TAB_KEY, 'wardrobe'))
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>(
    () => loadJson<ClothingItem[]>(WARDROBE_KEY, []),
  )
  const [outfits, setOutfits] = useState<Outfit[]>(
    () =>
      loadJson<Outfit[]>(OUTFITS_KEY, []).map(outfit => ({
        ...outfit,
        tags: outfit.tags ?? [],
      })),
  )

  useEffect(() => {
    localStorage.setItem(WARDROBE_KEY, JSON.stringify(wardrobe))
  }, [wardrobe])

  useEffect(() => {
    localStorage.setItem(OUTFITS_KEY, JSON.stringify(outfits))
  }, [outfits])

  useEffect(() => {
    localStorage.setItem(TAB_KEY, JSON.stringify(tab))
  }, [tab])

  const addClothingItem = (item: ClothingItem) => {
    setWardrobe(prev => [item, ...prev])
  }

  const addItem = (item: ClothingItem) => {
    addClothingItem(item)
  }

  const updateClothingItem = (item: ClothingItem) => {
    setWardrobe(prev => prev.map(x => (x.id === item.id ? item : x)))
  }

  const removeClothingItem = (id: string) => {
    setWardrobe(prev => prev.filter(x => x.id !== id))
    setOutfits(prev => prev.filter(outfit => !outfit.itemIds.includes(id)))
  }

  const addOutfit = (outfit: Outfit) => {
    setOutfits(prev => {
      if (prev.some(x => x.id === outfit.id)) return prev
      return [{ ...outfit, tags: outfit.tags ?? [] }, ...prev]
    })
  }

  const saveOutfit = (outfit: Outfit) => {
    addOutfit(outfit)
  }

  const removeOutfit = (id: string) => {
    setOutfits(prev => prev.filter(x => x.id !== id))
  }

  const toggleFavorite = (id: string) => {
    setOutfits(prev =>
      prev.map(outfit =>
        outfit.id === id ? { ...outfit, isFavorite: !outfit.isFavorite } : outfit,
      ),
    )
  }

  const updateOutfitTags = (id: string, tags: OutfitTag[]) => {
    setOutfits(prev =>
      prev.map(outfit => (outfit.id === id ? { ...outfit, tags } : outfit)),
    )
  }

  const favoriteOutfits = useMemo(
    () => outfits.filter(outfit => outfit.isFavorite),
    [outfits],
  )

  const value: AppContextValue = {
    uploadOpen,
    setUploadOpen,
    tab,
    setTab,
    wardrobe,
    items: wardrobe,
    addClothingItem,
    addItem,
    updateClothingItem,
    removeClothingItem,
    outfits,
    favoriteOutfits,
    addOutfit,
    saveOutfit,
    removeOutfit,
    toggleFavorite,
    updateOutfitTags,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useAppContext must be used inside AppProvider')
  }
  return ctx
}

export const useApp = useAppContext