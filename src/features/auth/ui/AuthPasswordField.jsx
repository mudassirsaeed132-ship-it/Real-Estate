import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AuthPasswordField({
  label = "Password",
  value,
  onChange,
  name = "password",
  placeholder = "•••••••••••••••",
  autoComplete = "current-password",
  error,
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="w-full">
      <label className="block text-[12px] font-semibold text-[#6B7280] mb-2">
        {label}
      </label>

      <div className="relative">
        <input
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={[
            "w-full h-[48px] rounded-[10px] border px-4 pr-12 text-[14px] text-[#111827]",
            "border-[#E5E7EB] bg-white",
            "focus:outline-none focus:ring-2 focus:ring-[#D66355]/25 focus:border-[#D66355]",
            error ? "border-red-400 focus:border-red-500 focus:ring-red-200" : "",
          ].join(" ")}
        />

        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md grid place-items-center hover:bg-black/5"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <EyeOff className="h-4 w-4 text-[#6B7280]" />
          ) : (
            <Eye className="h-4 w-4 text-[#6B7280]" />
          )}
        </button>
      </div>

      {error ? <div className="mt-2 text-[12px] text-red-600">{error}</div> : null}
    </div>
  );
}