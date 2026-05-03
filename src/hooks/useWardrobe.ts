import { useState, useEffect, useCallback } from 'react'
import { ClothingItem, ClothingStyle } from '../types'

const KEY = 'wardrobe_v1'

function normalizeStyles(item: ClothingItem): ClothingStyle[] {
  // Новый формат. Пустой массив styles = без стиля = универсальная вещь.
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

function load(): ClothingItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]') as ClothingItem[]

    return raw.map(normalizeItem)
  } catch (e) {
    console.error('Failed to load wardrobe from localStorage', e)
    return []
  }
}

function save(items: ClothingItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
    return true
  } catch (e) {
    console.error('Failed to save wardrobe to localStorage', e)
    return false
  }
}

export function useWardrobe() {
  const [items, setItems] = useState<ClothingItem[]>(load)

  useEffect(() => {
    const ok = save(items)

    if (!ok) {
      // тут можно показать toast/snackbar
      // например: "Не удалось сохранить гардероб: слишком большие изображения"
    }
  }, [items])

  const addItem = useCallback((item: ClothingItem) => {
    setItems(prev => [normalizeItem(item), ...prev])
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const updateItem = useCallback((updated: ClothingItem) => {
    setItems(prev => prev.map(i => (
      i.id === updated.id ? normalizeItem(updated) : i
    )))
  }, [])

  return {
    items,
    addItem,
    removeItem,
    updateItem,
  }
}