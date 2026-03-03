// PATH: src/features/property-compare/ui/CompareSelectIndicator.jsx
import { Check } from "lucide-react";
import { cn } from "../../../shared/lib/cn";

export default function CompareSelectIndicator({
  selected,
  onToggle,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle?.();
      }}
      className={cn(
        "grid h-7 w-7 place-items-center rounded-full border transition",
        selected
          ? "border-[#D66355] bg-[#D66355] text-white shadow-sm"
          : "border-[#E5E7EB] bg-white text-transparent shadow-sm hover:bg-black/5",
        className
      )}
      aria-label={selected ? "Unselect property" : "Select property"}
    >
      <Check className="h-4 w-4" />
    </button>
  );
}
