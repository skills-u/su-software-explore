import { University } from "@/app/lib/types";
import React from "react";
import Logo from "./Logo";
import StarButton from "../StarButton";

function UniversityCard({
  university,
  index,
  isFavorite,
}: {
  university: University;
  index: number;
  isFavorite: boolean;
}) {
  return (
    <div
      style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
      className="group relative animate-fade-up rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100"
    >
      <StarButton
        domain={university.domain}
        active={isFavorite}
        label={
          isFavorite
            ? `Remove ${university.name} from favorites`
            : `Add ${university.name} to favorites`
        }
        className="absolute right-2 top-2 z-10 bg-white/70 backdrop-blur-sm"
      />
      <button
        type="button"
        data-domain={university.domain}
        aria-label={`View details for ${university.name}`}
        className="flex w-full flex-col rounded-2xl p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        <div className="flex items-start gap-4">
          <Logo university={university} />
          <div className="min-w-0 flex-1 pr-8">
            <h3 className="line-clamp-2 font-semibold leading-snug text-slate-900 group-hover:text-indigo-600">
              {university.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {university.state ?? "United States"}
            </p>
          </div>
        </div>
        <div className="mt-4 w-full border-t border-slate-100 pt-3">
          <span className="truncate font-mono text-xs text-slate-400">
            {university.domain}
          </span>
        </div>
      </button>
    </div>
  );
}

export default UniversityCard;
