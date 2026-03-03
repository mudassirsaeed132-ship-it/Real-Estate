// PATH: src/features/property-search/ui/QuickFiltersRow.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, Bookmark } from "lucide-react";

import Dropdown from "../../../shared/ui/Dropdown";
import Button from "../../../shared/ui/Button";
import SegmentedControl from "../../../shared/ui/SegmentedControl";

import viewGridIcon from "../../../assets/icons/view-grid.svg";
import viewMapIcon from "../../../assets/icons/view-map.svg";

import CompareStartModal from "../../property-compare/ui/CompareStartModal";
import CompareSelectionModal from "../../property-compare/ui/CompareSelectionModal";
import CompareMaxSelectedModal from "../../property-compare/ui/CompareMaxSelectedModal";

import {
  COMPARE_LIMIT,
  compareActions,
  useCompareStore,
} from "../../property-compare/model/compareStore";

const PURPOSE_ITEMS = [
  { value: "sale", label: "For Sale" },
  { value: "rent", label: "For Rent" },
];

const NEW_ITEMS = [
  { value: "", label: "New" },
  { value: "true", label: "Only New" },
  { value: "false", label: "Not New" },
];

const ROOMS_ITEMS = [
  { value: "", label: "Single room" },
  { value: "1", label: "1 room" },
  { value: "2", label: "2 rooms" },
  { value: "3", label: "3 rooms" },
  { value: "4", label: "4+ rooms" },
];

const BATHS_ITEMS = [
  { value: "", label: "1 bathroom" },
  { value: "1", label: "1 bathroom" },
  { value: "2", label: "2 bathrooms" },
  { value: "3", label: "3+ bathrooms" },
];

const BALCONY_ITEMS = [
  { value: "", label: "No Balcony" },
  { value: "no", label: "No Balcony" },
  { value: "yes", label: "Has Balcony" },
];

function formatResults(total = 0) {
  if (total >= 1000) return `${(total / 1000).toFixed(1)}k`;
  return `${total}`;
}

function PillDropdown({ value, items, onChange, active }) {
  return (
    <Dropdown
      value={value}
      items={items}
      onChange={onChange}
      width={220}
      buttonClassName={
        active
          ? "!h-10 !rounded-full !border-[#D66355] !bg-[#D66355] !px-4 !py-2 !text-sm !text-white shadow-sm"
          : "!h-10 !rounded-full !border-[#EDEDED] !bg-white !px-4 !py-2 !text-sm !text-[#111827] shadow-sm hover:bg-black/5"
      }
    />
  );
}

function ViewIcon({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-5 w-5 object-contain"
      draggable={false}
    />
  );
}

export default function QuickFiltersRow({
  title = "Houses",
  meta,
  params,
  setParam,
  view,
  onChangeView,
  onSaveSearch,
}) {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("purpose");

  const compareEnabled = useCompareStore((s) => s.enabled);
  const selectedCount = useCompareStore((s) => s.selectedIds.length);

  const startModalOpen = useCompareStore((s) => s.startModalOpen);
  const selectionModalOpen = useCompareStore((s) => s.selectionModalOpen);
  const maxSelectedModalOpen = useCompareStore((s) => s.maxSelectedModalOpen);

  // ✅ IMPORTANT: use store items (works even across pagination/map)
  const itemsById = useCompareStore((s) => s.selectedItemsById);

  const compareLabel =
    selectedCount > 0
      ? `Compare (${selectedCount}/${COMPARE_LIMIT} selected)`
      : "Compare Properties";

  const onCompareClick = () => {
    // ✅ Store decides:
    // - if compare off & nothing selected -> Start modal
    // - else -> Selection modal
    compareActions.openSelectionModal();
  };

  const onGoCompare = () => {
    compareActions.closeSelectionModal();
    navigate("/compare");
  };

  return (
    <>
      <div className="mt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-semibold text-[#111827]">{title}</h1>
            <span className="text-sm text-[#6B7280]">
              {formatResults(meta?.total || 0)} results
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between min-w-0">
          <div className="flex min-w-0 items-center gap-3 overflow-x-auto pb-1">
            <div onPointerDownCapture={() => setActiveKey("purpose")}>
              <PillDropdown
                value={params.purpose || "sale"}
                items={PURPOSE_ITEMS}
                onChange={(v) => {
                  setActiveKey("purpose");
                  setParam("purpose", v);
                }}
                active={activeKey === "purpose"}
              />
            </div>

            <div onPointerDownCapture={() => setActiveKey("new")}>
              <PillDropdown
                value={params.new ?? ""}
                items={NEW_ITEMS}
                onChange={(v) => {
                  setActiveKey("new");
                  setParam("new", v);
                }}
                active={activeKey === "new"}
              />
            </div>

            <div onPointerDownCapture={() => setActiveKey("rooms")}>
              <PillDropdown
                value={params.rooms ?? ""}
                items={ROOMS_ITEMS}
                onChange={(v) => {
                  setActiveKey("rooms");
                  setParam("rooms", v);
                }}
                active={activeKey === "rooms"}
              />
            </div>

            <div onPointerDownCapture={() => setActiveKey("baths")}>
              <PillDropdown
                value={params.baths ?? ""}
                items={BATHS_ITEMS}
                onChange={(v) => {
                  setActiveKey("baths");
                  setParam("baths", v);
                }}
                active={activeKey === "baths"}
              />
            </div>

            <div onPointerDownCapture={() => setActiveKey("balcony")}>
              <PillDropdown
                value={params.balcony ?? ""}
                items={BALCONY_ITEMS}
                onChange={(v) => {
                  setActiveKey("balcony");
                  setParam("balcony", v);
                }}
                active={activeKey === "balcony"}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={onSaveSearch}
              className="h-10 px-5 border-[#D66355] text-[#D66355] hover:bg-[#D66355]/10"
            >
              <span className="inline-flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Save Search
              </span>
            </Button>

            <Button
              onClick={onCompareClick}
              className="h-10 px-5 bg-[#D66355] text-white hover:bg-[#C85A4E]"
            >
              <span className="inline-flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4" />
                {compareLabel}
              </span>
            </Button>

            <SegmentedControl
              variant="attached"
              size="md"
              value={view}
              onChange={(v) => onChangeView?.(v)}
              options={[
                {
                  value: "grid",
                  ariaLabel: "Grid view",
                  icon: <ViewIcon src={viewGridIcon} alt="Grid" />,
                  buttonClassName: "bg-[#F7E5E2]",
                },
                {
                  value: "map",
                  ariaLabel: "Map view",
                  icon: <ViewIcon src={viewMapIcon} alt="Map" />,
                  buttonClassName: "bg-white",
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Start Comparing */}
      <CompareStartModal
        open={startModalOpen}
        onClose={() => compareActions.closeStartModal()}
        onStart={() => compareActions.enableCompare()}
      />

      {/* Too many selected */}
      <CompareMaxSelectedModal
        open={maxSelectedModalOpen}
        onClose={() => compareActions.closeMaxSelectedModal()}
        itemsById={itemsById}
        onManage={() => {
          compareActions.closeMaxSelectedModal();
          compareActions.openSelectionModal();
        }}
      />

      {/* Selected list */}
      <CompareSelectionModal
        open={selectionModalOpen}
        onClose={() => compareActions.closeSelectionModal()}
        itemsById={itemsById}
        onCompare={onGoCompare}
      />
    </>
  );
}