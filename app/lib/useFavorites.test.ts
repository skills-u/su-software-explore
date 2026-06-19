import { renderHook, act } from '@testing-library/react'
import { useFavorites } from './useFavorites'

beforeEach(() => localStorage.clear())

describe('useFavorites', () => {
  it('starts empty when nothing is stored', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites.size).toBe(0)
  })

  it('toggles a favorite on and off', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggle('acu.edu'))
    expect(result.current.isFavorite('acu.edu')).toBe(true)
    act(() => result.current.toggle('acu.edu'))
    expect(result.current.isFavorite('acu.edu')).toBe(false)
  })

  it('persists favorites to localStorage', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggle('acu.edu'))
    expect(
      JSON.parse(localStorage.getItem('universe:favorites') ?? '[]'),
    ).toContain('acu.edu')
  })

  it('hydrates from existing localStorage', () => {
    localStorage.setItem('universe:favorites', JSON.stringify(['acu.edu']))
    const { result } = renderHook(() => useFavorites())
    expect(result.current.isFavorite('acu.edu')).toBe(true)
  })

  it('survives corrupt stored data without throwing', () => {
    localStorage.setItem('universe:favorites', 'not json')
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites.size).toBe(0)
  })
})
