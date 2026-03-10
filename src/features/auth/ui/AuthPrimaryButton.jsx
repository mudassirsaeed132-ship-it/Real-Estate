export default function AuthPrimaryButton({ children, disabled, loading, ...props }) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        "w-full h-13.5 rounded-full font-semibold text-white",
        "bg-[#D66355] hover:bg-[#c95a4e] transition",
        "disabled:opacity-50 disabled:cursor-not-allowed",
      ].join(" ")}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}