// src/widgets/property/PropertyGalleryHero.jsx
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "../../shared/lib/cn";

export default function PropertyGalleryHero({
  images = [],
  className = "",
  heightClassName = "h-[240px] sm:h-[360px] lg:h-[520px] xl:h-[560px] 2xl:h-[600px]",
}) {
  const reduceMotion = useReducedMotion();
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const total = safeImages.length || 1;

  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1); // ✅ 1 = next, -1 = prev

  const prev = () => {
    setDir(-1);
    setIdx((v) => (v - 1 + total) % total);
  };

  const next = () => {
    setDir(1);
    setIdx((v) => (v + 1) % total);
  };

  const goTo = (i) => {
    if (i === idx) return;
    setDir(i > idx ? 1 : -1);
    setIdx(i);
  };

  const activeSrc = safeImages[idx] || safeImages[0];

  // ✅ prefetch next/prev for smooth arrows
  useEffect(() => {
    if (!safeImages.length) return;
    const nextSrc = safeImages[(idx + 1) % total];
    const prevSrc = safeImages[(idx - 1 + total) % total];
    [nextSrc, prevSrc].filter(Boolean).forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  }, [idx, safeImages, total]);

  const variants = {
    enter: (d) =>
      reduceMotion
        ? { opacity: 0 }
        : { opacity: 0, x: d > 0 ? 28 : -28, scale: 1.005 },
    center: reduceMotion
      ? { opacity: 1 }
      : { opacity: 1, x: 0, scale: 1 },
    exit: (d) =>
      reduceMotion
        ? { opacity: 0 }
        : { opacity: 0, x: d > 0 ? -28 : 28, scale: 0.995 },
  };

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: [0.16, 1, 0.3, 1] };

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div className={cn("relative w-full", heightClassName)}>
        {/* ✅ Animated image layer */}
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          {activeSrc ? (
            <motion.img
              key={activeSrc}
              src={activeSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
              decoding="async"
              loading="eager"
              fetchPriority="high"
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
            />
          ) : (
            <div className="absolute inset-0 bg-black/5" />
          )}
        </AnimatePresence>

        {/* Counter */}
        <div className="absolute right-5 top-5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
          {idx + 1}/{total}
        </div>

        {/* Arrows */}
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
                onClick={() => goTo(i)}
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