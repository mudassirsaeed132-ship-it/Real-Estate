import { http, HttpResponse } from "msw";
import { PROPERTIES_FIXTURE } from "../../db/fixtures/properties";
import { ENDPOINTS } from "../../../services/api/endpoints";

// Helpers
const toStr = (v) => (v == null ? "" : String(v));

function includesText(haystack, needle) {
  if (!needle) return true;
  return toStr(haystack).toLowerCase().includes(toStr(needle).toLowerCase());
}

function applyFilters(items, params) {
  const purpose = params.get("purpose"); // sale | rent
  const q = params.get("q");
  const isNew = params.get("new"); // "true" | "false" | ""
  const rooms = params.get("rooms"); // "1" | "2" | ...
  const baths = params.get("baths"); // "1" | "2" | ...
  const balcony = params.get("balcony"); // "yes" | "no"

  return items.filter((p) => {
    if (purpose && p.purpose !== purpose) return false;

    if (rooms && String(p.rooms) !== String(rooms)) return false;
    if (baths && String(p.baths) !== String(baths)) return false;

    if (balcony === "yes" && !p.features?.includes("balcony")) return false;
    if (balcony === "no" && p.features?.includes("balcony")) return false;

    if (isNew === "true" && !p.badges?.includes("new")) return false;
    if (isNew === "false" && p.badges?.includes("new")) return false;

    if (q) {
      const ok =
        includesText(p.title, q) ||
        includesText(p.address, q) ||
        includesText(p.bedsText, q);
      if (!ok) return false;
    }

    return true;
  });
}

function paginate(items, page, pageSize) {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), pages);

  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;

  // PATH: src/mocks/msw/handlers/properties.handlers.js
return {
  items: items.slice(start, end),
  meta: { total, page: safePage, pageSize, pages, totalPages: pages },
};
}

export const propertiesHandlers = [
  // LIST
  http.get(ENDPOINTS.properties, ({ request }) => {
    const url = new URL(request.url);
    const params = url.searchParams;

    // ✅ default pageSize 20 (Figma 5 rows)
    const page = Number(params.get("page") || 1);
    const pageSize = Number(params.get("pageSize") || 20);

    const filtered = applyFilters(PROPERTIES_FIXTURE, params);
    const resp = paginate(filtered, page, pageSize);

    return HttpResponse.json(resp);
  }),

  // DETAIL
  http.get(`${ENDPOINTS.properties}/:id`, ({ params }) => {
    const { id } = params;
    const item = PROPERTIES_FIXTURE.find((p) => p.id === id);

    if (!item) {
      return HttpResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json({ item });
  }),
];