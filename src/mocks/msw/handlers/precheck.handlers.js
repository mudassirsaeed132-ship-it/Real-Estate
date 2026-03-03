// src/mocks/msw/handlers/precheck.handlers.js
import { http, HttpResponse } from "msw";
import { ENDPOINTS } from "../../../services/api/endpoints";
import { PRECHECK_PROPERTIES_FIXTURE } from "../../db/fixtures/precheck";

const toNum = (v) => {
  const s = String(v ?? "").replace(/[^0-9.]/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

function computeResults(payload) {
  const propertyPrice = toNum(payload?.propertyPrice);
  const income = toNum(payload?.income);
  const expenses = toNum(payload?.monthlyExpenses);
  const equity = toNum(payload?.equity);

  // dummy math for UI
  const estimatedMaxPurchasePrice = Math.max(10000, Math.round((income * 12 - expenses * 12) * 1.1));
  const requiredEquity = Math.max(5000, Math.round(propertyPrice * 0.2 || 90000));
  const monthlyHousingCost = Math.max(200, Math.round((propertyPrice / 18) || 1440));

  const affordable = equity >= requiredEquity && income > expenses;

  return {
    affordable,
    badge: affordable ? "Affordable" : "Not Affordable",
    financialOverview: [
      { key: "Estimated max purchase price", value: `$${estimatedMaxPurchasePrice.toLocaleString()}` },
      { key: "Required equity", value: `$${requiredEquity.toLocaleString()}`, note: affordable ? "" : "Additional equity needed" },
      { key: "Estimated monthly housing cost", value: `$${monthlyHousingCost.toLocaleString()}`, note: "~33% of income" },
    ],
    calculationLeft: [
      "Calculated with 5% imputed interest rate",
      "Switzerland Financing Rules",
      "Minimum equity: 20% (dummy)",
    ],
    calculationRight: [
      `Non-pension equity required: ${Math.round(requiredEquity * 0.7).toLocaleString()} CHF (dummy)`,
      `Annual housing costs: ${Math.round(monthlyHousingCost * 12).toLocaleString()} CHF (dummy)`,
      `Housing cost ratio: ${income ? Math.round((monthlyHousingCost / (income / 12)) * 100) : 0}% of gross income`,
    ],
    important: [
      `You need ${(requiredEquity - equity > 0 ? requiredEquity - equity : 0).toLocaleString()} CHF more equity`,
      "Housing costs exceed the recommended 33% of gross income",
      "At least 210,000 CHF must be non-pension funds (dummy)",
    ],
    disclaimer:
      "This is a non-binding affordability indication. Final approval depends on full documentation review by the bank. Interest rates, terms, and requirements may vary by lender.",
  };
}

export const precheckHandlers = [
  http.get(ENDPOINTS.precheckRecent, () => {
    return HttpResponse.json({ items: PRECHECK_PROPERTIES_FIXTURE.slice(0, 6) });
  }),

  http.get(ENDPOINTS.precheckSearch, ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") || "").toLowerCase();

    const items = PRECHECK_PROPERTIES_FIXTURE.filter((x) =>
      !q ? true : x.title.toLowerCase().includes(q) || x.location.toLowerCase().includes(q)
    );

    return HttpResponse.json({ items });
  }),

  http.post(ENDPOINTS.precheckCalculate, async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    return HttpResponse.json({ item: computeResults(body) });
  }),

  http.post(ENDPOINTS.precheckShare, async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    if (!body?.consent) {
      return HttpResponse.json({ message: "Consent is required" }, { status: 400 });
    }
    return HttpResponse.json({ ok: true });
  }),
];
