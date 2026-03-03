// PATH: src/mocks/msw/handlers/profile.handlers.js
import { http, HttpResponse } from "msw";
import { ENDPOINTS } from "../../../services/api/endpoints";
import {
  PROFILE_FIXTURE,
  SAVED_SEARCHES_FIXTURE,
  VIEWED_PROPERTIES_FIXTURE,
  PROFILE_BOOKINGS_FIXTURE,
  BOOKINGS_FIXTURE, // (optional compat)
} from "../../db/fixtures/profile";
import { PROPERTIES_FIXTURE } from "../../db/fixtures/properties";

export const profileHandlers = [
  // Profile main data
  http.get(ENDPOINTS.profile, () => {
    return HttpResponse.json({ item: PROFILE_FIXTURE });
  }),

  // Save settings
  http.post(ENDPOINTS.profileSettings, async ({ request }) => {
    const body = await request.json().catch(() => ({}));

    PROFILE_FIXTURE.settings = {
      ...PROFILE_FIXTURE.settings,
      ...(body?.settings || {}),
    };

    return HttpResponse.json({ ok: true, item: PROFILE_FIXTURE.settings });
  }),

  // Saved searches
  http.get(ENDPOINTS.profileSavedSearches, () => {
    return HttpResponse.json({ items: SAVED_SEARCHES_FIXTURE });
  }),

  // Viewed history
  http.get(ENDPOINTS.profileViewed, () => {
    return HttpResponse.json({ groups: VIEWED_PROPERTIES_FIXTURE });
  }),

  // Favorites
  http.get(ENDPOINTS.profileFavorites, () => {
    const items = Array.isArray(PROPERTIES_FIXTURE)
      ? PROPERTIES_FIXTURE.slice(0, 8)
      : [];
    return HttpResponse.json({ items });
  }),

  /**
   * ✅ Bookings & Applications (Figma)
   * GET /api/profile/bookings?status=completed|ongoing
   * Returns { items } for BookingsPage.jsx
   * Also returns { groups } for backward compatibility (optional)
   */
  http.get(ENDPOINTS.profileBookings || `${ENDPOINTS.profile}/bookings`, ({ request }) => {
    const url = new URL(request.url);
    const status = (url.searchParams.get("status") || "completed").toLowerCase();

    const items =
      status === "ongoing"
        ? PROFILE_BOOKINGS_FIXTURE.ongoing
        : PROFILE_BOOKINGS_FIXTURE.completed;

    // ✅ provide both shapes (safe)
    return HttpResponse.json({
      items,
      groups: BOOKINGS_FIXTURE,
    });
  }),
];