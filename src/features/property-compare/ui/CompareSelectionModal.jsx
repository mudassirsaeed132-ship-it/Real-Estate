// PATH: src/features/property-compare/ui/CompareSelectionModal.jsx
import { GripVertical, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Modal from "../../../shared/ui/Modal";
import { COMPARE_LIMIT, compareActions, useCompareStore } from "../model/compareStore";

function pickPrice(item) {
  return (
    item?.priceFormatted ||
    item?.priceLabel ||
    item?.price ||
    item?.priceText ||
    (item?.purpose === "sale" ? "$850,000" : "$2500/mo")
  );
}

export default function CompareSelectionModal({
  open,
  onClose,
  itemsById = {},
  onCompare,
}) {
  const navigate = useNavigate();
  const selectedIds = useCompareStore((s) => s.selectedIds);

  const onRemove = (id) => compareActions.toggleSelect(id);

  const handleCompare = () => {
    compareActions.closeSelectionModal();
    if (typeof onCompare === "function") return onCompare();
    navigate("/compare");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      height="auto"
      overlayClassName="bg-black/40"
      closeOnOverlay
      panelClassName="rounded-2xl"
      bodyClassName="px-5 py-6 sm:px-10 sm:py-10"
    >
      <div className="mx-auto w-full max-w-[520px]">
        <div className="space-y-4">
          {selectedIds.length ? (
            selectedIds.map((id) => {
              const item = itemsById[String(id)];
              const title = item?.title || "Selected Property";
              const price = pickPrice(item);
              const img = item?.images?.[0] || "";

              return (
                <div
                  key={id}
                  className="flex items-center gap-3 rounded-xl border border-[#EDEDED] bg-white p-3"
                >
                  <GripVertical className="h-4 w-4 text-[#9CA3AF]" />

                  <div className="h-10 w-12 overflow-hidden rounded-lg bg-[#F3F4F6]">
                    {img ? (
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-semibold text-[#111827]">
                      {title}
                    </div>
                    <div className="text-[12px] font-semibold text-[#D66355]">
                      {price}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemove(id)}
                    className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5"
                    aria-label="Remove"
                  >
                    <X className="h-4 w-4 text-[#111827] opacity-70" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-[#EDEDED] bg-white p-4 text-sm text-[#6B7280]">
              Select up to {COMPARE_LIMIT} properties to compare.
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleCompare}
          className="mt-8 h-12 w-full rounded-2xl bg-[#D66355] text-[14px] font-semibold text-white hover:bg-[#C85A4E]"
        >
          <span className="inline-flex items-center justify-center gap-2">
            Compare Properties <ArrowRight className="h-4 w-4" />
          </span>
        </button>

        <div className="mt-3 text-center text-[12px] text-[#6B7280]">
          You can compare up to {COMPARE_LIMIT} properties at once
        </div>
      </div>
    </Modal>
  );
}