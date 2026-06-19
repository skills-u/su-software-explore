function ContentSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading universities"
      className="grid animate-pulse grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <span className="sr-only">Loading…</span>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 shrink-0 rounded-xl bg-slate-200" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-3 w-1/2 rounded bg-slate-100" />
            </div>
          </div>
          <div className="mt-4 border-t border-slate-100 pt-3">
            <div className="h-3 w-2/3 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContentSkeleton;
