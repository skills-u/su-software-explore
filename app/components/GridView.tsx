import React, { useCallback } from "react";
import { University } from "@/app/lib/types";
import UniversityCard from "./University/UniversityCard";

function GridView({
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
  const handleGridClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-domain]",
      );
      if (!el) return;
      const domain = el.dataset.domain!;
      if (el.dataset.action === "favorite") {
        onToggleFavorite(domain);
        return;
      }
      const uni = rows.find((u) => u.domain === domain);
      if (uni) {
        el.focus(); // ensure focus is on the trigger so the modal can restore it
        onOpen(uni);
      }
    },
    [rows, onOpen, onToggleFavorite],
  );

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

  return (
    <div
      onClick={handleGridClick}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {rows.map((u, i) => (
        <UniversityCard
          key={`${u.name}-${u.domain}`}
          university={u}
          index={i}
          isFavorite={isFavorite(u.domain)}
        />
      ))}
    </div>
  );
}

export default GridView;
