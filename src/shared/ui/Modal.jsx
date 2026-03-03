// PATH: src/shared/ui/Modal.jsx
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/cn";

// ✅ Updated widths (Figma-like, responsive)
const WIDTH = {
  sm: "max-w-[560px]",
  md: "max-w-[720px]",
  lg: "max-w-[980px]",
};

const HEIGHT = {
  normal: "max-h-[88vh]",
  tall: "h-[88vh]",
  auto: "max-h-[88vh]", // ✅ previously empty, now safe for big content too
};

export default function Modal({
  open,
  onClose,
  title,
  header,
  footer,
  children,
  size = "md",
  height = "tall",
  overlayClassName = "bg-black/40",
  panelClassName = "",
  bodyClassName = "",
  closeOnOverlay = true,
}) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <button
        type="button"
        className={cn("absolute inset-0", overlayClassName)}
        aria-label="Close modal overlay"
        onClick={() => (closeOnOverlay ? onClose?.() : null)}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[92vw]",
          WIDTH[size] || WIDTH.md,
          HEIGHT[height] || HEIGHT.tall,
          "overflow-hidden bg-white shadow-xl",
          "rounded-2xl",
          "flex flex-col",
          panelClassName
        )}
      >
        {header ? (
          <div className="shrink-0">{header}</div>
        ) : title ? (
          <div className="shrink-0 border-b border-[#EDEDED] px-6 py-5">
            <h3 className="text-base font-semibold text-[#111827]">{title}</h3>
          </div>
        ) : null}

        <div className={cn("flex-1 overflow-auto", bodyClassName)}>{children}</div>

        {footer ? (
          <div className="shrink-0 border-t border-[#EDEDED] px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}