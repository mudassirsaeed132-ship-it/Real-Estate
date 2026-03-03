// src/widgets/header/HeaderSearch.jsx
import { Search, SlidersHorizontal } from "lucide-react";
import Input from "../../shared/ui/Input";
import IconButton from "../../shared/ui/IconButton";

export default function HeaderSearch({ showCta = false }) {
  return (
    <div className="flex w-full min-w-0 items-center gap-2">
      <div className="relative flex-1 min-w-0">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
        <Input
          className="w-full min-w-0 pl-9 h-10 sm:h-11"
          placeholder="Find Cars, Mobile Phones and more..."
        />
      </div>

      {/* Desktop CTA button (only when requested) */}
      {showCta ? (
        <button
          type="button"
          className="shrink-0 h-10 sm:h-11 items-center gap-2 rounded-xl bg-[#D66355] px-5 text-sm font-medium text-white transition hover:bg-[#C85A4E] inline-flex"
          onClick={() => alert("Search (dummy)")}
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      ) : null}

      <IconButton
        className="shrink-0 h-10 w-10 sm:h-11 sm:w-11 rounded-xl"
        aria-label="Filters"
        onClick={() => alert("Open filters (dummy)")}
      >
        <SlidersHorizontal className="h-5 w-5 text-[#D66355]" />
      </IconButton>
    </div>
  );
}