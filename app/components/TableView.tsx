import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { University } from "@/app/lib/types";
import Logo from "./University/Logo";
import StarButton from "./StarButton";

type ColumnKey = "name" | "state" | "domain";

type ColumnConfig = {
  key: ColumnKey;
  header: string;
  hideable: boolean;
  defaultWidth: number;
  minWidth: number;
  cellClassName?: string;
  renderCell: (u: University) => ReactNode;
};

// Base config: the columns that exist and their defaults. Visibility and width
// are overridden by localStorage when present (see loadState).
const COLUMNS: ColumnConfig[] = [
  {
    key: "name",
    header: "Name",
    hideable: true,
    defaultWidth: 280,
    minWidth: 160,
    renderCell: (u) => (
      <div className="flex min-w-0 items-center gap-3">
        <Logo university={u} size="sm" />
        <span className="truncate font-medium text-slate-900">{u.name}</span>
      </div>
    ),
  },
  {
    key: "state",
    header: "State",
    hideable: true,
    defaultWidth: 160,
    minWidth: 90,
    cellClassName: "text-slate-600",
    renderCell: (u) => u.state ?? "United States",
  },
  {
    key: "domain",
    header: "Domain",
    hideable: true,
    defaultWidth: 220,
    minWidth: 120,
    cellClassName: "font-mono text-xs text-slate-500",
    renderCell: (u) => u.domain,
  },
];

const ACTIONS_WIDTH = 140;
export const COLUMNS_STORAGE_KEY = "universe:table:columns";

type ColumnPref = { visible: boolean; width: number };
type ColumnPrefs = Record<ColumnKey, ColumnPref>;

const BASE_PREFS: ColumnPrefs = COLUMNS.reduce((acc, c) => {
  acc[c.key] = { visible: true, width: c.defaultWidth };
  return acc;
}, {} as ColumnPrefs);

// Loads prefs from localStorage over the base config. `customized` is true once
// the user has resized (i.e. a numeric width is stored) — that disables the
// auto-fit so the user's explicit widths win.
export function loadState(): { prefs: ColumnPrefs; customized: boolean } {
  try {
    const raw = localStorage.getItem(COLUMNS_STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Partial<
        Record<ColumnKey, Partial<ColumnPref>>
      >;
      const customized = COLUMNS.some(
        (c) => typeof stored[c.key]?.width === "number",
      );
      const prefs = COLUMNS.reduce((acc, c) => {
        const s = stored[c.key];
        acc[c.key] = {
          visible: typeof s?.visible === "boolean" ? s.visible : true,
          width:
            typeof s?.width === "number"
              ? Math.max(c.minWidth, s.width)
              : c.defaultWidth,
        };
        return acc;
      }, {} as ColumnPrefs);
      if (COLUMNS.some((c) => prefs[c.key].visible)) return { prefs, customized };
    }
  } catch {
    // ignore corrupt / unavailable storage
  }
  return { prefs: BASE_PREFS, customized: false };
}

