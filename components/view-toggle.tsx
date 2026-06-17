export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode
  onChange: (v: ViewMode) => void
}) {
  return (
    <div
      className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
      role="group"
      aria-label="View mode"
    >
      <button
        type="button"
        onClick={() => onChange('grid')}
        aria-pressed={value === 'grid'}
        aria-label="Grid view"
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
          value === 'grid'
            ? 'bg-indigo-600 text-white shadow'
            : 'text-slate-500 hover:text-indigo-600'
        }`}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5ZM13.25 2A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5ZM2 13.25A2.25 2.25 0 0 1 4.25 11h2.5A2.25 2.25 0 0 1 9 13.25v2.5A2.25 2.25 0 0 1 6.75 18h-2.5A2.25 2.25 0 0 1 2 15.75v-2.5ZM13.25 11A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z" clipRule="evenodd" />
        </svg>
        <span className="hidden sm:inline">Grid</span>
      </button>
      <button
        type="button"
        onClick={() => onChange('table')}
        aria-pressed={value === 'table'}
        aria-label="Table view"
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
          value === 'table'
            ? 'bg-indigo-600 text-white shadow'
            : 'text-slate-500 hover:text-indigo-600'
        }`}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path fillRule="evenodd" d="M.99 5.24A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25l.01 9.5A2.25 2.25 0 0 1 16.76 17H3.26A2.267 2.267 0 0 1 1 14.74l-.01-9.5Zm8.26 9.52v-.001l4.5.004a.75.75 0 0 0 .75-.75l-.003-4.51a.75.75 0 0 0-.75-.75l-4.5-.003a.75.75 0 0 0-.75.751l.003 4.51a.75.75 0 0 0 .75.748Zm-5.74-3.002-.004-4.51a.75.75 0 0 1 .75-.75h3l.004 4.51a.75.75 0 0 1-.75.75l-3-.001Zm9 .002 3 .002a.75.75 0 0 0 .75-.75l-.004-4.51a.75.75 0 0 0-.75-.75l-3-.002.004 4.51a.75.75 0 0 0 .75.749ZM2.498 8.246l-.003-3a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 .75.75l.003 3H2.498Z" clipRule="evenodd" />
        </svg>
        <span className="hidden sm:inline">Table</span>
      </button>
    </div>
  )
}