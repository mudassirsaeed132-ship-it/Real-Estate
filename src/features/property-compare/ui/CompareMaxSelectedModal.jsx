// PATH: src/features/property-compare/ui/CompareMaxSelectedModal.jsx
import Modal from "../../../shared/ui/Modal";
import { ArrowLeftRight } from "lucide-react";
import { COMPARE_LIMIT, compareActions } from "../model/compareStore";

export default function CompareMaxSelectedModal({ open, onClose, onManage }) {
  const handlePrimary = () => {
    // Figma button text "Start Comparing" hai, but action logically "manage selection" hona chahiye
    // so user remove karke new add kar sake.
    compareActions.closeMaxSelectedModal();
    if (typeof onManage === "function") onManage();
    else compareActions.openSelectionModal();
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
      bodyClassName="px-5 py-8 sm:px-10 sm:py-12"
    >
      <div className="flex flex-col items-center text-center">
        <div className="grid h-12 w-12 place-items-center">
          <ArrowLeftRight className="h-10 w-10 text-[#D66355]" />
        </div>

        <div className="mt-6 text-2xl font-semibold leading-[1.15] text-[#111827] sm:text-[34px]">
          Maximum Properties Selected
        </div>

        <div className="mt-3 max-w-[520px] text-[14px] leading-6 text-[#6B7280] sm:text-[15px]">
          You can compare up to {COMPARE_LIMIT} properties at once. Remove a property from
          your comparison to add a new one.
        </div>

        <button
          type="button"
          onClick={handlePrimary}
          className="mt-8 h-12 w-full max-w-[520px] rounded-2xl bg-[#D66355] text-[14px] font-semibold text-white hover:bg-[#C85A4E]"
        >
          Start Comparing
        </button>

        <div className="mt-4 text-[12px] text-[#6B7280]">
          After starting select any property you want to compare
        </div>
      </div>
    </Modal>
  );
}