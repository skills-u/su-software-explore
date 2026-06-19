import formatNumber from "../lib/format";

function StatPill({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
      <div className="text-2xl font-extrabold text-white sm:text-3xl">
        {formatNumber(value)}
      </div>
      <div className="text-xs font-medium uppercase tracking-wide text-indigo-100">
        {label}
      </div>
    </div>
  );
}

export default StatPill;
