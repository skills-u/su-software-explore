import { COLUMNS } from "@/lib/constants"
import { Logo } from "@/components/logo"
import { ArrowIcon } from "@/components/arrow-icon"


export function UniversityTable({
  items,
  visibleColumns,
  columnWidths,
  onResizeStart,
}: {
  items: University[]
  visibleColumns: ColumnKey[]
  columnWidths: Record<ColumnKey, number>
  onResizeStart: (key: ColumnKey, e: React.MouseEvent) => void
}) {
  const cols = COLUMNS.filter((c) => visibleColumns.includes(c.key))

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse text-sm">
        <colgroup>
          {cols.map((col) => (
            <col key={col.key} style={{ width: columnWidths[col.key] }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {cols.map((col, i) => {
              const isLast = i === cols.length - 1
              return (
                <th
                  key={col.key}
                  scope="col"
                  className="relative select-none px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                  style={{ width: columnWidths[col.key] }}
                >
                  {col.label}
                  {!isLast && (
                    <div
                      onMouseDown={(e) => onResizeStart(col.key, e)}
                      title="Drag to resize column"
                      className="absolute right-0 top-0 z-10 h-full w-4 cursor-col-resize select-none"
                      aria-hidden="true"
                    >
                      <div className="absolute right-1.5 top-1/2 h-4 w-px -translate-y-1/2 rounded-full bg-slate-300 transition-colors group-hover:bg-indigo-400" />
                    </div>
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {items.map((university) => (
            <tr
              className="group cursor-pointer border-b border-slate-100 transition-colors last:border-0 hover:bg-indigo-50/60"
              onClick={() => window.open(university.url, '_blank', 'noopener,noreferrer')}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  window.open(university.url, '_blank', 'noopener,noreferrer')
                }
              }}
              aria-label={`Open ${university.name}`}
            >
              {cols.map((col) => {
                switch (col.key) {
                  case 'name':
                    return (
                      <td key={col.key} className="px-4 py-3 flex items-center gap-2">
                        <Logo university={university} size="sm" />
                        <span className="font-semibold text-slate-900 transition-colors group-hover:text-indigo-700 line-clamp-1">
                          {university.name}
                        </span>
                      </td>
                    )
                  case 'domain':
                    return (
                      <td key={col.key} className="px-4 py-3">
                        <span className="font-mono text-xs text-slate-500">
                          {university.domain}
                        </span>
                      </td>
                    )
                  case 'state':
                    return (
                      <td key={col.key} className="px-4 py-3 text-sm text-slate-600">
                        {university.state ?? (
                          <span>United States</span>
                        )}
                      </td>
                    )
                  case 'url':
                    return (
                      <td key={col.key} className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-opacity">
                          Visit
                          <ArrowIcon />
                        </span>
                      </td>
                    )
                  default:
                    return null
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
