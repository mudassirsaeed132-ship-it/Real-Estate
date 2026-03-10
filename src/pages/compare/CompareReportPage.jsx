// PATH: src/pages/compare/CompareReportPage.jsx
import { useEffect, useMemo, useState } from "react";
import { X, Check } from "lucide-react";
import PageShell from "../../app/layout/PageShell";
import Skeleton from "../../shared/ui/Skeleton";
import { apiGet } from "../../services/api/client";
import { ENDPOINTS } from "../../services/api/endpoints";
import { compareActions, useCompareStore } from "../../features/property-compare/model/compareStore";

function hashScore(id) {
  const s = String(id || "");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function moneyFallback(i) {
  const vals = ["$1800/mo", "$850,000", "$2500/mo"];
  return vals[i % vals.length];
}

function badgeFromScore(s) {
  if (s >= 85) return { label: "OverPriced", cls: "bg-[#EF4444] text-white" };
  if (s >= 70) return { label: "Fair Price", cls: "bg-[#3B82F6] text-white" };
  return { label: "UnderValued", cls: "bg-[#22C55E] text-white" };
}

function TableCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-[#EDEDED] bg-white p-6">
      <div className="text-[14px] font-semibold text-[#111827]">{title}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function MatrixRow({ label, cols }) {
  return (
    <div className="grid grid-cols-[180px_repeat(3,minmax(0,1fr))] gap-3 py-2 text-sm">
      <div className="text-[#111827]">{label}</div>
      {cols.map((c, i) => (
        <div key={i} className="text-center text-[#6B7280]">
          {c}
        </div>
      ))}
    </div>
  );
}

export default function CompareReportPage() {
  const selectedIds = useCompareStore((s) => s.selectedIds);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  //  When entering report, turn compare mode OFF (keep selection)
  useEffect(() => {
    compareActions.stop({ clear: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    Promise.all(
      (selectedIds || []).slice(0, 3).map((id) =>
        apiGet(`${ENDPOINTS.properties}/${id}`).then(
          (d) => d?.item || d?.data?.item || d?.item || null
        )
      )
    )
      .then((arr) => {
        if (!alive) return;
        setItems(arr.filter(Boolean));
      })
      .catch(() => {
        if (!alive) return;
        setItems([]);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [selectedIds]);

  const cols = useMemo(() => {
    const base = items.slice(0, 3);
    while (base.length < 3) base.push(null);
    return base;
  }, [items]);

  const remove = (id) => compareActions.toggleSelect(id);

  const ai = useMemo(() => {
    return cols.map((it, i) => {
      const h = hashScore(it?.id ?? i);
      const fair = 50 + (h % 51); // 50..100
      const conf = 50 + ((h >> 3) % 51);
      const b = badgeFromScore(fair);
      return { fair, conf, badge: b };
    });
  }, [cols]);

  const featureRows = [
    "Elevator",
    "Parking",
    "Balcony",
    "Furnished",
    "Garden",
    "Pool",
    "Gym",
    "Energy Rating",
  ];

  if (!selectedIds?.length && !loading) {
    return (
      <div className="bg-[#FAFAFA]">
        <PageShell className="py-10">
          <div className="rounded-2xl border border-[#EDEDED] bg-white p-6 text-sm text-[#6B7280]">
            Select properties to compare from the Properties page.
          </div>
        </PageShell>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA]">
      <PageShell className="py-10">
        <div className="text-[28px] font-semibold text-[#D66355]">
          Comparison Report
        </div>

        {/* Top cards */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cols.map((it, i) => (
            <div key={i} className="min-w-0">
              {loading ? (
                <div className="rounded-2xl border border-[#EDEDED] bg-white p-4">
                  <Skeleton className="aspect-4/3 w-full rounded-xl" />
                  <Skeleton className="mt-4 h-4 w-2/3" />
                  <Skeleton className="mt-2 h-4 w-1/2" />
                </div>
              ) : it ? (
                <div className="relative overflow-hidden rounded-2xl border border-[#EDEDED] bg-white">
                  <div className="relative aspect-4/3 bg-[#F3F4F6]">
                    <img
                      src={it?.images?.[0] || ""}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => remove(it.id)}
                      className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white shadow hover:bg-black/5"
                      aria-label="Remove"
                    >
                      <X className="h-4 w-4 text-[#111827]" />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="text-[14px] font-semibold text-[#111827]">
                      {it?.title || "Town Center"}
                    </div>
                    <div className="mt-1 text-[12px] font-semibold text-[#D66355]">
                      {it?.priceFormatted || moneyFallback(i)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#EDEDED] bg-white p-6 text-sm text-[#9CA3AF]">
                  Empty slot
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tables */}
        <div className="mt-8 space-y-6">
          <TableCard title="Basic Information">
            <div className="overflow-x-auto">
              <div className="min-w-225 rounded-2xl bg-[#F3F4F6] p-5">
                <div className="space-y-2">
                  <MatrixRow
                    label="Price"
                    cols={cols.map((it, i) =>
                      it ? it?.priceFormatted || moneyFallback(i) : "—"
                    )}
                  />
                  <MatrixRow
                    label="Type"
                    cols={cols.map((it) =>
                      it ? it?.typeLabel || "Apartment (rent)" : "—"
                    )}
                  />
                  <MatrixRow
                    label="Location"
                    cols={cols.map((it) =>
                      it ? it?.locationLabel || "City Center" : "—"
                    )}
                  />
                  <MatrixRow
                    label="Size"
                    cols={cols.map((it) =>
                      it ? it?.sizeLabel || "45 m²" : "—"
                    )}
                  />
                  <MatrixRow
                    label="Bedrooms"
                    cols={cols.map((it) => (it ? it?.bedroomsLabel || "2" : "—"))}
                  />
                  <MatrixRow
                    label="Bathrooms"
                    cols={cols.map((it) => (it ? it?.bathroomsLabel || "1" : "—"))}
                  />
                </div>
              </div>
            </div>
          </TableCard>

          <TableCard title="AI’s Value Insights">
            <div className="overflow-x-auto">
              <div className="min-w-225 rounded-2xl bg-[#F3F4F6] p-5">
                <MatrixRow
                  label="Value Assessment"
                  cols={ai.map((x, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${x.badge.cls}`}
                    >
                      {x.badge.label}
                    </span>
                  ))}
                />
                <MatrixRow
                  label="Fair Value Score"
                  cols={ai.map((x) => `${x.fair}/100`)}
                />
                <MatrixRow
                  label="AI Confidence"
                  cols={ai.map((x) => `${x.conf}%`)}
                />
              </div>
            </div>
          </TableCard>

          <TableCard title="Features & Amenities">
            <div className="overflow-x-auto">
              <div className="min-w-225 rounded-2xl bg-[#F3F4F6] p-5">
                <div className="space-y-2">
                  {featureRows.map((r, ri) => (
                    <MatrixRow
                      key={r}
                      label={r}
                      cols={cols.map((it, ci) => {
                        if (!it) return "—";
                        if (r === "Energy Rating") {
                          return ["B", "A", "C"][ci] || "B";
                        }
                        const yes = ((hashScore(it.id) >> (ri + ci)) & 1) === 1;
                        return yes ? (
                          <span className="inline-flex items-center justify-center">
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#22C55E]/10">
                              <Check className="h-4 w-4 text-[#22C55E]" />
                            </span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center">
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#EF4444]/10">
                              <X className="h-4 w-4 text-[#EF4444]" />
                            </span>
                          </span>
                        );
                      })}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TableCard>

          <TableCard title="Documents & Trusts">
            <div className="overflow-x-auto">
              <div className="min-w-225 rounded-2xl bg-[#F3F4F6] p-5">
                <MatrixRow
                  label="Owner Verified"
                  cols={cols.map((it, ci) =>
                    it ? (
                      <span key={ci} className="inline-flex items-center justify-center">
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-[#22C55E]/10">
                          <Check className="h-4 w-4 text-[#22C55E]" />
                        </span>
                      </span>
                    ) : (
                      "—"
                    )
                  )}
                />
                <MatrixRow
                  label="Available Documents"
                  cols={cols.map((it, ci) => (it ? `${8 + ci * 2} docs` : "—"))}
                />
                <MatrixRow
                  label="Document Status"
                  cols={cols.map((it, ci) =>
                    it ? (
                      <span key={ci} className={ci === 0 ? "text-[#EF4444]" : "text-[#22C55E]"}>
                        {ci === 0 ? "Old" : "Fresh"}
                      </span>
                    ) : (
                      "—"
                    )
                  )}
                />
              </div>
            </div>
          </TableCard>
        </div>
      </PageShell>
    </div>
  );
}