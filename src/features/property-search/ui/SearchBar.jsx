import { Search, SlidersHorizontal } from "lucide-react";
import Input from "../../../shared/ui/Input";
import IconButton from "../../../shared/ui/IconButton";

export default function SearchBar({ value, onChange, onOpenFilters }) {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="relative w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
        <Input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="pl-9"
          placeholder="Search by city, area or property..."
        />
      </div>

      <IconButton
        className="h-10 w-10"
        aria-label="Open filters"
        onClick={onOpenFilters}
        type="button"
      >
        <SlidersHorizontal className="h-5 w-5 text-[#D66355]" />
      </IconButton>
    </div>
  );
}
