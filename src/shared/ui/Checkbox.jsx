import { cn } from "../lib/cn";

const sizes = {
  sm: { box: "h-[16px] w-[16px]", icon: "h-3 w-3" },
  md: { box: "h-[18px] w-[18px]", icon: "h-3.5 w-3.5" },
  lg: { box: "h-[20px] w-[20px]", icon: "h-4 w-4" },
};

const variants = {
  // Red filled when checked (if you need elsewhere)
  brand: {
    boxBase: "border-[#D1D5DB] bg-white",
    boxChecked: "peer-checked:border-[#D66355] peer-checked:bg-[#D66355]",
    ring: "peer-focus-visible:ring-[#D66355]/30",
    icon: "text-white",
  },

  // ✅ Figma style: outline square, NOT filled. Checkmark appears when checked.
  ink: {
    boxBase: "border-[#111827] bg-white",
    boxChecked: "peer-checked:border-[#111827] peer-checked:bg-white",
    ring: "peer-focus-visible:ring-black/20",
    icon: "text-[#111827]",
  },
};

function CheckIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function Checkbox({
  checked,
  defaultChecked,
  onChange,
  label,
  id,
  name,
  disabled = false,
  size = "md",
  variant = "ink",
  className,
  boxClassName,
  labelClassName,
  inputClassName,
  ...props
}) {
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.ink;

  return (
    <label
      className={cn(
        // ✅ block-level so lists stack vertically (fixes your “row wrap” issue)
        "flex w-full items-center gap-3 select-none",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className
      )}
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        className={cn("sr-only peer", inputClassName)}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />

      <span
        aria-hidden="true"
        className={cn(
          "grid place-items-center shrink-0 border",
          s.box,
          "rounded-[4px]",
          v.boxBase,
          v.boxChecked,
          "peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2",
          v.ring,
          boxClassName
        )}
      >
        {/* ✅ checkmark only when checked */}
        <CheckIcon
          className={cn(
            s.icon,
            v.icon,
            "opacity-0 peer-checked:opacity-100"
          )}
        />
      </span>

      {label ? (
        <span className={cn("text-sm text-[#111827]", labelClassName)}>
          {label}
        </span>
      ) : null}
    </label>
  );
}