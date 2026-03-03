import { apiGet } from "./client";
import { ENDPOINTS } from "./endpoints";

export function getProperties(params) {
  const sp = new URLSearchParams(params);
  return apiGet(`${ENDPOINTS.properties}?${sp.toString()}`);
}