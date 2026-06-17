import { Logo } from '@/components/logo'
import { ArrowIcon } from '@/components/arrow-icon'

export function UniversityCard({
  university,
  index,
}: {
  university: University
  index: number
}) {
  return (
    <a
      href={university.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
      className="group flex animate-fade-up flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100"
    >
      <div className="flex items-start gap-4">
        <Logo university={university} />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-semibold leading-snug text-slate-900 group-hover:text-indigo-600">
            {university.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {university.state ?? 'United States'}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="truncate font-mono text-xs text-slate-400">
          {university.domain}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
          Visit
          <ArrowIcon />
        </span>
      </div>
    </a>
  )
}