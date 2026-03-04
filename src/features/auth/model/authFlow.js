import { ROLES } from "../../../entities/session/model/shapes";

export function normalizeRole(role) {
  return role === ROLES.SELLER ? ROLES.SELLER : ROLES.BUYER;
}

export function getNextFromSearchParams(searchParams) {
  const next = searchParams.get("next");
  return next ? decodeURIComponent(next) : null;
}

/**
 * Avoid double-encoding "next".
 * - If next already looks encoded, keep it.
 * - Otherwise encode it.
 */
export function safeEncodeNext(next) {
  if (!next) return "";
  try {
    const decoded = decodeURIComponent(next);
    const reEncoded = encodeURIComponent(decoded);
    if (reEncoded === next) return next; // already encoded
    return encodeURIComponent(next);
  } catch {
    return encodeURIComponent(next);
  }
}