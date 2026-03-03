import { cn } from "../lib/cn";

const sizes = {
  sm: { ring: "h-4 w-4", dot: "h-2 w-2" },
  md: { ring: "h-5 w-5", dot: "h-2.5 w-2.5" },
  lg: { ring: "h-6 w-6", dot: "h-3 w-3" },
};

function RadioItem({
  name,
  value,
  checked,
  onChange,
  label,
  disabled,
  size = "md",
  className,
  labelClassName,
  inputClassName,
}) {
  const s = sizes[size] || sizes.md;

  return (
    <label
      className={cn(
        "inline-flex items-center gap-3 select-none",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        className={cn("sr-only peer", inputClassName)}
        checked={checked}
        onChange={() => onChange?.(value)}
        disabled={disabled}
      />

      <span
        aria-hidden="true"
        className={cn(
          "shrink-0 rounded-full border flex items-center justify-center",
          s.ring,
          "border-[#D1D5DB] bg-white",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-black/20 peer-focus-visible:ring-offset-2",
          "peer-checked:border-[#111827]"
        )}
      >
        <span
          className={cn(
            "rounded-full bg-[#111827]",
            s.dot,
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

export default function RadioGroup({
  name,
  value,
  onChange,
  options = [],
  size = "md",
  disabled = false,
  direction = "row",
  className,
  itemClassName,
}) {
  return (
    <div
      className={cn(
        direction === "column" ? "flex flex-col gap-3" : "flex flex-wrap gap-10",
        className
      )}
    >
      {options.map((opt) => {
        const o =
          typeof opt === "string"
            ? { value: opt, label: opt }
            : { value: opt.value, label: opt.label };

        return (
          <RadioItem
            key={o.value}
            name={name}
            value={o.value}
            checked={String(value) === String(o.value)}
            onChange={onChange}
            label={o.label}
            disabled={disabled}
            size={size}
            className={itemClassName}
          />
        );
      })}
    </div>
  );
}