function TableView({
  rows,
  isFavorite,
  onOpen,
  onToggleFavorite,
}: {
  rows: University[];
  isFavorite: (domain: string) => boolean;
  onOpen: (university: University) => void;
  onToggleFavorite: (domain: string) => void;
}) {
  const [prefs, setPrefs] = useState<ColumnPrefs>(() => loadState().prefs);
  const [customized, setCustomized] = useState<boolean>(
    () => loadState().customized,
  );
  const [configOpen, setConfigOpen] = useState(false);
  const [resizing, setResizing] = useState<{
    key: ColumnKey;
    width: number;
  } | null>(null);
  const configRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleColumns = COLUMNS.filter((c) => prefs[c.key].visible);
  const visibleKey = visibleColumns.map((c) => c.key).join(",");

  // Auto-fit visible data columns to fill the container on large viewports
  // (Actions stays fixed). Disabled once the user resizes manually. Layout
  // effect so the fitted widths are applied before paint (no flash).
  useLayoutEffect(() => {
    if (customized) return;
    const wrap = scrollRef.current;
    if (!wrap) return;
    const available = wrap.clientWidth - ACTIONS_WIDTH;
    const cols = COLUMNS.filter((c) => prefs[c.key].visible);
    const defaultsSum = cols.reduce((s, c) => s + c.defaultWidth, 0);
    // Small viewport: keep defaults and let the table scroll.
    const factor = available > defaultsSum ? available / defaultsSum : 1;
    setPrefs((prev) => {
      const next = { ...prev };
      cols.forEach((c) => {
        next[c.key] = {
          ...prev[c.key],
          width: Math.round(c.defaultWidth * factor),
        };
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customized, visibleKey, rows.length === 0]);

  // Close the column popover on outside click / Escape.
  useEffect(() => {
    if (!configOpen) return;
    function onDocMouseDown(e: MouseEvent) {
      if (!configRef.current?.contains(e.target as Node)) setConfigOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setConfigOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [configOpen]);

  function persist(nextPrefs: ColumnPrefs, isCustomized: boolean) {
    const data: Record<string, { visible: boolean; width?: number }> = {};
    COLUMNS.forEach((c) => {
      data[c.key] = isCustomized
        ? { visible: nextPrefs[c.key].visible, width: nextPrefs[c.key].width }
        : { visible: nextPrefs[c.key].visible };
    });
    try {
      localStorage.setItem(COLUMNS_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore write failures
    }
  }

  function toggleColumn(key: ColumnKey) {
    setPrefs((prev) => {
      // Keep at least one column visible.
      const count = COLUMNS.filter((c) => prev[c.key].visible).length;
      if (prev[key].visible && count <= 1) return prev;
      const next = {
        ...prev,
        [key]: { ...prev[key], visible: !prev[key].visible },
      };
      persist(next, customized);
      return next;
    });
  }

  function setColumnWidth(key: ColumnKey, width: number) {
    setCustomized(true);
    setPrefs((prev) => {
      const next = { ...prev, [key]: { ...prev[key], width } };
      persist(next, true);
      return next;
    });
  }

  // Live resize: track width locally during the drag, commit (and persist) once
  // on release. Width is clamped to the column's minimum throughout.
  function startResize(e: React.PointerEvent, column: ColumnConfig) {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = prefs[column.key].width;
    const clamp = (dx: number) => Math.max(column.minWidth, startWidth + dx);

    function onMove(ev: PointerEvent) {
      setResizing({ key: column.key, width: clamp(ev.clientX - startX) });
    }
    function onUp(ev: PointerEvent) {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      setResizing(null);
      setColumnWidth(column.key, clamp(ev.clientX - startX));
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
        <p className="text-lg font-semibold text-slate-700">
          No universities found
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Try a different search term or letter.
        </p>
      </div>
    );
  }

  const visibleCount = visibleColumns.length;
  const widthFor = (key: ColumnKey) =>
    resizing?.key === key ? resizing.width : prefs[key].width;
  const totalWidth =
    visibleColumns.reduce((sum, c) => sum + widthFor(c.key), 0) + ACTIONS_WIDTH;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Toolbar */}
      <div
        ref={configRef}
        className="relative flex items-center justify-end border-b border-slate-200 px-3 py-2"
      >
        <button
          type="button"
          onClick={() => setConfigOpen((v) => !v)}
          aria-haspopup="true"
          aria-expanded={configOpen}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M4 4h3v12H4V4Zm4.5 0h3v12h-3V4ZM13 4h3v12h-3V4Z" />
          </svg>
          Columns
        </button>
        {configOpen && (
          <div
            role="group"
            aria-label="Toggle columns"
            className="absolute right-0 top-full z-30 mt-1 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
          >
            {COLUMNS.filter((c) => c.hideable).map((c) => (
              <label
                key={c.key}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={prefs[c.key].visible}
                  disabled={prefs[c.key].visible && visibleCount === 1}
                  onChange={() => toggleColumn(c.key)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400 disabled:cursor-not-allowed"
                />
                {c.header}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div ref={scrollRef} className="overflow-x-auto rounded-b-2xl">
        <table
          className="table-fixed text-left text-sm"
          style={{ width: totalWidth }}
        >
          <colgroup>
            {visibleColumns.map((c) => (
              <col key={c.key} style={{ width: widthFor(c.key) }} />
            ))}
            <col style={{ width: ACTIONS_WIDTH }} />
          </colgroup>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {visibleColumns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className="relative truncate border-r border-slate-200 px-4 py-3"
                >
                  {c.header}
                  <span
                    role="separator"
                    aria-orientation="vertical"
                    aria-label={`Resize ${c.header} column`}
                    onPointerDown={(e) => startResize(e, c)}
                    className="absolute -right-px top-0 h-full w-2 cursor-col-resize touch-none select-none hover:bg-indigo-300"
                  />
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr
                key={`${u.name}-${u.domain}`}
                className="border-b border-slate-100 transition-colors last:border-0 hover:bg-indigo-50/40"
              >
                {visibleColumns.map((c) => (
                  <td
                    key={c.key}
                    className={`truncate border-r border-slate-100 px-4 py-3 align-middle ${
                      c.cellClassName ?? ""
                    }`}
                  >
                    {c.renderCell(u)}
                  </td>
                ))}
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => onOpen(u)}
                      aria-label={`View details for ${u.name}`}
                      className="grid place-items-center rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M.664 10.59a1.65 1.65 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                        />
                      </svg>
                    </button>
                    <StarButton
                      domain={u.domain}
                      active={isFavorite(u.domain)}
                      label={
                        isFavorite(u.domain)
                          ? `Remove ${u.name} from favorites`
                          : `Add ${u.name} to favorites`
                      }
                      onClick={() => onToggleFavorite(u.domain)}
                    />
                    <a
                      href={u.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${u.name} website`}
                      className="grid place-items-center rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4a2.25 2.25 0 0 1-2.25 2.25h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h4a.75.75 0 0 1 0 1.5h-4Z" />
                        <path d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z" />
                      </svg>
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableView;
