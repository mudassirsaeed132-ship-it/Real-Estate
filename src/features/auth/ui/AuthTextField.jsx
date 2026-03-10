export default function AuthTextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  name,
  autoComplete,
  error,
}) {
  return (
    <div className="w-full">
      <label className="block text-[12px] font-semibold text-[#6B7280] mb-2">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={[
          "w-full h-12 rounded-[10px] border px-4 text-[14px] text-[#111827]",
          "border-[#E5E7EB] bg-white",
          "focus:outline-none focus:ring-2 focus:ring-[#D66355]/25 focus:border-[#D66355]",
          error ? "border-red-400 focus:border-red-500 focus:ring-red-200" : "",
        ].join(" ")}
      />

      {error ? <div className="mt-2 text-[12px] text-red-600">{error}</div> : null}
    </div>
  );
}