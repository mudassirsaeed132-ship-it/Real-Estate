import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageShell from "../../app/layout/PageShell";
import { apiGet } from "../../services/api/client";
import { ENDPOINTS } from "../../services/api/endpoints";

import Dropdown from "../../shared/ui/Dropdown";
import { DUMMY_COUNTRIES, DUMMY_CATEGORIES } from "../../app/config/constants";

import locationIcon from "../../assets/icons/property/location.svg";

import buyIcon from "../../assets/icons/categories/buy.png";
import rentIcon from "../../assets/icons/categories/rent.png";
import landIcon from "../../assets/icons/categories/land.png";
import commercialIcon from "../../assets/icons/categories/commercial.png";
import shortStayIcon from "../../assets/icons/categories/short-stay.png";

import PropertySection from "../../widgets/property/PropertySection";
import Button from "../../shared/ui/Button";

const QUICK_CATS = [
  { key: "buy", label: "Buy", icon: buyIcon },
  { key: "rent", label: "Rent", icon: rentIcon },
  { key: "land", label: "Land", icon: landIcon },
  { key: "commercial", label: "Commercial", icon: commercialIcon },
  { key: "short-stay", label: "Short-Stay", icon: shortStayIcon },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const [country, setCountry] = useState("Pakistan");
  const [category, setCategory] = useState("all");

  const countryItems = useMemo(
    () => DUMMY_COUNTRIES.map((c) => ({ value: c, label: c })),
    []
  );

  const categoryItems = useMemo(
    () => DUMMY_CATEGORIES.map((c) => ({ value: c.key, label: c.label })),
    []
  );

  useEffect(() => {
    apiGet(ENDPOINTS.home).then(setData).catch(console.error);
  }, []);

  const sections = data?.sections || {};
  const newThisWeek = sections.newThisWeek || [];
  const nearby = sections.nearby || [];
  const forYou = sections.forYou || [];

  return (
    <div className="min-w-0">
      {/* Top controls area like UI */}
      <PageShell className="pt-6">
        <div className="space-y-4 min-w-0">
          {/* Location row */}
          <div className="flex items-center justify-between rounded-xl border border-[#EDEDED] bg-white px-4 py-3 min-w-0">
            <div className="flex flex-1 items-center gap-2 min-w-0">
              <img src={locationIcon} alt="" className="h-4 w-4 shrink-0" />

              <div className="flex-1 min-w-0">
                <Dropdown
                  value={country}
                  items={countryItems}
                  onChange={(v) => setCountry(v)}
                  width="trigger"
                  buttonClassName="w-full border-0 bg-transparent hover:bg-transparent px-0 py-0 text-sm text-[#6B7280] rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Category links row */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-[#6B7280]">
            <Dropdown
              value={category}
              items={categoryItems}
              width={260}
              onChange={(v) => {
                setCategory(v);
                if (v === "buy") navigate("/properties?purpose=sale");
                else if (v === "rent") navigate("/properties?purpose=rent");
                else if (v === "all") navigate("/properties");
                else navigate(`/properties?category=${encodeURIComponent(v)}`);
              }}
              buttonClassName="h-auto border-0 bg-transparent hover:bg-transparent px-0 py-0 text-sm text-[#6B7280] rounded-none"
            />

            <span className="cursor-pointer">Mobile Phones</span>
            <span className="cursor-pointer">Cars</span>
            <span className="cursor-pointer">Motorcycles</span>
            <span className="cursor-pointer">Houses</span>
            <span className="cursor-pointer">Video-Audios</span>
            <span className="cursor-pointer">Tablets</span>
            <span className="cursor-pointer">Land & Plots</span>
          </div>

          {/* Quick categories icons */}
          <div className="py-6">
            <div className="mx-auto grid max-w-5xl grid-cols-3 justify-items-center gap-y-8 gap-x-10 sm:grid-cols-5 sm:gap-x-16 md:gap-x-24">
              {QUICK_CATS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => {
                    if (c.key === "buy") navigate("/properties?purpose=sale");
                    else if (c.key === "rent") navigate("/properties?purpose=rent");
                    else navigate(`/properties?category=${encodeURIComponent(c.key)}`);
                  }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F3F4F6]">
                    <img src={c.icon} alt={c.label} className="h-8 w-8" />
                  </div>
                  <span className="text-[15px] font-medium text-[#111827]">
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </PageShell>

      {/* Sections */}
      <PageShell>
        <PropertySection
          title="New this week"
          subtitle="Fresh properties just added by owners"
          items={newThisWeek}
        />
      </PageShell>

      {/* ✅ Precheck CTA band (fixed max width + responsive layout) */}
      <div className="bg-[#D66355]">
        <PageShell className="py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="text-white min-w-0">
              <h3 className="text-2xl font-semibold">
                Know your budget in 3 minutes
              </h3>

              {/* ✅ FIX: max-w-160 was invalid → caused overflow */}
              <p className="mt-2 max-w-[640px] text-sm text-white/80">
                Get a financing pre-check certificate from our partner banks.
                Increases your chances of getting the property by 3x.
              </p>
            </div>

            <Button
              variant="ghost"
              className={[
                "h-11 rounded-full bg-white px-10 text-sm font-semibold",
                "text-[#D66355] hover:bg-white active:bg-white",
                "transition-none",
                "w-full md:w-auto", // ✅ mobile full width, desktop auto
              ].join(" ")}
              onClick={() => navigate("/precheck")}
            >
              Start Pre-check
            </Button>
          </div>
        </PageShell>
      </div>

      <PageShell>
        <PropertySection
          title="Nearby"
          subtitle="Fresh properties just added by owners"
          items={nearby}
        />
      </PageShell>

      <PageShell className="pb-6">
        <PropertySection
          title="For You"
          subtitle="Fresh properties just added by owners"
          items={forYou}
        />
      </PageShell>
    </div>
  );
}