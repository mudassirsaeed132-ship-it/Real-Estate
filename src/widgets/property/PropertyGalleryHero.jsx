// src/widgets/property/PropertyGalleryHero.jsx
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../shared/lib/cn";

export default function PropertyGalleryHero({
  images = [],
  className = "",
  heightClassName = "h-[240px] sm:h-[360px] lg:h-[520px] xl:h-[560px] 2xl:h-[600px]",
}) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const total = safeImages.length || 1;

  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((v) => (v - 1 + total) % total);
  const next = () => setIdx((v) => (v + 1) % total);

  const activeSrc = safeImages[idx] || safeImages[0];

  return (
    <div
      className={cn(
        // ✅ Full-bleed image container (no inner border/bg so image truly "covers")
        "relative w-full overflow-hidden",
        className
      )}
    >
      <div className={cn("relative w-full", heightClassName)}>
        {activeSrc ? (
          <img
            src={activeSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 bg-black/5" />
        )}

        {/* Counter (top-right) */}
        <div className="absolute right-5 top-5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
          {idx + 1}/{total}
        </div>

        {/* Arrows (match Figma: bigger circle + subtle ring) */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous"
          className={cn(
            "absolute left-6 top-1/2 -translate-y-1/2",
            "grid h-11 w-11 place-items-center rounded-full bg-white/95",
            "shadow-md ring-1 ring-black/5 hover:bg-white"
          )}
        >
          <ChevronLeft className="h-5 w-5 text-[#111827]" />
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next"
          className={cn(
            "absolute right-6 top-1/2 -translate-y-1/2",
            "grid h-11 w-11 place-items-center rounded-full bg-white/95",
            "shadow-md ring-1 ring-black/5 hover:bg-white"
          )}
        >
          <ChevronRight className="h-5 w-5 text-[#111827]" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(total, 7) }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                className={cn(
                  "h-1.5 w-7 rounded-full",
                  i === idx ? "bg-white" : "bg-white/45"
                )}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}