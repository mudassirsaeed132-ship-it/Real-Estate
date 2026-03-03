import { ROLES } from "../../../entities/session/model/shapes";

export function normalizeRole(role) {
  return role === ROLES.SELLER ? ROLES.SELLER : ROLES.BUYER;
}

export function getNextFromSearchParams(searchParams) {
  const next = searchParams.get("next");
  return next ? decodeURIComponent(next) : null;
}