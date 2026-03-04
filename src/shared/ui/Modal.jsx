// PATH: src/shared/ui/Modal.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/cn";

// Updated widths (Figma-like, responsive)
const WIDTH = {
  sm: "max-w-[560px]",
  md: "max-w-[720px]",
  lg: "max-w-[980px]",
};

const HEIGHT = {
  normal: "max-h-[88vh]",
  tall: "h-[88vh]",
  auto: "max-h-[88vh]",
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
  const reduceMotion = useReducedMotion();
  const panelRef = useRef(null);
  const prevActiveRef = useRef(null);

  const [mounted, setMounted] = useState(Boolean(open));
  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    prevActiveRef.current = document.activeElement;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    const t = setTimeout(() => {
      panelRef.current?.focus?.();
    }, 0);

    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";

      const prev = prevActiveRef.current;
      if (prev && typeof prev.focus === "function") prev.focus();
      prevActiveRef.current = null;
    };
  }, [mounted, onClose]);

  const motionCfg = useMemo(() => {
    const dur = reduceMotion ? 0 : 0.18;
    return {
      overlay: {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: dur } },
        exit: { opacity: 0, transition: { duration: dur } },
      },
      panel: {
        initial: reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98, y: 8 },
        animate: reduceMotion
          ? { opacity: 1 }
          : { opacity: 1, scale: 1, y: 0, transition: { duration: dur, ease: [0.16, 1, 0.3, 1] } },
        exit: reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.98, y: 8, transition: { duration: dur } },
      },
    };
  }, [reduceMotion]);

  if (!mounted) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence
      onExitComplete={() => {
        setMounted(false);
      }}
    >
      {open ? (
        <motion.div
          key="modal-root"
          // ✅ VERY HIGH z-index + isolate fixes Leaflet/map stacking issues
          className="fixed inset-0 z-[9999] isolate"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          {/* Overlay (behind panel) */}
          <motion.button
            type="button"
            className={cn("absolute inset-0 z-0", overlayClassName)}
            aria-label="Close modal overlay"
            onClick={() => (closeOnOverlay ? onClose?.() : null)}
            {...motionCfg.overlay}
          />

          {/* Panel (above overlay) */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "z-10", // ✅ ensure panel above overlay
              "w-[92vw]",
              WIDTH[size] || WIDTH.md,
              HEIGHT[height] || HEIGHT.tall,
              "overflow-hidden bg-white shadow-xl",
              "rounded-2xl",
              "flex flex-col",
              panelClassName
            )}
            {...motionCfg.panel}
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
              <div className="shrink-0 border-t border-[#EDEDED] px-6 py-4">{footer}</div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}