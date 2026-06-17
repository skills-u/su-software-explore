import {GRADIENTS} from "@/lib/constants"

function hashString(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}

export function gradientFor(name: string): string {
  return GRADIENTS[hashString(name) % GRADIENTS.length]
}

export function initials(name: string): string {
  const stop = new Set(['of', 'the', 'and', 'at', 'for', 'de', 'in', 'a'])
  const words = name
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
  const significant = words.filter((w) => !stop.has(w.toLowerCase()))
  const pick = significant.length ? significant : words
  const letters = pick
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')
  return letters || name.slice(0, 2).toUpperCase()
}

export function getPageList(current: number, total: number): (number | '…')[] {
  const pages: (number | '…')[] = []
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || (p >= current - 1 && p <= current + 1)) {
      pages.push(p)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }
  return pages
}