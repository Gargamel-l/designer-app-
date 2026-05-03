import { useState, useEffect, useCallback } from 'react'
import { Outfit } from '../types'

const KEY = 'outfits_v1'

function load(): Outfit[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(outfits: Outfit[]) {
  localStorage.setItem(KEY, JSON.stringify(outfits))
}

export function useOutfits() {
  const [outfits, setOutfits] = useState<Outfit[]>(load)

  useEffect(() => {
    save(outfits)
  }, [outfits])

  const saveOutfit = useCallback((outfit: Outfit) => {
    setOutfits(prev => {
      const exists = prev.some(o => o.id === outfit.id)
      if (exists) return prev.map(o => (o.id === outfit.id ? outfit : o))
      return [outfit, ...prev]
    })
  }, [])

  const removeOutfit = useCallback((id: string) => {
    setOutfits(prev => prev.filter(o => o.id !== id))
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setOutfits(prev =>
      prev.map(o => (o.id === id ? { ...o, isFavorite: !o.isFavorite } : o))
    )
  }, [])

  const favoriteOutfits = outfits.filter(o => o.isFavorite)

  return { outfits, favoriteOutfits, saveOutfit, removeOutfit, toggleFavorite }
}
