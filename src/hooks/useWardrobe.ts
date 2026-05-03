import { useState, useEffect, useCallback, useMemo } from 'react'
import { ClothingItem, ClothingStyle } from '../types'
import { AuthUser } from '../auth'

const BASE_KEY = 'wardrobe_v1'

function getStorageKey(user: AuthUser | null): string | null {
  if (!user) return null

  return `${BASE_KEY}_${user.login}`
}

function normalizeStyles(item: ClothingItem): ClothingStyle[] {
  // Пустой массив styles = без стиля = универсальная вещь.
  if (Array.isArray(item.styles)) return item.styles

  // Старый формат, если раньше было одно поле style.
  if (item.style) return [item.style]

  // Если у старой вещи вообще не было стиля, считаем её универсальной.
  return []
}

function normalizeItem(item: ClothingItem): ClothingItem {
  return {
    ...item,
    styles: normalizeStyles(item),
  }
}

function load(storageKey: string | null): ClothingItem[] {
  if (!storageKey) return []

  try {
    const raw = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as ClothingItem[]

    return raw.map(normalizeItem)
  } catch (e) {
    console.error('Failed to load wardrobe from localStorage', e)
    return []
  }
}

function save(storageKey: string | null, items: ClothingItem[]) {
  if (!storageKey) return false

  try {
    localStorage.setItem(storageKey, JSON.stringify(items))
    return true
  } catch (e) {
    console.error('Failed to save wardrobe to localStorage', e)
    return false
  }
}

export function useWardrobe(user: AuthUser | null) {
  const storageKey = useMemo(() => getStorageKey(user), [user])

  const [state, setState] = useState<{
    storageKey: string | null
    items: ClothingItem[]
  }>(() => ({
    storageKey,
    items: load(storageKey),
  }))

  useEffect(() => {
    if (state.storageKey === storageKey) return

    setState({
      storageKey,
      items: load(storageKey),
    })
  }, [storageKey, state.storageKey])

  useEffect(() => {
    if (!state.storageKey) return
    if (state.storageKey !== storageKey) return

    const ok = save(state.storageKey, state.items)

    if (!ok) {
      // тут можно показать toast/snackbar
      // например: "Не удалось сохранить гардероб: слишком большие изображения"
    }
  }, [state.storageKey, state.items, storageKey])

  const addItem = useCallback((item: ClothingItem) => {
    setState(prev => ({
      ...prev,
      items: [normalizeItem(item), ...prev.items],
    }))
  }, [])

  const removeItem = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== id),
    }))
  }, [])

  const updateItem = useCallback((updated: ClothingItem) => {
    setState(prev => ({
      ...prev,
      items: prev.items.map(i => (
        i.id === updated.id ? normalizeItem(updated) : i
      )),
    }))
  }, [])

  return {
    items: state.items,
    addItem,
    removeItem,
    updateItem,
  }
}