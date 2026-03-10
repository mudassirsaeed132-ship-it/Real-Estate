// PATH: src/widgets/map/MapPropertyPopover.jsx
import { useCallback, useMemo } from "react";
import { cn } from "../../shared/lib/cn";
import {
  compareActions,
  useCompareStore,
} from "../../features/property-compare/model/compareStore";
import CompareSelectIndicator from "../../features/property-compare/ui/CompareSelectIndicator";

export default function MapPropertyPopover({ item }) {
  const compareEnabled = useCompareStore((s) => s.enabled);
  const selectedIds = useCompareStore((s) => s.selectedIds);

  const isSelected = selectedIds.some((id) => String(id) === String(item.id));

  // keep payload consistent with PropertyCard
  const compareItem = useMemo(
    () => ({
      id: item.id,
      title: item.title,
      address: item.address,
      images: item.images?.filter(Boolean) || [],
      bedsText: item.bedsText,
      areaText: item.areaText,
      priceText: item.priceText || item.priceLabel || item.price,
      purpose: item.purpose,
      lat: item.lat,
      lng: item.lng,
      badges: item.badges,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      item.id,
      item.title,
      item.address,
      item.bedsText,
      item.areaText,
      item.priceText,
      item.priceLabel,
      item.price,
      item.purpose,
      item.lat,
      item.lng,
      JSON.stringify(item.badges),
      JSON.stringify(item.images),
    ]
  );

  const toggle = useCallback(() => {
    compareActions.toggle(compareItem);
  }, [compareItem]);

  return (
    <div
      className={cn(
        "relative w-65 overflow-hidden rounded-2xl bg-white",
        isSelected ? "ring-2 ring-[#D66355]" : "ring-1 ring-[#EDEDED]"
      )}
      //  whole card toggles in compare mode
      onClick={compareEnabled ? toggle : undefined}
      role={compareEnabled ? "button" : undefined}
      tabIndex={compareEnabled ? 0 : -1}
      onKeyDown={
        compareEnabled
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle();
              }
            }
          : undefined
      }
    >
      {compareEnabled ? (
        <CompareSelectIndicator
          selected={isSelected}
          onToggle={toggle}
          className="absolute right-3 top-3"
        />
      ) : null}

      <div className="h-35 w-full overflow-hidden rounded-2xl bg-[#F3F4F6]">
        {item.images?.[0] ? (
          <img
            src={item.images[0]}
            alt={item.title}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : null}
      </div>

      <div className="px-3 pb-3 pt-3">
        <div className="text-[15px] font-semibold text-[#111827]">
          {item.title}
        </div>
        <div className="mt-1 text-[12px] text-[#6B7280]">{item.address}</div>

        <div className="mt-3 flex items-center gap-3 text-[12px] text-[#6B7280]">
          <span>{item.bedsText}</span>
          <span>•</span>
          <span>{item.areaText}</span>
        </div>
      </div>
    </div>
  );
}