import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

export default function Dropdown({
  value,
  items = [],
  onChange,
  buttonClassName = "",
  menuClassName = "",
  align = "left", // left | right
  width = "trigger", // trigger | auto | number(px)
  renderLabel, // (item) => ReactNode
}) {
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 240 });

  const selected = useMemo(() => {
    return (
      items.find((x) => String(x?.value ?? x?.key) === String(value)) || null
    );
  }, [items, value]);

  const compute = () => {
    const el = btnRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const w =
      width === "trigger"
        ? r.width
        : typeof width === "number"
        ? width
        : 260;

    const left =
      align === "right"
        ? Math.max(8, r.right - w)
        : Math.max(8, r.left);

    setPos({
      top: r.bottom + 8,
      left,
      width: Math.min(w, window.innerWidth - 16),
    });
  };

  useEffect(() => {
    if (!open) return;

    compute();

    const onResize = () => compute();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);

    const onDown = (e) => {
      const btn = btnRef.current;
      const menu = menuRef.current;
      if (!btn || !menu) return;
      if (btn.contains(e.target) || menu.contains(e.target)) return;
      setOpen(false);
    };

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selectedLabel =
    selected?.label ??
    selected?.name ??
    selected?.title ??
    (value != null && value !== "" ? String(value) : "Select");

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center justify-between gap-2 rounded-xl border border-[#EDEDED] bg-white px-4 py-2 text-sm text-[#6B7280] hover:bg-black/5",
          buttonClassName
        )}
      >
        <span className="truncate">
          {renderLabel ? renderLabel(selected) : selectedLabel}
        </span>

        {/* ✅ chevron follows text color (active pills white) */}
        <ChevronDown className="h-4 w-4 opacity-70 text-current" />
      </button>

      {open
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              className={cn(
                // ✅ use real z-index (Tailwind safe)
                "fixed z-[120] overflow-hidden rounded-2xl border border-[#EDEDED] bg-white shadow-xl",
                menuClassName
              )}
              style={{ top: pos.top, left: pos.left, width: pos.width }}
            >
              <div className="max-h-80 overflow-auto py-1">
                {items.map((it, idx) => {
                  const itValue = it?.value ?? it?.key ?? idx;
                  const itLabel =
                    it?.label ?? it?.name ?? it?.title ?? String(itValue);

                  const active = String(itValue) === String(value);

                  return (
                    <button
                      key={String(itValue)}
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        onChange?.(itValue);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-2 text-sm transition",
                        active
                          ? "bg-[#D66355]/10 text-[#D66355]"
                          : "text-[#111827] hover:bg-black/5"
                      )}
                    >
                      <span>{itLabel}</span>

                      {active ? (
                        <span className="text-xs text-[#D66355]">Selected</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}