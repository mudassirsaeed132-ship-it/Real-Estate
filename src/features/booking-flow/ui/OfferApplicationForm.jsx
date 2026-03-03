import { Upload, X } from "lucide-react";
import { cn } from "../../../shared/lib/cn";

export default function OfferApplicationForm({
  offer,
  onOfferChange,
  intro,
  onIntroChange,
  introCount = 0,
  minIntroChars = 50,
  docs = [],
  onRemoveDoc,
  onSubmit,
}) {
  const introOk = introCount >= minIntroChars;

  return (
    <div className="min-w-0 rounded-2xl border border-[#EDEDED] bg-white p-6">
      <div className="text-[14px] font-semibold text-[#111827]">
        Make an offer for the property
      </div>

      <div className="mt-5 text-[13px] font-semibold text-[#111827]">Your Offer</div>
      <div className="mt-2 rounded-xl border border-[#EDEDED] bg-white px-4 py-3">
        <div className="flex items-center gap-2 text-[13px] text-[#111827]">
          <span>$</span>
          <input
            value={offer}
            onChange={(e) => onOfferChange?.(e.target.value)}
            className="w-full bg-transparent outline-none"
            placeholder="300,000"
          />
        </div>
      </div>

      <div className="mt-5 text-[13px] font-semibold text-[#111827]">
        Introduce yourself to seller
      </div>

      <div className="mt-2 rounded-xl border border-[#EDEDED] bg-white p-4">
        <textarea
          value={intro}
          onChange={(e) => onIntroChange?.(e.target.value)}
          className="min-h-[180px] w-full resize-none bg-transparent text-[13px] text-[#111827] outline-none placeholder:text-[#9CA3AF]"
          placeholder="why are you interested in property?"
        />
      </div>

      <div className="mt-2 text-[11px] text-[#9CA3AF]">
        {introCount} Characters (minimum {minIntroChars} required)
        {!introOk ? <span className="ml-2 text-[#D66355]">(too short)</span> : null}
      </div>

      <div className="mt-6 text-[13px] font-semibold text-[#111827]">
        Supporting Documents
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-[#EDEDED] bg-white">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="text-[12px] text-[#9CA3AF]">
            Upload documents like ID, Proof of Income, References*
          </div>
          <Upload className="h-5 w-5 text-[#6B7280]" />
        </div>

        <div className="h-px bg-[#EDEDED]" />

        {(docs || []).map((d) => (
          <div key={d} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="text-[13px] text-[#111827]">{d}</div>
            <button
              type="button"
              onClick={() => onRemoveDoc?.(d)}
              className="grid h-7 w-7 place-items-center rounded-full hover:bg-black/5"
              aria-label="Remove document"
            >
              <X className={cn("h-4 w-4 text-[#111827] opacity-70")} />
            </button>
          </div>
        ))}
      </div>

      {/* optional submit (if you want form itself to own the button later) */}
      {onSubmit ? (
        <button
          type="button"
          onClick={onSubmit}
          className="mt-6 h-12 w-full rounded-2xl bg-[#D66355] text-[14px] font-semibold text-white hover:bg-[#C85A4E]"
        >
          Submit Application
        </button>
      ) : null}
    </div>
  );
}
