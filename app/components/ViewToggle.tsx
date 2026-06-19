type View = "grid" | "table";

function ViewToggle({
  value,
  onChange,
}: {
  value: View;
  onChange: (view: View) => void;
}) {
  return (
    <div
      role="group"
      aria-label="View"
      className="flex shrink-0 gap-1 bg-slate-200 rounded-lg"
    >
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-pressed={value === "grid"}
        aria-label="Grid view"
        className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1.5 transition ${
          value === "grid"
            ? "bg-indigo-600 text-white shadow"
            : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
        }`}
      >
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M3 3h6v6H3V3Zm8 0h6v6h-6V3ZM3 11h6v6H3v-6Zm8 0h6v6h-6v-6Z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onChange("table")}
        aria-pressed={value === "table"}
        aria-label="Table view"
        className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1.5 transition ${
          value === "table"
            ? "bg-indigo-600 text-white shadow"
            : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
        }`}
      >
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="14" height="3.2" rx="0.5" />
          <rect x="3" y="7.4" width="6.2" height="3.2" rx="0.5" />
          <rect x="10.8" y="7.4" width="6.2" height="3.2" rx="0.5" />
          <rect x="3" y="11.8" width="6.2" height="3.2" rx="0.5" />
          <rect x="10.8" y="11.8" width="6.2" height="3.2" rx="0.5" />
        </svg>
      </button>
    </div>
  );
}

export default ViewToggle;
