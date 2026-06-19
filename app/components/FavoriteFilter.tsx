function FavoriteFilter({
  active,
  count,
  onToggle,
}: {
  active: boolean;
  count: number;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
        active
          ? "bg-amber-500 text-white shadow"
          : "text-slate-500 hover:bg-amber-50 hover:text-amber-600"
      }`}
    >
      <span aria-hidden="true">★</span>
      Favorites
      {count > 0 ? ` (${count})` : ""}
    </button>
  );
}

export default FavoriteFilter;
