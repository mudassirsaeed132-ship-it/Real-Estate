// PATH: src/pages/properties/PropertiesPage.jsx
import { useEffect, useState, lazy, Suspense } from "react";

import PageShell from "../../app/layout/PageShell";
import FiltersModal from "../../features/property-search/ui/FiltersModal";
import QuickFiltersRow from "../../features/property-search/ui/QuickFiltersRow";
import PropertiesTopSearchBar from "../../features/property-search/ui/PropertiesTopSearchBar";
import FiltersBar from "../../features/property-search/ui/FiltersBar";

import { usePropertySearch } from "../../features/property-search/model/usePropertySearch";
import { getProperties } from "../../services/api/properties";
import PropertyGrid from "../../widgets/property/PropertyGrid";
import Skeleton from "../../shared/ui/Skeleton";

import { buildFilterChips, removeChip } from "../../features/property-search/model/filters";

// compare
import { compareActions } from "../../features/property-compare/model/compareStore";

// LAZY: map heavy bundle split
const PropertiesMap = lazy(() => import("../../widgets/map/PropertiesMap"));

export default function PropertiesPage() {
  const { params, setParam, clearAll } = usePropertySearch();
  const [openFilters, setOpenFilters] = useState(false);

  const [loading, setLoading] = useState(true);
  const [resp, setResp] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.purpose) setParam("purpose", "sale");
    if (!params.view) setParam("view", "grid");
    if (!params.page) setParam("page", "1");
    if (!params.pageSize) setParam("pageSize", "20");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      compareActions.stop({ clear: false });
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");

    const query = {
      ...params,
      purpose: params.purpose || "sale",
      view: params.view || "grid",
      page: params.page || "1",
      pageSize: params.pageSize || "20",
    };

    getProperties(query)
      .then((data) => setResp(data))
      .catch((e) => setError(e.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [params]);

  const items = resp?.items || [];
  const meta = resp?.meta || null;
  const view = params.view || "grid";
  const skeletonCount = Number(params.pageSize || 20);

  const chips = buildFilterChips(params);

  return (
    <PageShell className="py-6 min-w-0">
      <PropertiesTopSearchBar
        params={params}
        setParam={setParam}
        onOpenFilters={() => setOpenFilters(true)}
      />

      <QuickFiltersRow
        title="Houses"
        meta={meta}
        params={params}
        setParam={setParam}
        view={view}
        onChangeView={(v) => setParam("view", v)}
        onSaveSearch={() => alert("Saved (dummy)")}
        items={items}
      />

      {chips.length ? (
        <FiltersBar
          chips={chips}
          view={view}
          meta={meta}
          onChangeView={(v) => setParam("view", v)}
          onSaveSearch={() => alert("Saved (dummy)")}
          onRemoveChip={(chipKey) => {
            const chip = chips.find((c) => c.key === chipKey);
            removeChip({ chip, params, setParam });
          }}
        />
      ) : null}

      <FiltersModal
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        params={params}
        setParam={setParam}
        onClear={clearAll}
      />

      <div className="mt-6 min-w-0">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 min-w-0">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <div
                key={i}
                className="min-w-0 rounded-2xl border border-[#EDEDED] bg-white p-4"
              >
                <Skeleton className="aspect-4/3 w-full" />
                <Skeleton className="mt-4 h-4 w-3/4" />
                <Skeleton className="mt-2 h-4 w-2/3" />
                <Skeleton className="mt-4 h-10 w-full" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-[#EDEDED] bg-white p-6 text-center">
            <div className="text-base font-semibold text-[#111827]">No results found</div>
            <div className="mt-1 text-sm text-[#6B7280]">
              Try adjusting filters or clearing all.
            </div>
            <button
              type="button"
              onClick={clearAll}
              className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-[#D66355] px-6 text-sm font-semibold text-[#D66355] hover:bg-[#D66355]/10"
            >
              Clear all filters
            </button>
          </div>
        ) : view === "map" ? (
          <div className="min-w-0">
            <Suspense
              fallback={
                <div className="min-w-0 rounded-2xl border border-[#EDEDED] bg-white p-4">
                  <Skeleton className="h-105 md:h-130 w-full rounded-xl" />
                </div>
              }
            >
              <PropertiesMap items={items} />
            </Suspense>
          </div>
        ) : (
          <div className="min-w-0">
            <PropertyGrid items={items} />
          </div>
        )}

        {/*  Pagination UI removed (Page X of Y + Previous/Next) */}
      </div>
    </PageShell>
  );
}