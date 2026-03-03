// src/features/booking-flow/model/billingCalc.js

function toDate(v) {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function diffDays(a, b) {
  const A = toDate(a);
  const B = toDate(b);
  if (!A || !B) return 0;
  const ms = 24 * 60 * 60 * 1000;
  const ua = Date.UTC(A.getFullYear(), A.getMonth(), A.getDate());
  const ub = Date.UTC(B.getFullYear(), B.getMonth(), B.getDate());
  return Math.max(0, Math.round((ub - ua) / ms));
}

export function calcNights(checkIn, checkOut) {
  const d = diffDays(checkIn, checkOut);
  return Math.max(1, d || 0);
}

export function formatMoneyUSD(amount) {
  const n = Number(amount || 0);
  // Match UI style like "$150.00"
  return `$${n.toFixed(2)}`;
}

export function formatMoneyUSDNoCents(amount) {
  const n = Number(amount || 0);
  // Match UI style like "$222.5$" (their screenshot is odd, but keep closer)
  // We'll keep one decimal if needed, else int.
  const s = Number.isInteger(n) ? `${n}` : `${n}`;
  return `$${s}$`;
}

export function buildBillingOverview({
  checkIn,
  checkOut,
  nightlyRate = 150,
  cleaningFee = 50,
  serviceFee = 22.5,
  currency = "USD",
} = {}) {
  const nights = calcNights(checkIn, checkOut);
  const base = Number(nightlyRate) * nights;
  const cleaning = Number(cleaningFee);
  const service = Number(serviceFee);
  const total = base + cleaning + service;

  return {
    currency,
    stay: {
      checkIn,
      checkOut,
      nights,
      nightsLabel: `${nights} night${nights > 1 ? "s" : ""}`,
    },
    breakdown: [
      // ✅ EXACT label like UI: "$150 × 1 night"
      {
        label: `$${Number(nightlyRate)} × ${nights} night${nights > 1 ? "s" : ""}`,
        value: formatMoneyUSD(base),
        muted: true,
      },
      { label: "Cleaning fee", value: formatMoneyUSD(cleaning), muted: true },
      { label: "Service fee", value: formatMoneyUSD(service), muted: true },
    ],
    totalLabel: "Total (USD)",
    totalFormatted: formatMoneyUSDNoCents(total),
    amounts: { nightlyRate, base, cleaningFee: cleaning, serviceFee: service, total },
  };
}