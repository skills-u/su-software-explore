import { useCallback, useEffect, useState } from 'react'

const FAVORITES_KEY = 'universe:favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY)
      if (raw) setFavorites(new Set(JSON.parse(raw) as string[]))
    } catch {
      // ignore corrupt / unavailable storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]))
    } catch {
      // ignore write failures (e.g. private mode)
    }
  }, [favorites, hydrated])

  const toggle = useCallback((domain: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(domain)) next.delete(domain)
      else next.add(domain)
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (domain: string) => favorites.has(domain),
    [favorites],
  )

  return { favorites, toggle, isFavorite, hydrated }
}
