// PATH: src/features/property-compare/ui/CompareModalsHost.jsx
import { useNavigate } from "react-router-dom";
import { compareActions, useCompareStore } from "../model/compareStore";

import CompareStartModal from "./CompareStartModal";
import CompareSelectionModal from "./CompareSelectionModal";
import CompareMaxSelectedModal from "./CompareMaxSelectedModal";

export default function CompareModalsHost() {
  const navigate = useNavigate();

  const startOpen = useCompareStore((s) => s.startModalOpen);
  const selectionOpen = useCompareStore((s) => s.selectionModalOpen);
  const maxOpen = useCompareStore((s) => s.maxSelectedModalOpen);
  const itemsById = useCompareStore((s) => s.selectedItemsById);

  return (
    <>
      <CompareStartModal
        open={startOpen}
        onClose={compareActions.closeStartModal}
        onStart={() => compareActions.enableCompare({ clear: true })}
      />

      <CompareSelectionModal
        open={selectionOpen}
        onClose={compareActions.closeSelectionModal}
        itemsById={itemsById}
      />

      <CompareMaxSelectedModal
        open={maxOpen}
        onClose={compareActions.closeMaxSelectedModal}
        itemsById={itemsById}
        onManage={() => {
          compareActions.closeMaxSelectedModal();
          compareActions.openSelectionModal();
        }}
        onCompare={() => {
          compareActions.closeMaxSelectedModal();
          navigate("/compare");
        }}
      />
    </>
  );
}