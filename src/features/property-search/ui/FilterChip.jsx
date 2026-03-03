import { X } from "lucide-react";

export default function FilterChip({ label, onRemove }) {
  return (
    <button
      onClick={onRemove}
      className="inline-flex items-center gap-2 rounded-full border border-[#EDEDED] bg-white px-3 py-2 text-sm text-[#111827] shadow-sm hover:bg-black/5"
      type="button"
    >
      <span>{label}</span>
      <X className="h-4 w-4 text-[#6B7280]" />
    </button>
  );
}
