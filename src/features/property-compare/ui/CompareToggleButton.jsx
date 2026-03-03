
// PATH: src/features/property-compare/ui/CompareToggleButton.jsx
import { ArrowLeftRight } from "lucide-react";
import { cn } from "../../../shared/lib/cn";
import { compareActions, COMPARE_LIMIT, useCompareStore } from "../model/compareStore";

export default function CompareToggleButton({ className = "" }) {
  const enabled = useCompareStore((s) => s.enabled);
  const selectedIds = useCompareStore((s) => s.selectedIds);

  const count = selectedIds?.length || 0;

  const onClick = () => {
    // If compare OFF but we have selections, open manage modal
    if (!enabled && count > 0) {
      compareActions.openSelectionModal();
      return;
    }
    // If compare OFF and no selections, show start modal
    if (!enabled && count === 0) {
      compareActions.openStartModal();
      return;
    }
    // If compare ON, open selection modal
    compareActions.openSelectionModal();
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
        enabled || count > 0
          ? "border-[#D66355] bg-[#D66355] text-white"
          : "border-[#EDEDED] bg-white text-[#111827] hover:bg-black/5",
        className
      )}
    >
      <ArrowLeftRight className="h-4 w-4" />
      <span>Compare</span>
      <span className={cn("rounded-full px-2 py-0.5 text-xs", enabled || count > 0 ? "bg-white/20" : "bg-black/5")}>
        {count}/{COMPARE_LIMIT}
      </span>
    </button>
  );
}