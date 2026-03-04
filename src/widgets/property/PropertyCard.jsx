// PATH: src/widgets/property/PropertyCard.jsx
import { useMemo, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "../../shared/lib/cn";
import PropertyBadges from "../../entities/property/ui/PropertyBadges";
import PropertyStatsRow from "../../entities/property/ui/PropertyStatsRow";
import locationIcon from "../../assets/icons/property/location.svg";

//  compare
import {
  useCompareStore,
  compareActions,
} from "../../features/property-compare/model/compareStore";
import CompareSelectIndicator from "../../features/property-compare/ui/CompareSelectIndicator";

function CardImageCarousel({ images, title, idx, dir, onPrev, onNext, children }) {
  const reduceMotion = useReducedMotion();
  const total = images.length || 0;
  const current = images[idx] || images[0];

  //  Prefetch next/prev for smoother arrow switching
  useEffect(() => {
    if (total < 2) return;
    const nextSrc = images[(idx + 1) % total];
    const prevSrc = images[(idx - 1 + total) % total];
    [nextSrc, prevSrc].filter(Boolean).forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  }, [idx, images, total]);

  const variants = {
    enter: (d) =>
      reduceMotion
        ? { opacity: 0 }
        : { opacity: 0, x: d > 0 ? 18 : -18, scale: 1.003 },
    center: reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 },
    exit: (d) =>
      reduceMotion
        ? { opacity: 0 }
        : { opacity: 0, x: d > 0 ? -18 : 18, scale: 0.997 },
  };

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.16, ease: [0.16, 1, 0.3, 1] };

  return (
    <div className="relative">
      <div className="aspect-[4/3] w-full bg-[#F3F4F6]">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          {current ? (
            <motion.img
              key={current}
              src={current}
              alt={title}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
              draggable={false}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
            />
          ) : null}
        </AnimatePresence>
      </div>

      {/* overlays (badges + fav/compare indicator etc.) */}
      {children}

      {/* Arrows (only when >1 image) */}
      {total > 1 ? (
        <>
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-3 top-[68%] -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm opacity-0 transition group-hover:opacity-100"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4 text-[#111827]" />
          </button>

          <button
            type="button"
            onClick={onNext}
            className="absolute right-3 top-[68%] -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm opacity-0 transition group-hover:opacity-100"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4 text-[#111827]" />
          </button>
        </>
      ) : null}
    </div>
  );
}

export default function PropertyCard({ property, initialFav = false }) {
  const images = useMemo(() => property.images?.filter(Boolean) || [], [property]);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1); //  1 next, -1 prev (for animation direction)
  const [fav, setFav] = useState(Boolean(initialFav));

  const compareEnabled = useCompareStore((s) => s.enabled);
  const selectedIds = useCompareStore((s) => s.selectedIds);

  //  keep idx valid if images change
  useEffect(() => {
    if (!images.length) return;
    if (idx >= images.length) setIdx(0);
  }, [images, idx]);

  const isSelected = useMemo(
    () => selectedIds.some((id) => String(id) === String(property.id)),
    [selectedIds, property.id]
  );

  //  keep compare payload small + consistent
  const compareItem = useMemo(
    () => ({
      id: property.id,
      title: property.title,
      address: property.address,
      images: images,
      bedsText: property.bedsText,
      areaText: property.areaText,
      priceText: property.priceText || property.priceLabel || property.price,
      purpose: property.purpose,
      lat: property.lat,
      lng: property.lng,
      badges: property.badges,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      property.id,
      property.title,
      property.address,
      property.bedsText,
      property.areaText,
      property.priceText,
      property.priceLabel,
      property.price,
      property.purpose,
      property.lat,
      property.lng,
      JSON.stringify(property.badges),
      images,
    ]
  );

  const toggleCompare = useCallback(() => {
    compareActions.toggle(compareItem);
  }, [compareItem]);

  const prev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length < 2) return;
    setDir(-1);
    setIdx((v) => (v - 1 + images.length) % images.length);
  };

  const next = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length < 2) return;
    setDir(1);
    setIdx((v) => (v + 1) % images.length);
  };

  const toggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFav((v) => !v);
  };

  const onChat = (e) => {
    e.preventDefault();
    e.stopPropagation();
    alert("Chat (dummy)");
  };

  const onBook = (e) => {
    e.preventDefault();
    e.stopPropagation();
    alert("Book Visit (dummy)");
  };

  const onPrecheck = (e) => {
    e.preventDefault();
    e.stopPropagation();
    alert("Pre-check (dummy)");
  };

  const cardClass = cn(
    "group block overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md",
    isSelected ? "border-[#D66355]" : "border-[#EDEDED]"
  );

  //  Compare mode: whole card toggles selection (no navigation)
  if (compareEnabled) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={toggleCompare}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleCompare();
          }
        }}
        className={cardClass}
      >
        <CardImageCarousel
          images={images}
          title={property.title}
          idx={idx}
          dir={dir}
          onPrev={prev}
          onNext={next}
        >
          <PropertyBadges badges={property.badges} />

          {/*  Compare selection indicator */}
          <CompareSelectIndicator
            selected={isSelected}
            onToggle={toggleCompare}
            className="absolute right-3 top-3"
          />
        </CardImageCarousel>

        <div className="p-4">
          <h3 className="text-[15px] font-semibold text-[#111827]">{property.title}</h3>

          <div className="mt-2 flex items-center gap-2 text-sm text-[#6B7280]">
            <img src={locationIcon} alt="" className="h-4 w-4" />
            <span className="line-clamp-1">{property.address}</span>
          </div>

          <PropertyStatsRow bedsText={property.bedsText} areaText={property.areaText} />
        </div>
      </div>
    );
  }

  //  Normal mode: Link to detail
  return (
    <Link to={`/properties/${property.id}`} className={cardClass}>
      <CardImageCarousel
        images={images}
        title={property.title}
        idx={idx}
        dir={dir}
        onPrev={prev}
        onNext={next}
      >
        <PropertyBadges badges={property.badges} />

        {/* Favorite */}
        <button
          type="button"
          onClick={toggleFav}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-black/5"
          aria-label="Favorite"
        >
          <Heart
            className={cn(
              "h-4 w-4",
              fav ? "fill-[#D66355] text-[#D66355]" : "text-[#D66355]"
            )}
          />
        </button>
      </CardImageCarousel>

      <div className="p-4">
        <h3 className="text-[15px] font-semibold text-[#111827]">{property.title}</h3>

        <div className="mt-2 flex items-center gap-2 text-sm text-[#6B7280]">
          <img src={locationIcon} alt="" className="h-4 w-4" />
          <span className="line-clamp-1">{property.address}</span>
        </div>

        <PropertyStatsRow bedsText={property.bedsText} areaText={property.areaText} />

        {/* Bottom actions */}
        <div className="mt-4 grid grid-cols-3 divide-x divide-[#EDEDED] overflow-hidden rounded-xl border border-[#EDEDED] text-center text-[12px] text-[#D66355]">
          <button type="button" onClick={onChat} className="py-2 hover:bg-black/5">
            Chat
          </button>
          <button type="button" onClick={onBook} className="py-2 hover:bg-black/5">
            Book Visit
          </button>
          <button type="button" onClick={onPrecheck} className="py-2 hover:bg-black/5">
            Pre check
          </button>
        </div>
      </div>
    </Link>
  );
}