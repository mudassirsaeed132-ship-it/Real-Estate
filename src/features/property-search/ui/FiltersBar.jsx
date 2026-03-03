import Button from "../../../shared/ui/Button";
import SegmentedControl from "../../../shared/ui/SegmentedControl";
import FilterChip from "./FilterChip";

import viewGridIcon from "../../../assets/icons/view-grid.svg";
import viewMapIcon from "../../../assets/icons/view-map.svg";

import {
  COMPARE_LIMIT,
  compareActions,
  useCompareStore,
} from "../../property-compare/model/compareStore";

function ViewIcon({ src, alt }) {
  return <img src={src} alt={alt} className="h-5 w-5 object-contain" draggable={false} />;
}

export default function FiltersBar({
  chips = [],
  onRemoveChip,
  onSaveSearch,
  view,
  onChangeView,
  meta,
}) {
  const compareEnabled = useCompareStore((s) => s.enabled);
  const selectedCount = useCompareStore((s) => s.selectedIds.length);

  const compareLabel = compareEnabled
    ? `Compare (${selectedCount}/${COMPARE_LIMIT} selected)`
    : "Compare Properties";

  const onCompareClick = () => {
    if (!compareEnabled) {
      compareActions.openStartModal();
      return;
    }
    compareActions.openSelectionModal();
  };

  return (
    <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between min-w-0">
      {/* chips */}
      <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-1">
        {chips.map((c) => (
          <FilterChip
            key={c.key}
            label={c.label}
            onRemove={() => onRemoveChip?.(c.key)}
          />
        ))}
      </div>

      {/* actions */}
      <div className="flex flex-wrap items-center gap-3">
        {/* In compare mode UI usually hides save search */}
        {!compareEnabled ? (
          <Button variant="outline" onClick={onSaveSearch} className="h-10 px-5">
            Save Search
          </Button>
        ) : null}

        <Button
          onClick={onCompareClick}
          className={`h-10 px-5 bg-[#D66355] text-white hover:bg-[#C85A4E] ${
            compareEnabled ? "min-w-[320px] px-6" : ""
          }`}
        >
          {compareLabel}
        </Button>

        <SegmentedControl
          variant="attached"
          size="md"
          value={view}
          onChange={onChangeView}
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

        {meta ? (
          <div className="w-full text-sm text-[#6B7280] lg:w-auto lg:text-right">
            {meta.total} Results
          </div>
        ) : null}
      </div>
    </div>
  );
}
