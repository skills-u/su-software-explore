import React, { useEffect, useRef } from "react";
import { University } from "@/app/lib/types";
import Logo from "./Logo";
import StarButton from "../StarButton";

function UniversityModal({
  university,
  onClose,
  isFavorite,
  onToggleFavorite,
}: {
  university: University;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (domain: string) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const focusables = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    focusables()[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const items = focusables();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div
      data-testid="modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start gap-4">
          <Logo university={university} />
          <div className="min-w-0 flex-1">
            <h2
              id="modal-title"
              className="text-xl font-extrabold leading-snug text-slate-900"
            >
              {university.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {university.state ?? "United States"}
            </p>
          </div>
          <StarButton
            domain={university.domain}
            active={isFavorite}
            label={
              isFavorite
                ? `Remove ${university.name} from favorites`
                : `Add ${university.name} to favorites`
            }
            className="shrink-0"
            onClick={() => onToggleFavorite(university.domain)}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <dl className="mt-6 space-y-3 border-t border-slate-100 pt-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Domain</dt>
            <dd className="truncate font-mono text-slate-700">
              {university.domain}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Location</dt>
            <dd className="text-slate-700">
              {university.state ?? "United States"}
            </dd>
          </div>
        </dl>

        <a
          href={university.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Visit website
        </a>
      </div>
    </div>
  );
}

export default UniversityModal;
