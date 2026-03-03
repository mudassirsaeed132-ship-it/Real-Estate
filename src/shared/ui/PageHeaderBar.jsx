// PATH: src/shared/ui/PageHeaderBar.jsx
import { ChevronLeft } from "lucide-react";
import { cn } from "../lib/cn";

export default function PageHeaderBar({ title, onBack, right, className = "" }) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-3 min-w-0">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5 text-[#D66355]" />
          </button>
        ) : null}

        <div className="text-[26px] font-semibold text-[#D66355] truncate">
          {title}
        </div>
      </div>

      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}