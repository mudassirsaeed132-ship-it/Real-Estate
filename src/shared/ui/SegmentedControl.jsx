import { cn } from "../lib/cn";

const attachedSizes = {
  md: { wrap: "h-10 p-1", btn: "h-8 w-8", radius: "rounded-xl", btnRadius: "rounded-lg" }, // ✅ compact
  lg: { wrap: "h-11 p-1.5", btn: "h-9 w-9", radius: "rounded-[14px]", btnRadius: "rounded-[12px]" },
};

const separateSizes = {
  md: "h-10 w-10",
  lg: "h-11 w-11",
};

/**
 * variant:
 * - "attached"  => one combined container (Figma style)
 * - "separate"  => two separate buttons (fallback)
 *
 * NOTE: attached variant does NOT auto-change backgrounds on active.
 * You control each option's background via `option.buttonClassName`.
 */
export default function SegmentedControl({
  value,
  onChange,
  options = [],
  size = "md",
  variant = "attached",
  className = "",
  containerClassName = "",
}) {
  if (variant === "attached") {
    const s = attachedSizes[size] || attachedSizes.md;

    return (
      <div
        className={cn(
          "inline-flex items-center gap-1 border border-[#EDEDED] bg-white shadow-sm",
          s.wrap,
          s.radius,
          className,
          containerClassName
        )}
      >
        {options.map((opt) => {
          const active = opt.value === value;

          return (
            <button
              key={opt.value}
              type="button"
              aria-label={opt.ariaLabel || String(opt.value)}
              aria-pressed={active}
              onClick={() => onChange?.(opt.value)}
              className={cn(
                "grid place-items-center transition",
                s.btn,
                s.btnRadius,
                // ✅ NO auto active background change (fix your issue)
                "hover:opacity-95",
                opt.buttonClassName
              )}
            >
              {opt.icon}
            </button>
          );
        })}
      </div>
    );
  }

  // fallback: separate
  const btnSize = separateSizes[size] || separateSizes.md;

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {options.map((opt) => {
        const active = opt.value === value;

        return (
          <button
            key={opt.value}
            type="button"
            aria-label={opt.ariaLabel || String(opt.value)}
            onClick={() => onChange?.(opt.value)}
            className={cn(
              "inline-flex items-center justify-center rounded-xl border transition",
              btnSize,
              active
                ? "border-[#D66355] bg-[#D66355] text-white"
                : "border-[#EDEDED] bg-white text-[#6B7280] hover:bg-black/5"
            )}
          >
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
}