import { ChevronRight, X } from "lucide-react";
import Modal from "../../../shared/ui/Modal";
import Checkbox from "../../../shared/ui/Checkbox";
import RadioGroup from "../../../shared/ui/RadioGroup";
import Select from "../../../shared/ui/Select";

const TAGS = ["New Build", "Investment", "Renovated", "Lake view", "Garden"];

const CATEGORY_LEFT = [
  "Apartment",
  "Apartment & house",
  "Multi-family house",
  "Parking space, garage",
];

const CATEGORY_RIGHT = [
  "House, chalet, rustico",
  "Building plot",
  "Commercial & Residential",
];

const FEATURES = [
  "Balcony / Terrace",
  "New building",
  "Parking space / Garage",
  "Old building",
  "Swimming pool",
];

const AVAILABILITY = [
  "Long Term Rental",
  "Short- Term Rental (Hourly/Daily)",
  "Available immediately",
];

const PRICE_OPTIONS = ["", "500", "1000", "1500", "2000", "2500", "3000", "4000", "5000+"];
const ROOMS_OPTIONS = ["", "1", "2", "3", "4", "5", "6+"];
const SPACE_OPTIONS = ["", "20", "40", "60", "80", "100", "120", "150", "200+"];

function splitList(v) {
  return String(v || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function Pill({ active, kind = "tag", children, onClick }) {
  // tag: active red border + red text
  // feature: active red border + black text
  const activeCls =
    kind === "feature"
      ? "border-[#D66355] text-[#111827]"
      : "border-[#D66355] text-[#D66355]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border bg-white",
        kind === "tag" ? "px-4 py-1.5 text-[13px]" : "px-5 py-2 text-sm",
        active ? activeCls : "border-[#D1D5DB] text-[#111827]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function FiltersModal({ open, onClose, params, setParam, onClear }) {
  const tags = splitList(params.tags);
  const cats = splitList(params.category);
  const features = splitList(params.features);

  const purpose = params.purpose || "rent";
  const radius = Number(params.radius || 0);

  const toggleList = (key, value) => {
    const list = splitList(params[key]);
    const next = list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
    setParam(key, next.join(","));
  };

  const inputClass =
    "h-12 w-full rounded-xl border border-[#DADADA] bg-white px-5 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#D66355]";

  const Header = (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-[#111827]" />
          </button>
          <div className="text-sm font-semibold text-[#111827]">Search Filters</div>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="text-sm font-semibold text-[#D66355] hover:underline"
        >
          Clear all
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      header={Header}
      size="lg"
      height="tall"
      overlayClassName="bg-black/50"
      panelClassName="rounded-[28px]"
      bodyClassName="px-8 pb-10 pt-0"
    >
      {/* Search */}
      <div className="pt-1">
        <input
          className={inputClass}
          value={params.q || ""}
          onChange={(e) => setParam("q", e.target.value)}
          placeholder="Search Property Name or keywords...."
        />
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-3">
        {TAGS.map((t) => (
          <Pill
            key={t}
            active={tags.includes(t)}
            kind="tag"
            onClick={() => toggleList("tags", t)}
          >
            {t}
          </Pill>
        ))}
      </div>

      {/* Category */}
      <div className="mt-8">
        <div className="text-sm font-semibold text-[#111827]">Category</div>

        <div className="mt-4 grid gap-x-24 gap-y-2 md:grid-cols-2">
          <div className="space-y-2">
            {CATEGORY_LEFT.map((c) => (
              <Checkbox
                key={c}
                variant="ink"
                checked={cats.includes(c)}
                onChange={() => toggleList("category", c)}
                label={c}
              />
            ))}
          </div>

          <div className="space-y-2">
            {CATEGORY_RIGHT.map((c) => (
              <Checkbox
                key={c}
                variant="ink"
                checked={cats.includes(c)}
                onChange={() => toggleList("category", c)}
                label={c}
              />
            ))}
          </div>
        </div>
      </div>

      {/* What are you looking For */}
      <div className="mt-8">
        <div className="text-sm font-semibold text-[#111827]">
          What are you looking For:
        </div>

        <div className="mt-3">
          <RadioGroup
            name="purpose"
            value={purpose}
            onChange={(v) => setParam("purpose", v)}
            options={[
              { value: "sale", label: "Buy" },
              { value: "rent", label: "Rent" },
              { value: "short-term", label: "Short-Term" },
            ]}
          />
        </div>
      </div>

      {/* Location */}
      <div className="mt-8">
        <div className="text-sm font-semibold text-[#111827]">
          City/ Area/ Zip Code or Street
        </div>
        <div className="mt-3">
          <input
            className={inputClass}
            value={params.location || ""}
            onChange={(e) => setParam("location", e.target.value)}
            placeholder="Zurich, LETTEN"
          />
        </div>
      </div>

      {/* Availability */}
      <div className="mt-8">
        <div className="text-sm font-semibold text-[#111827]">Availability</div>
        <div className="mt-3">
          <Select
            size="md"
            value={params.availability || AVAILABILITY[0]}
            onChange={(e) => setParam("availability", e.target.value)}
            options={AVAILABILITY}
          />
        </div>
      </div>

      {/* Price */}
      <div className="mt-8">
        <div className="text-sm font-semibold text-[#111827]">Price (CHF)</div>

        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
          <Select
            size="md"
            value={params.priceMin || ""}
            onChange={(e) => setParam("priceMin", e.target.value)}
            options={PRICE_OPTIONS}
          />
          <div className="hidden md:block text-sm text-[#111827]">to</div>
          <Select
            size="md"
            value={params.priceMax || ""}
            onChange={(e) => setParam("priceMax", e.target.value)}
            options={PRICE_OPTIONS}
          />
        </div>

        <div className="mt-4">
          <Checkbox
            variant="ink"
            size="sm"
            checked={params.onlyWithPrice === "true"}
            onChange={() =>
              setParam("onlyWithPrice", params.onlyWithPrice === "true" ? "" : "true")
            }
            label="Only listings with price"
          />
        </div>
      </div>

      {/* Rooms */}
      <div className="mt-8">
        <div className="text-sm font-semibold text-[#111827]">Rooms</div>

        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
          <Select
            size="md"
            value={params.roomsMin || ""}
            onChange={(e) => setParam("roomsMin", e.target.value)}
            options={ROOMS_OPTIONS}
          />
          <div className="hidden md:block text-sm text-[#111827]">to</div>
          <Select
            size="md"
            value={params.roomsMax || ""}
            onChange={(e) => setParam("roomsMax", e.target.value)}
            options={ROOMS_OPTIONS}
          />
        </div>
      </div>

      {/* Living Space */}
      <div className="mt-8">
        <div className="text-sm font-semibold text-[#111827]">Living Space</div>

        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
          <Select
            size="md"
            value={params.spaceMin || ""}
            onChange={(e) => setParam("spaceMin", e.target.value)}
            options={SPACE_OPTIONS}
          />
          <div className="hidden md:block text-sm text-[#111827]">to</div>
          <Select
            size="md"
            value={params.spaceMax || ""}
            onChange={(e) => setParam("spaceMax", e.target.value)}
            options={SPACE_OPTIONS}
          />
        </div>
      </div>

      {/* Radius */}
      <div className="mt-8">
        <div className="text-sm font-semibold text-[#111827]">Radius</div>
        <div className="mt-2 text-sm text-[#6B7280]">{radius} km</div>

        <input
          type="range"
          min={0}
          max={50}
          value={radius}
          onChange={(e) => setParam("radius", String(e.target.value))}
          className="mt-3 w-full accent-[#D66355]"
        />
      </div>

      {/* Volume */}
      <div className="mt-8">
        <div className="text-sm font-semibold text-[#111827]">Volume</div>

        <button
          type="button"
          onClick={() => setParam("volume", params.volume ? "" : "400m")}
          className="mt-3 flex h-12 w-full items-center justify-between rounded-xl border border-[#DADADA] bg-white px-5"
        >
          <span className="text-sm text-[#111827]">{params.volume || "400m"}</span>
          <ChevronRight className="h-5 w-5 text-[#6B7280]" />
        </button>
      </div>

      {/* Features and furnishings */}
      <div className="mt-8">
        <div className="text-sm font-semibold text-[#111827]">
          Features and furnishings
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          {FEATURES.map((f) => (
            <Pill
              key={f}
              active={features.includes(f)}
              kind="feature"
              onClick={() => toggleList("features", f)}
            >
              {f}
            </Pill>
          ))}
        </div>
      </div>

      <div className="h-6" />
    </Modal>
  );
}