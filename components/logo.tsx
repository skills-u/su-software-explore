import { useMemo, useState} from "react"
import { initials, gradientFor } from "@/lib/utils"

export function Logo({
  university,
  size = 'md',
}: {
  university: University
  size?: 'sm' | 'md'
}) {
  const sources = useMemo(() => {
    if (!university.domain) return [] as string[]
    return [
      `https://www.google.com/s2/favicons?domain=${university.domain}&sz=128`,
    ]
  }, [university.domain])

  const [idx, setIdx] = useState(0)
  const src = sources[idx]

  const roundedClass = size === 'sm' ? 'rounded-lg' : 'rounded-xl'
  const sizeClass =
    size === 'sm' ? 'h-9 w-9 text-sm' : 'h-14 w-14 text-lg'

  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden bg-gradient-to-br ${!src && gradientFor(university.name)} shadow-inner ${roundedClass} ${sizeClass}`}
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
          onLoad={(e) => {
            // Google's favicon service returns a generic globe icon (tiny,
            // regardless of the requested sz) when no real favicon exists.
            const img = e.currentTarget
            if (img.naturalWidth > 0 && img.naturalWidth <= 16) {
              setIdx((i) => i + 1)
            }
          }}
          className={`absolute inset-0 h-full w-full bg-white object-contain p-1 object-center ${roundedClass}`}
        />
      )}
    </div>
  )
}