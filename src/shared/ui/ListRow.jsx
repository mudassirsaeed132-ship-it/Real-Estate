// PATH: src/shared/ui/ListRow.jsx
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

export default function ListRow({
  left,
  title,
  subtitle,
  right,
  onClick,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-2xl border border-[#EDEDED] bg-white",
        "px-4 py-3 sm:px-5 sm:py-4",
        "flex items-center gap-3",
        "hover:bg-black/2",
        className
      )}
    >
      {left ? <div className="shrink-0">{left}</div> : null}

      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold text-[#111827] truncate">
          {title}
        </div>
        {subtitle ? (
          <div className="mt-1 text-[12px] text-[#D66355]">{subtitle}</div>
        ) : null}
      </div>

      <div className="shrink-0 flex items-center gap-2">
        {right ? <div className="text-[12px] text-[#6B7280]">{right}</div> : null}
        <ChevronRight className="h-4 w-4 text-[#6B7280]" />
      </div>
    </button>
  );
}