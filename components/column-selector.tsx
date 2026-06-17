import {useState, useRef, useEffect} from "react"

export function ColumnSelector({
  columns,
  visible,
  onToggle,
}: {
  columns: ColumnDef[]
  visible: Set<ColumnKey>
  onToggle: (key: ColumnKey) => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const hideable = columns.filter((c) => c.hideable)

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Show/hide columns"
        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M3 4a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1ZM3 10a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1ZM3 16a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Z" />
        </svg>
        <span className="hidden sm:inline">Columns</span>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Column visibility"
          className="absolute left-0 top-full z-50 mt-2 w-48 origin-top-left rounded-xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-fade-up"
          style={{ animationDuration: '150ms' }}
        >
          <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Visible columns
          </p>
          {hideable.map((col) => {
            const checked = visible.has(col.key)
            return (
              <label
                key={col.key}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(col.key)}
                  className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
                />
                {col.label}
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}