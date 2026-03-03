import { http, HttpResponse } from "msw";
import { ENDPOINTS } from "../../../services/api/endpoints";
import { NOTIFICATIONS_FIXTURE } from "../../db/fixtures/notifications";

export const notificationsHandlers = [
  http.get(ENDPOINTS.notifications, ({ request }) => {
    const url = new URL(request.url);
    const type = (url.searchParams.get("type") || "all").toLowerCase();

    const filtered =
      type === "all"
        ? NOTIFICATIONS_FIXTURE
        : NOTIFICATIONS_FIXTURE.filter((n) => (n.type || "").toLowerCase() === type);

    const today = filtered.filter((n) => n.bucket === "today");
    const older = filtered.filter((n) => n.bucket === "older");

    return HttpResponse.json({ groups: { today, older } });
  }),
];