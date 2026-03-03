// src/features/property-search/model/filters.js

const LABELS = {
  purpose: { sale: "For Sale", rent: "For Rent", "short-term": "Short-Term" },
  new: { true: "Only New", false: "Not New" },
  balcony: { no: "No Balcony", yes: "Has Balcony" },
};

function clean(v) {
  return String(v || "").trim();
}

function list(v) {
  return clean(v)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function makeChip(key, label, removeKey = key) {
  return { key, label, removeKey };
}

/**
 * Build chips from current params (API-ready).
 * - Each chip has: { key, label, removeKey }
 * - removeKey tells which query param to clear on remove
 */
export function buildFilterChips(params = {}) {
  const chips = [];

  // purpose (sale/rent)
  if (clean(params.purpose) && LABELS.purpose[params.purpose]) {
    chips.push(makeChip("purpose", LABELS.purpose[params.purpose]));
  }

  // new flag
  if (clean(params.new) && LABELS.new[params.new]) {
    chips.push(makeChip("new", LABELS.new[params.new]));
  }

  // rooms/baths
  if (clean(params.rooms)) {
    chips.push(makeChip("rooms", `${params.rooms} room${params.rooms === "1" ? "" : "s"}`));
  }
  if (clean(params.baths)) {
    chips.push(makeChip("baths", `${params.baths} bath${params.baths === "1" ? "" : "s"}`));
  }

  // balcony
  if (clean(params.balcony) && LABELS.balcony[params.balcony]) {
    chips.push(makeChip("balcony", LABELS.balcony[params.balcony]));
  }

  // tags (comma-separated)
  const tags = list(params.tags);
  tags.forEach((t) => chips.push(makeChip(`tag:${t}`, t, "tags")));

  // category (comma-separated)
  const cats = list(params.category);
  cats.forEach((c) => chips.push(makeChip(`cat:${c}`, c, "category")));

  // availability
  if (clean(params.availability)) {
    chips.push(makeChip("availability", params.availability));
  }

  // price range
  const priceMin = clean(params.priceMin);
  const priceMax = clean(params.priceMax);
  if (priceMin || priceMax) {
    const a = priceMin ? priceMin : "Any";
    const b = priceMax ? priceMax : "Any";
    chips.push(makeChip("price", `Price: ${a}–${b}`, "__price"));
  }

  // rooms range (from modal min/max)
  const roomsMin = clean(params.roomsMin);
  const roomsMax = clean(params.roomsMax);
  if (roomsMin || roomsMax) {
    const a = roomsMin ? roomsMin : "Any";
    const b = roomsMax ? roomsMax : "Any";
    chips.push(makeChip("roomsRange", `Rooms: ${a}–${b}`, "__roomsRange"));
  }

  // space range
  const spaceMin = clean(params.spaceMin);
  const spaceMax = clean(params.spaceMax);
  if (spaceMin || spaceMax) {
    const a = spaceMin ? spaceMin : "Any";
    const b = spaceMax ? spaceMax : "Any";
    chips.push(makeChip("space", `Space: ${a}–${b}`, "__space"));
  }

  // radius
  if (clean(params.radius) && Number(params.radius) > 0) {
    chips.push(makeChip("radius", `Radius: ${params.radius} km`));
  }

  // location (country/city) - show only if not default-ish
  if (clean(params.location) && params.location !== "Pakistan") {
    chips.push(makeChip("location", params.location));
  }

  // keyword q
  if (clean(params.q)) {
    chips.push(makeChip("q", `Keyword: ${params.q}`));
  }

  // features (comma-separated)
  const feats = list(params.features);
  feats.forEach((f) => chips.push(makeChip(`feat:${f}`, f, "features")));

  // only with price checkbox
  if (params.onlyWithPrice === "true") {
    chips.push(makeChip("onlyWithPrice", "Only listings with price"));
  }

  return chips;
}

/**
 * Remove chip behavior.
 * Uses removeKey. Special keys clear multiple params.
 */
export function removeChip({ chip, params, setParam }) {
  if (!chip) return;

  const rk = chip.removeKey || chip.key;

  // Special composite removals
  if (rk === "__price") {
    setParam("priceMin", "");
    setParam("priceMax", "");
    return;
  }
  if (rk === "__roomsRange") {
    setParam("roomsMin", "");
    setParam("roomsMax", "");
    return;
  }
  if (rk === "__space") {
    setParam("spaceMin", "");
    setParam("spaceMax", "");
    return;
  }

  // list removals: tag/category/features
  if (rk === "tags") {
    const t = chip.key.replace("tag:", "");
    const next = list(params.tags).filter((x) => x !== t).join(",");
    setParam("tags", next);
    return;
  }

  if (rk === "category") {
    const c = chip.key.replace("cat:", "");
    const next = list(params.category).filter((x) => x !== c).join(",");
    setParam("category", next);
    return;
  }

  if (rk === "features") {
    const f = chip.key.replace("feat:", "");
    const next = list(params.features).filter((x) => x !== f).join(",");
    setParam("features", next);
    return;
  }

  // Default: clear this param
  setParam(rk, "");
}
