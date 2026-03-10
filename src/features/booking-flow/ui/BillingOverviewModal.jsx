import { X } from "lucide-react";
import Modal from "../../../shared/ui/Modal";
import Button from "../../../shared/ui/Button";
import { cn } from "../../../shared/lib/cn";

function ordinal(n) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  const last = n % 10;
  if (last === 1) return `${n}st`;
  if (last === 2) return `${n}nd`;
  if (last === 3) return `${n}rd`;
  return `${n}th`;
}

function fmtDateUI(d) {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return "";

  const month = date.toLocaleString("en-US", { month: "long" });
  const day = ordinal(date.getDate());
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

export default function BillingOverviewModal({ open, onClose, overview }) {
  const stay = overview?.stay || {};
  const breakdown = overview?.breakdown || [];
  const total = overview?.totalFormatted || "$222.5$";

  return (
    <Modal
      open={open}
      onClose={onClose}
      //  smaller + responsive like Figma
      size="md"
      height="normal"
      overlayClassName="bg-black/40"
      panelClassName="max-w-[920px] rounded-2xl"
      bodyClassName="px-7 pb-7 pt-5"
      closeOnOverlay
      header={
        <div className="px-7 pt-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[32px] font-semibold leading-[1.1] text-[#111827]">
                Billing Overview
              </div>
              <div className="mt-2 text-[16px] text-[#9CA3AF]">
                Review your booking details and complete payment
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-black/5"
            >
              <X className="h-5 w-5 text-[#111827]" />
            </button>
          </div>
        </div>
      }
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-12 rounded-2xl border-2 border-[#D66355] px-10 text-[16px] font-semibold text-[#D66355] hover:bg-[#D66355]/10"
          >
            Back
          </Button>

          <Button
            onClick={() => {
              alert("Pay (dummy)");
              onClose?.();
            }}
            className="h-12 rounded-2xl bg-[#D66355] px-10 text-[16px] font-semibold text-white hover:bg-[#C85A4E]"
          >
            Pay {total}
          </Button>
        </div>
      }
    >
      {/* Stay details box */}
      <div className="rounded-2xl bg-[#F6F6F6] px-7 py-6">
        <div className="text-[22px] font-semibold text-[#111827]">
          Stay Details
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="space-y-2 text-[14px] text-[#A3A3A3]">
            <div>Check-in:</div>
            <div>Check-out:</div>
            <div>Total nights:</div>
          </div>

          <div className="space-y-2 text-right text-[14px] text-[#111827]">
            <div>{stay.checkIn ? fmtDateUI(stay.checkIn) : "February 19th, 2026"}</div>
            <div>{stay.checkOut ? fmtDateUI(stay.checkOut) : "February 20th, 2026"}</div>
            <div>{stay.nightsLabel || "1 night"}</div>
          </div>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="mt-6">
        <div className="text-[22px] font-semibold text-[#111827]">
          Price Breakdown
        </div>

        <div className="mt-4 space-y-3">
          {breakdown.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 text-[14px]"
            >
              <div className={cn(row.muted ? "text-[#9CA3AF]" : "text-[#111827]")}>
                {row.label}
              </div>
              <div className="text-[#111827]">{row.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 h-px bg-[#E5E7EB]" />

        <div className="mt-5 flex items-center justify-between gap-4 text-[14px]">
          <div className="text-[#111827]">{overview?.totalLabel || "Total (USD)"}</div>
          <div className="text-[#111827]">{total}</div>
        </div>
      </div>
    </Modal>
  );
}