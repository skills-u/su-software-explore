'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import universitiesData from '@/data/universities.json'
import { PAGE_SIZE, LETTERS, COLUMNS } from '@/lib/constants'
import { getPageList, formatNumber } from '@/lib/utils'
import { UniversityCard } from '@/components/university-card'
import { StatPill } from "@/components/stats-pill"
import { SearchInput } from "@/components/search-input"
import { ViewToggle } from '@/components/view-toggle'
import { ColumnSelector } from '@/components/column-selector'
import { UniversityTable } from '@/components/university-table'

const universities = universitiesData as University[]

/* ---------- precomputed stats (module scope) ---------- */
const STATS = universities.reduce(
  (acc, u) => {
    const n = u.name.toLowerCase()
    if (n.includes('university')) acc.universities++
    else if (n.includes('college')) acc.colleges++
    if (
      n.includes('community') ||
      n.includes('technical') ||
      n.includes('institute of technology')
    )
      acc.tech++
    if (u.domain.endsWith('.edu')) acc.edu++
    return acc
  },
  { universities: 0, colleges: 0, tech: 0, edu: 0 },
)

/* ---------- page ---------- */
export default function Page() {
  const [query, setQuery] = useState('')
  const [letter, setLetter] = useState('All')
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [columnWidths, setColumnWidths] = useState<Record<ColumnKey, number>>(
    () =>
      Object.fromEntries(COLUMNS.map((c) => [c.key, c.defaultWidth])) as Record<
        ColumnKey,
        number
      >,
  )

  const resizingRef = useRef<{
    key: ColumnKey
    startX: number
    startWidth: number
  } | null>(null)

  const handleResizeStart = useCallback(
    (key: ColumnKey, e: React.MouseEvent) => {
      e.preventDefault()
      resizingRef.current = {
        key,
        startX: e.clientX,
        startWidth: columnWidths[key],
      }
    },
    [columnWidths],
  )

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!resizingRef.current) return
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      const { key, startX, startWidth } = resizingRef.current
      const col = COLUMNS.find((c) => c.key === key)!
      const newWidth = Math.max(col.minWidth, startWidth + (e.clientX - startX))
      setColumnWidths((prev) => ({ ...prev, [key]: newWidth }))
    }
    function handleMouseUp() {
      if (!resizingRef.current) return
      resizingRef.current = null
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(
    () => new Set(COLUMNS.map((c) => c.key)),
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return universities.filter((u) => {
      if (letter !== 'All') {
        const first = u.name[0]?.toUpperCase() ?? ''
        if (letter === '#') {
          if (/[A-Z]/.test(first)) return false
        } else if (first !== letter) {
          return false
        }
      }
      if (q) {
        return (
          u.name.toLowerCase().includes(q) || u.domain.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [query, letter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const pageItems = filtered.slice(start, start + PAGE_SIZE)

  function scrollToBrowse() {
    document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth' })
  }

  function changeQuery(v: string) {
    setQuery(v)
    setPage(1)
  }

  function changeLetter(v: string) {
    setLetter(v)
    setPage(1)
  }

  function goToPage(p: number) {
    setPage(p)
    scrollToBrowse()
  }

  const visibleColKeys = useMemo(
    () => COLUMNS.filter((c) => visibleColumns.has(c.key)).map((c) => c.key),
    [visibleColumns],
  )

  function toggleColumn(key: ColumnKey) {
    setVisibleColumns((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-md">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3Z" />
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z" />
              </svg>
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              UniVerse
            </span>
          </a>
          <a
            href="https://github.com/Hipo/university-domains-list"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm font-medium text-slate-500 transition hover:text-indigo-600 sm:block"
          >
            Data source ↗
          </a>
        </div>
      </header>

      {/* Hero */}
      <section
        id="top"
        className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,.25) 0, transparent 35%), radial-gradient(circle at 80% 0%, rgba(255,255,255,.2) 0, transparent 30%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-indigo-50 backdrop-blur-sm">
              🎓 {formatNumber(universities.length)} institutions across the U.S.
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Explore universities &amp; colleges
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-indigo-100">
              Browse a directory of accredited American universities, colleges,
              and institutes. Search by name or web domain and jump straight to
              their official websites.
            </p>
            <div className="mx-auto mt-8 max-w-xl">
              <SearchInput value={query} onChange={changeQuery} variant="hero" />
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <StatPill value={universities.length} label="Institutions" />
              <StatPill value={STATS.universities} label="Universities" />
              <StatPill value={STATS.colleges} label="Colleges" />
              <StatPill value={STATS.edu} label=".edu Domains" />
            </div>
          </div>
        </div>
      </section>

      {/* Browse */}
      <main
        id="browse"
        className="mx-auto max-w-7xl scroll-mt-16 px-4 py-12 sm:px-6 lg:px-8"
      >
        {/* Toolbar */}
        <div className="sticky top-[57px] z-20 -mx-4 mb-8 border-b border-slate-200 bg-slate-50/90 px-4 py-4 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border sm:px-5 sm:shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* <div className="lg:max-w-xs lg:flex-1">
              <SearchInput value={query} onChange={changeQuery} variant="bar" />
            </div> */}
            <div className="-mx-1 flex gap-1 overflow-x-auto pb-1">
              {LETTERS.map((l) => {
                const active = l === letter
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => changeLetter(l)}
                    className={`shrink-0 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition ${
                      active
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    {l}
                  </button>
                )
              })}
            </div>
             <div className="flex ml-2 shrink-0 items-center gap-2">
                <ViewToggle value={viewMode} onChange={setViewMode} />
                {viewMode === 'table' && (
                  <ColumnSelector
                    columns={COLUMNS}
                    visible={visibleColumns}
                    onToggle={toggleColumn}
                  />
                )}
              </div>
          </div>
        </div>

        {/* Result count */}
        <div className="mb-6 flex items-baseline justify-between">
          <p className="text-sm text-slate-500">
            {filtered.length === 0 ? (
              'No matches'
            ) : (
              <>
                Showing{' '}
                <span className="font-semibold text-slate-700">
                  {formatNumber(start + 1)}–
                  {formatNumber(start + pageItems.length)}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-700">
                  {formatNumber(filtered.length)}
                </span>
              </>
            )}
          </p>
          {(query || letter !== 'All') && (
            <button
              type="button"
              onClick={() => {
                changeQuery('')
                changeLetter('All')
              }}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Clear filters
            </button>
          )}
        </div>

         {/* Content */}
        {pageItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <p className="text-lg font-semibold text-slate-700">
              No universities found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search term or letter.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageItems.map((u, i) => (
              <UniversityCard
                key={`${u.name}-${u.domain}`}
                university={u}
                index={i}
              />
            ))}
          </div>
        ) : (
          <UniversityTable
            items={pageItems}
            visibleColumns={visibleColKeys}
            columnWidths={columnWidths}
            onResizeStart={handleResizeStart}
          />
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition enabled:hover:border-indigo-300 enabled:hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            {getPageList(safePage, totalPages).map((p, idx) =>
              p === '…' ? (
                <span key={`gap-${idx}`} className="px-2 text-slate-400">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => goToPage(p)}
                  className={`min-w-[40px] rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    p === safePage
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {p}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition enabled:hover:border-indigo-300 enabled:hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>
            <span className="font-semibold text-slate-700">UniVerse</span> —{' '}
            {formatNumber(universities.length)} U.S. universities &amp; colleges.
          </p>
          <p>Logos via Clearbit · Data from the Hipo university list.</p>
        </div>
      </footer>
    </div>
  )
}
