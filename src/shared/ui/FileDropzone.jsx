import { useId, useRef, useState } from "react";
import { cn } from "../lib/cn";

export default function FileDropzone({
  value = "",
  onFile,
  placeholder = "Choose file",
  accept = "image/*",
  disabled = false,
  className,
}) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (fileList) => {
    const file = fileList?.[0] || null;
    onFile?.(file);
  };

  const browse = () => {
    if (disabled) return;
    if (inputRef.current) inputRef.current.value = "";
    inputRef.current?.click();
  };

  const clear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inputRef.current) inputRef.current.value = "";
    onFile?.(null);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (disabled) return;
    handleFiles(e.dataTransfer?.files);
  };

  const hasValue = !!value;

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      onClick={browse}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          browse();
        }
      }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        "w-full rounded-2xl border border-dashed p-4 text-left transition",
        "flex items-center justify-between gap-3",
        dragActive ? "border-[#D66355] bg-[#FDE2E0]" : "border-[#D1D5DB] bg-white",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className
      )}
      aria-label="Upload file"
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled}
      />

      <div className="min-w-0">
        <div className={cn("truncate text-[13px] font-semibold", hasValue ? "text-[#111827]" : "text-[#9CA3AF]")}>
          {hasValue ? value : placeholder}
        </div>
        <div className="mt-1 text-[11px] text-[#6B7280]">
          {hasValue ? "Click to change" : "Click to browse or drag & drop"}
        </div>
      </div>

      <div className="shrink-0">
        {hasValue ? (
          <button
            type="button"
            onClick={clear}
            className="text-[12px] font-semibold text-[#D66355] hover:underline"
          >
            Remove
          </button>
        ) : (
          <span className="text-[12px] font-semibold text-[#D66355]">Browse</span>
        )}
      </div>
    </div>
  );
}
