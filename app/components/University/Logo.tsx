import { University } from "@/app/lib/types";
import React, { useMemo, useState } from "react";

const GRADIENTS = [
  "from-indigo-500 to-violet-500",
  "from-violet-500 to-fuchsia-500",
  "from-sky-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-cyan-500 to-blue-500",
  "from-fuchsia-500 to-purple-500",
] as const;

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function gradientFor(name: string): string {
  return GRADIENTS[hashString(name) % GRADIENTS.length];
}

function initials(name: string): string {
  const stop = new Set(["of", "the", "and", "at", "for", "de", "in", "a"]);
  const words = name
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const significant = words.filter((w) => !stop.has(w.toLowerCase()));
  const pick = significant.length ? significant : words;
  const letters = pick
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  return letters || name.slice(0, 2).toUpperCase();
}

function Logo({
  university,
  size = "md",
}: {
  university: University;
  size?: "sm" | "md";
}) {
  // Try a crisp brand logo first, then a favicon, then fall back to initials.
  const sources = useMemo(() => {
    if (!university.domain) return [] as string[];
    return [
      `https://logo.clearbit.com/${university.domain}`,
      `https://www.google.com/s2/favicons?domain=${university.domain}&sz=128`,
    ];
  }, [university.domain]);
  const [idx, setIdx] = useState(0);
  const src = sources[idx];
  const box = size === "sm" ? "h-9 w-9 text-xs" : "h-14 w-14 text-lg";

  return (
    <div
      className={`relative grid ${box} shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br ${gradientFor(
        university.name,
      )} shadow-inner`}
    >
      <span className="select-none font-bold tracking-tight text-white">
        {initials(university.name)}
      </span>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={`${university.name} logo`}
          loading="lazy"
          onError={() => setIdx((i) => i + 1)}
          className="absolute inset-0 h-full w-full bg-white object-contain p-1.5"
        />
      )}
    </div>
  );
}

export default Logo;
