import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Dropdown from "../../../shared/ui/Dropdown";
import Input from "../../../shared/ui/Input";
import IconButton from "../../../shared/ui/IconButton";
import locationIcon from "../../../assets/icons/property/location.svg";
import { DUMMY_COUNTRIES } from "../../../app/config/constants";

export default function PropertiesTopSearchBar({ params, setParam, onOpenFilters }) {
  const countryItems = useMemo(
    () => DUMMY_COUNTRIES.map((c) => ({ value: c, label: c })),
    []
  );

  const [draftQ, setDraftQ] = useState(params.q || "");
  useEffect(() => setDraftQ(params.q || ""), [params.q]);

  const submit = () => setParam("q", draftQ);

  const field = "h-[44px] rounded-xl border border-[#EDEDED] bg-white";
  const pad = "px-4";

  return (
    <div className="mt-5 flex justify-center min-w-0">
      <div className="w-full max-w-245 min-w-0">
        {/*  Desktop: one row | Mobile: 2 rows (query + actions attached) */}
        <div className="grid min-w-0 gap-3 md:grid-cols-[260px_minmax(0,1fr)_120px_44px] md:items-center">
          {/* Location */}
          <div className={`flex min-w-0 items-center gap-2 ${field} ${pad}`}>
            <img src={locationIcon} alt="" className="h-4 w-4 shrink-0" />
            <div className="flex-1 min-w-0">
              <Dropdown
                value={params.location || "Pakistan"}
                items={countryItems}
                onChange={(v) => setParam("location", v)}
                width="trigger"
                buttonClassName="!h-full w-full min-w-0 !border-0 !bg-transparent !hover:bg-transparent !px-0 !py-0 !text-[13px] !text-[#111827] rounded-none"
              />
            </div>
          </div>

          {/* Query + (mobile actions inside same row) */}
          <div className="flex min-w-0 items-center gap-2 md:contents">
            <Input
              value={draftQ}
              onChange={(e) => setDraftQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="House for Sale"
              className={`w-full min-w-0 ${field} ${pad} text-[13px]! text-[#111827]!`}
            />

            {/* Mobile-only action row (keeps filter icon aligned, no overflow) */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={submit}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D66355] px-4 text-[12px] font-semibold text-white hover:bg-[#C85A4E]"
              >
                <Search className="h-4 w-4" />
                Search
              </button>

              <IconButton
                aria-label="Filters"
                onClick={onOpenFilters}
                type="button"
                className="h-11 w-11 shrink-0 rounded-xl border border-[#EDEDED] bg-white hover:bg-black/5"
              >
                <SlidersHorizontal className="h-5 w-5 text-[#D66355]" />
              </IconButton>
            </div>
          </div>

          {/* Desktop actions */}
          <button
            type="button"
            onClick={submit}
            className="hidden md:inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#D66355] px-4 text-[12px] font-semibold text-white hover:bg-[#C85A4E]"
          >
            <Search className="h-4 w-4" />
            Search
          </button>

          <IconButton
            aria-label="Filters"
            onClick={onOpenFilters}
            type="button"
            className="hidden md:inline-flex h-11 w-11 rounded-xl border border-[#EDEDED] bg-white hover:bg-black/5"
          >
            <SlidersHorizontal className="h-5 w-5 text-[#D66355]" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}