import { useCallback, useEffect, useState } from 'react'
import { Outfit, OutfitTag } from '../types'

const KEY = 'saved_outfits_v2'

function load(): Outfit[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch (error) {
    console.error('Failed to load outfits', error)
    return []
  }
}

function save(items: Outfit[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save outfits', error)
  }
}

export function useOutfits() {
  const [outfits, setOutfits] = useState<Outfit[]>(load)

  useEffect(() => {
    save(outfits)
  }, [outfits])

  const addOutfit = useCallback((outfit: Outfit) => {
    setOutfits(prev => {
      const exists = prev.some(item => item.id === outfit.id)
      if (exists) return prev
      return [outfit, ...prev]
    })
  }, [])

  const removeOutfit = useCallback((id: string) => {
    setOutfits(prev => prev.filter(item => item.id !== id))
  }, [])

  const updateTags = useCallback((id: string, tags: OutfitTag[]) => {
    setOutfits(prev =>
      prev.map(item => {
        if (item.id !== id) return item
        return { ...item, tags }
      }),
    )
  }, [])

  const setLiked = useCallback((id: string, liked: boolean) => {
    setOutfits(prev =>
      prev.map(item => {
        if (item.id !== id) return item
        return { ...item, liked }
      }),
    )
  }, [])

  return {
    outfits,
    addOutfit,
    removeOutfit,
    updateTags,
    setLiked,
  }
}