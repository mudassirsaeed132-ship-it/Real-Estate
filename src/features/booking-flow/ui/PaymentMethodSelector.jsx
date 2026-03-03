import { cn } from "../../../shared/lib/cn";

/**
 * UI-matching radio style.
 * For pixel-perfect brand logos, add:
 * - src/assets/icons/payments/gpay.svg
 * - src/assets/icons/payments/stripe.svg
 * - src/assets/icons/payments/applepay.svg
 * Then I’ll swap text to images.
 */
export default function PaymentMethodSelector({ value, onChange }) {
  const options = [
    { key: "gpay", label: "G Pay", tone: "text-[#111827]" },
    { key: "stripe", label: "stripe", tone: "text-[#4F46E5]" },
    { key: "applepay", label: "Pay", tone: "text-[#111827]" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-10">
      {options.map((o) => {
        const active = value === o.key;
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange?.(o.key)}
            className="inline-flex items-center gap-3"
          >
            <span
              className={cn(
                "h-4 w-4 rounded-full border flex items-center justify-center",
                active ? "border-[#D66355]" : "border-[#D1D5DB]"
              )}
            >
              {active ? <span className="h-2 w-2 rounded-full bg-[#D66355]" /> : null}
            </span>

            <span className={cn("text-[15px] font-semibold", o.tone)}>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
