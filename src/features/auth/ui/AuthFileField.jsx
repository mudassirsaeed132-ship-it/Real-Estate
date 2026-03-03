import { useRef } from "react";
import { Upload } from "lucide-react";

export default function AuthFileField({ label, value, onFile, placeholder = "IMG-988-000" }) {
  const ref = useRef(null);

  return (
    <div className="w-full">
      <div className="block text-[12px] font-semibold text-[#6B7280] mb-2">
        {label}
      </div>

      <div className="relative">
        <input
          readOnly
          value={value || ""}
          placeholder={placeholder}
          className={[
            "w-full h-[48px] rounded-[10px] border px-4 pr-12 text-[14px] text-[#111827]",
            "border-[#E5E7EB] bg-white",
          ].join(" ")}
          onClick={() => ref.current?.click()}
        />

        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md grid place-items-center hover:bg-black/5"
          aria-label="Upload"
        >
          <Upload className="h-4 w-4 text-[#111827]" />
        </button>

        <input
          ref={ref}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            onFile?.(f);
          }}
        />
      </div>
    </div>
  );
}