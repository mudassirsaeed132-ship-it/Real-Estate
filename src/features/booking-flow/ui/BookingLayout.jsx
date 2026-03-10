import { useMemo } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Upload, MapPin } from "lucide-react";
import { cn } from "../../../shared/lib/cn";

import PaymentMethodSelector from "./PaymentMethodSelector";
import OfferApplicationForm from "./OfferApplicationForm";

/* ---------- helpers (UI-only) ---------- */
function monthName(m) {
  return [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ][m];
}

function getMonthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const startDay = (first.getDay() + 6) % 7; // Monday=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  while (cells.length < 42) cells.push(null);

  const weeks = [];
  for (let i = 0; i < 42; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function CalendarPanel({
  label,
  year,
  month,
  onPrev,
  onNext,
  selected,
  onSelect,
}) {
  const weeks = useMemo(() => getMonthMatrix(year, month), [year, month]);
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="grid h-10 w-10 place-items-center rounded-xl border border-[#EDEDED] bg-white hover:bg-black/5"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5 text-[#6B7280]" />
        </button>

        <div className="text-center">
          <div className="text-[22px] font-semibold text-[#111827]">
            {monthName(month)}
          </div>
          <div className="text-sm text-[#9CA3AF]">{year}</div>
          <div className="mt-1 text-[12px] font-semibold text-[#D66355]">
            {label}
          </div>
        </div>

        <button
          type="button"
          onClick={onNext}
          className="grid h-10 w-10 place-items-center rounded-xl border border-[#EDEDED] bg-white hover:bg-black/5"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5 text-[#6B7280]" />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-7 text-center text-[12px] text-[#94A3B8]">
        {weekdays.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-y-2 text-center">
        {weeks.flat().map((d, i) => {
          const isSelected =
            d &&
            selected &&
            d.getFullYear() === selected.getFullYear() &&
            d.getMonth() === selected.getMonth() &&
            d.getDate() === selected.getDate();

          const dayIdx = d ? (d.getDay() + 6) % 7 : 0;
          const isWeekend = d ? dayIdx === 5 || dayIdx === 6 : false;

          return (
            <button
              key={i}
              type="button"
              disabled={!d}
              onClick={() => d && onSelect?.(d)}
              className={cn(
                "h-10 w-10 mx-auto grid place-items-center rounded-full text-[14px] transition",
                !d && "opacity-0 pointer-events-none",
                isSelected
                  ? "bg-[#D66355] text-white"
                  : "bg-transparent text-[#111827] hover:bg-black/5",
                !isSelected && isWeekend && "text-[#D66355]"
              )}
            >
              {d ? d.getDate() : ""}
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-[11px] text-[#9CA3AF]">
        You can only select from the Available Dates
        <span className="text-[#D66355]">*</span>
      </div>
    </div>
  );
}

function PropertySummaryCard({ property, purpose }) {
  const title = property?.title || "Sky Dandelions Apartment";
  const img = property?.images?.[0] || "";
  const address = property?.address || "Jakarta, Indonesia";

  return (
    <div className="rounded-2xl border border-[#EDEDED] bg-white p-4">
      <div className="flex gap-3">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-[#F3F4F6]">
          {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : null}
          <div className="absolute bottom-2 left-2 rounded-full bg-[#D66355] px-3 py-1 text-[11px] font-semibold text-white">
            Apartment
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-[#D66355] truncate">
            {title}
          </div>

          <div className="mt-1 flex items-center gap-2 text-[12px] text-[#6B7280]">
            <MapPin className="h-4 w-4 text-[#D66355]" />
            <span className="truncate">{address}</span>
          </div>

          <div className="mt-2 text-[12px] text-[#111827]">
            {purpose === "sale" ? "$ 300,000" : "$ 30 / Night"}
          </div>

          <div className="mt-1 text-[12px] text-[#6B7280]">
            32 Views • 2 chats
          </div>
        </div>

        <div className="shrink-0">
          <div className="rounded-full bg-[#F3F4F6] px-4 py-2 text-[12px] font-semibold text-[#6B7280]">
            {purpose === "sale" ? "Sale" : "Rent"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- component ---------- */
export default function BookingLayout({
  purpose = "rent",
  property,

  // rent flow props
  checkIn,
  checkOut,
  month1,
  month2,
  onMonth1Prev,
  onMonth1Next,
  onMonth2Prev,
  onMonth2Next,
  onSelectCheckIn,
  onSelectCheckOut,
  onClearDates,
  idProofName,
  onPickIdProof,
  paymentOpen,
  onTogglePaymentOpen,
  paymentMethod,
  onPaymentMethodChange,
  onProceedToPay,

  // sale flow props
  offer,
  onOfferChange,
  intro,
  onIntroChange,
  docs,
  onRemoveDoc,
  onSubmitApplication,
}) {
  return (
    <div className="min-w-0">
      <div className="text-[34px] font-semibold text-[#D66355]">Booking</div>

      {purpose !== "sale" ? (
        <>
          {/* RENT: calendar + summary */}
          <div className="mt-5 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* Left card */}
            <div className="min-w-0 rounded-2xl border border-[#EDEDED] bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[16px] font-semibold text-[#111827]">
                  Pick your Dates of stay
                </div>

                <button
                  type="button"
                  onClick={onClearDates}
                  className="text-[14px] font-semibold text-[#D66355] hover:underline underline-offset-4"
                >
                  Clear Dates
                </button>
              </div>

              <div className="mt-6 grid gap-8 md:grid-cols-2">
                <CalendarPanel
                  label="Checkin"
                  year={month1.y}
                  month={month1.m}
                  onPrev={onMonth1Prev}
                  onNext={onMonth1Next}
                  selected={checkIn}
                  onSelect={onSelectCheckIn}
                />

                <CalendarPanel
                  label="Checkout"
                  year={month2.y}
                  month={month2.m}
                  onPrev={onMonth2Prev}
                  onNext={onMonth2Next}
                  selected={checkOut}
                  onSelect={onSelectCheckOut}
                />
              </div>

              {/* ID Proof */}
              <div className="mt-7">
                <div className="text-[13px] font-semibold text-[#111827]">
                  ID Proof
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#EDEDED] bg-white px-4 py-3">
                  <div className="min-w-0 truncate text-[13px] text-[#111827]">
                    {idProofName}
                  </div>

                  <label className="cursor-pointer shrink-0">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) onPickIdProof?.(f.name);
                      }}
                    />
                    <Upload className="h-5 w-5 text-[#6B7280]" />
                  </label>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="min-w-0 space-y-4">
              <PropertySummaryCard property={property} purpose="rent" />

              <div className="rounded-2xl border border-[#EDEDED] bg-white p-4">
                <button
                  type="button"
                  onClick={onProceedToPay}
                  className="h-12 w-full rounded-2xl bg-[#D66355] text-[14px] font-semibold text-white hover:bg-[#C85A4E]"
                >
                  Proceed to Pay
                </button>
              </div>
            </div>
          </div>

          {/* Payment Method accordion */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#EDEDED] bg-white">
            <button
              type="button"
              onClick={onTogglePaymentOpen}
              className="flex w-full items-center justify-between gap-3 px-6 py-4"
            >
              <div className="text-[14px] font-semibold text-[#111827]">
                Payment Method
              </div>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-[#6B7280] transition",
                  paymentOpen ? "rotate-180" : "rotate-0"
                )}
              />
            </button>

            <div className="h-px bg-[#EDEDED]" />

            {paymentOpen ? (
              <div className="px-6 py-4">
                {/*  reusable component (no duplication) */}
                <PaymentMethodSelector
                  value={paymentMethod}
                  onChange={onPaymentMethodChange}
                />
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <>
          {/* SALE: offer/apply */}
          <div className="mt-5 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/*  reusable offer form */}
            <OfferApplicationForm
              offer={offer}
              onOfferChange={onOfferChange}
              intro={intro}
              onIntroChange={onIntroChange}
              introCount={(intro || "").length}
              minIntroChars={50}
              docs={docs}
              onRemoveDoc={onRemoveDoc}
            />

            <div className="min-w-0 space-y-4">
              <PropertySummaryCard property={property} purpose="sale" />

              <div className="rounded-2xl border border-[#EDEDED] bg-white p-4">
                <button
                  type="button"
                  onClick={onSubmitApplication}
                  className="h-12 w-full rounded-2xl bg-[#D66355] text-[14px] font-semibold text-white hover:bg-[#C85A4E]"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}