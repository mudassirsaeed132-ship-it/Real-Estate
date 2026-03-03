import { useEffect, useMemo, useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { apiGet } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";
import { precheckActions, usePrecheckStore } from "../model/precheckStore";

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full pb-3 text-[12px] font-semibold",
        active ? "text-[#111827]" : "text-[#9CA3AF]",
      ].join(" ")}
    >
      {children}
      <div className={active ? "mt-3 h-[2px] w-full bg-[#111827]" : "mt-3 h-[2px] w-full bg-transparent"} />
    </button>
  );
}

function PickRow({ item, onPick }) {
  return (
    <button
      type="button"
      onClick={() => onPick(item)}
      className="w-full rounded-2xl border border-[#EDEDED] bg-white px-4 py-4 text-left hover:bg-black/[0.02]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img src={item.thumb} alt="" className="h-10 w-10 rounded-xl object-cover" draggable={false} />
          <div className="min-w-0">
            <div className="truncate text-[12px] font-semibold text-[#111827]">{item.title}</div>
            <div className="mt-1 text-[12px] font-semibold text-[#D66355]">{item.price}</div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-[#9CA3AF]" />
      </div>
    </button>
  );
}

export default function PropertyPickerStep() {
  const tab = usePrecheckStore((s) => s.tab);
  const recentItems = usePrecheckStore((s) => s.recentItems);
  const searchItems = usePrecheckStore((s) => s.searchItems);
  const searchQuery = usePrecheckStore((s) => s.searchQuery);
  const loadingSearch = usePrecheckStore((s) => s.loading.search);

  const [localQ, setLocalQ] = useState(searchQuery);

  // ✅ debounce search
  useEffect(() => {
    if (tab !== "search") return;

    const t = setTimeout(() => {
      precheckActions.setSearchQuery(localQ);

      precheckActions.setLoading("search", true);
      apiGet(`${ENDPOINTS.precheckSearch}?q=${encodeURIComponent(localQ || "")}`)
        .then((d) => precheckActions.setSearchItems(d?.items || []))
        .finally(() => precheckActions.setLoading("search", false));
    }, 350);

    return () => clearTimeout(t);
  }, [localQ, tab]);

  const items = useMemo(() => (tab === "recent" ? recentItems : searchItems), [tab, recentItems, searchItems]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        <TabButton active={tab === "recent"} onClick={() => precheckActions.setTab("recent")}>
          Recent Properties
        </TabButton>
        <TabButton active={tab === "search"} onClick={() => precheckActions.setTab("search")}>
          Search Properties
        </TabButton>
      </div>

      {tab === "search" ? (
        <div className="mt-4">
          <div className="flex items-center gap-3 rounded-2xl border border-[#EDEDED] bg-white px-4 py-3">
            <Search className="h-4 w-4 text-[#111827]" />
            <input
              value={localQ}
              onChange={(e) => setLocalQ(e.target.value)}
              placeholder="Search property"
              className="w-full bg-transparent text-[13px] outline-none"
            />
          </div>
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        {loadingSearch && tab === "search" ? (
          <div className="text-center text-sm text-[#6B7280]">Searching…</div>
        ) : items.length ? (
          items.map((it) => <PickRow key={it.id} item={it} onPick={precheckActions.selectProperty} />)
        ) : (
          <div className="text-center text-sm text-[#9CA3AF]">No properties</div>
        )}
      </div>
    </div>
  );
}