import { useCallback, useEffect, useState } from 'react'
import { ClothingItem } from '../types'

const KEY = 'wardrobe_v2'

function load(): ClothingItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch (error) {
    console.error('Failed to load wardrobe', error)
    return []
  }
}

function save(items: ClothingItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save wardrobe', error)
  }
}

export function useWardrobe() {
  const [items, setItems] = useState<ClothingItem[]>(load)

  useEffect(() => {
    save(items)
  }, [items])

  const addItem = useCallback((item: ClothingItem) => {
    setItems(prev => [item, ...prev])
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const updateItem = useCallback((updatedItem: ClothingItem) => {
    setItems(prev => prev.map(item => (item.id === updatedItem.id ? updatedItem : item)))
  }, [])

  return {
    items,
    addItem,
    removeItem,
    updateItem,
  }
}