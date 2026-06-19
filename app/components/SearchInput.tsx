function SearchInput({
  value,
  onChange,
  variant = "hero",
}: {
  value: string;
  onChange: (v: string) => void;
  variant?: "hero" | "bar";
}) {
  const hero = variant === "hero";
  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 1 0 3.39 9.85l3.13 3.13a.75.75 0 1 0 1.06-1.06l-3.13-3.13A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
          clipRule="evenodd"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name or domain…"
        aria-label="Search universities"
        className={
          hero
            ? "w-full rounded-2xl border border-transparent bg-white py-4 pl-12 pr-4 text-base text-slate-900 shadow-2xl shadow-indigo-900/20 outline-none ring-2 ring-transparent transition focus:ring-indigo-300"
            : "w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        }
      />
    </div>
  );
}

export default SearchInput;
