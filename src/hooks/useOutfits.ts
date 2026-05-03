import { useState, useEffect, useCallback, useMemo } from 'react'
import { Outfit } from '../types'
import { AuthUser } from '../auth'

const BASE_KEY = 'outfits_v1'

function getStorageKey(user: AuthUser | null): string | null {
  if (!user) return null

  return `${BASE_KEY}_${user.login}`
}

function normalizeOutfit(outfit: Outfit): Outfit {
  return {
    ...outfit,
    tags: outfit.tags ?? [],
    isFavorite: outfit.isFavorite ?? false,
  }
}

function load(storageKey: string | null): Outfit[] {
  if (!storageKey) return []

  try {
    const raw = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as Outfit[]

    return raw.map(normalizeOutfit)
  } catch {
    return []
  }
}

function save(storageKey: string | null, outfits: Outfit[]) {
  if (!storageKey) return

  localStorage.setItem(storageKey, JSON.stringify(outfits))
}

export function useOutfits(user: AuthUser | null) {
  const storageKey = useMemo(() => getStorageKey(user), [user])

  const [state, setState] = useState<{
    storageKey: string | null
    outfits: Outfit[]
  }>(() => ({
    storageKey,
    outfits: load(storageKey),
  }))

  useEffect(() => {
    if (state.storageKey === storageKey) return

    setState({
      storageKey,
      outfits: load(storageKey),
    })
  }, [storageKey, state.storageKey])

  useEffect(() => {
    if (!state.storageKey) return
    if (state.storageKey !== storageKey) return

    save(state.storageKey, state.outfits)
  }, [state.storageKey, state.outfits, storageKey])

  const saveOutfit = useCallback((outfit: Outfit) => {
    setState(prev => {
      const normalized = normalizeOutfit(outfit)
      const exists = prev.outfits.some(o => o.id === normalized.id)

      return {
        ...prev,
        outfits: exists
          ? prev.outfits.map(o => (o.id === normalized.id ? normalized : o))
          : [normalized, ...prev.outfits],
      }
    })
  }, [])

  const removeOutfit = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      outfits: prev.outfits.filter(o => o.id !== id),
    }))
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      outfits: prev.outfits.map(o =>
        o.id === id
          ? { ...o, isFavorite: !o.isFavorite }
          : o,
      ),
    }))
  }, [])

  const favoriteOutfits = state.outfits.filter(o => o.isFavorite)

  return {
    outfits: state.outfits,
    favoriteOutfits,
    saveOutfit,
    removeOutfit,
    toggleFavorite,
  }
}