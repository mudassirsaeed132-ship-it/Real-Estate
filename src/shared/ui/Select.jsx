import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

const sizes = {
  sm: "h-10",
  md: "h-12",
  lg: "h-14",
};

export default function Select({
  value,
  defaultValue,
  onChange,
  options = [],
  placeholder = "",
  size = "md",
  className,
  selectClassName,
  iconClassName,
  disabled = false,
  ...props
}) {
  const h = sizes[size] || sizes.md;

  const normalized = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );

  return (
    <div className={cn("relative", className)}>
      <select
        className={cn(
          "w-full appearance-none rounded-xl border border-[#EDEDED] bg-white px-4 pr-10 text-sm text-[#111827] outline-none",
          "focus:border-[#D66355]",
          disabled ? "opacity-60 cursor-not-allowed" : "",
          h,
          selectClassName
        )}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {normalized.map((o) => (
          <option key={String(o.value)} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <ChevronDown
        className={cn(
          "pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]",
          iconClassName
        )}
      />
    </div>
  );
}
