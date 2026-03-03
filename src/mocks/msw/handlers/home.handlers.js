import { http, HttpResponse } from "msw";
import { HOME_FIXTURE } from "../../db/fixtures/home";
import { ENDPOINTS } from "../../../services/api/endpoints";

export const homeHandlers = [
  http.get(ENDPOINTS.home, () => {
    return HttpResponse.json(HOME_FIXTURE);
  }),
];
