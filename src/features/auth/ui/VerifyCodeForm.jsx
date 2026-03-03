import { useMemo, useState } from "react";
import AuthTextField from "./AuthTextField";
import AuthPrimaryButton from "./AuthPrimaryButton";

export default function VerifyCodeForm({ onSubmit, onResend, loading = false }) {
  const [code, setCode] = useState("");
  const [touched, setTouched] = useState(false);
  const [serverError, setServerError] = useState("");

  const error = useMemo(() => {
    if (!code.trim()) return "Code is required.";
    if (code.trim().length < 4) return "Enter a valid code.";
    return null;
  }, [code]);

  const canSubmit = !error && !loading;

  const submit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setServerError("");
    if (!canSubmit) return;

    try {
      await onSubmit?.({ code: code.trim() });
    } catch (err) {
      setServerError(err?.message || "Verification failed.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <AuthTextField
        label="Enter Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="7789BM6X"
        error={touched ? error : ""}
      />

      <div className="text-[13px] text-[#111827]">
        Didn’t receive a code?{" "}
        <button
          type="button"
          onClick={onResend}
          className="font-semibold text-[#D66355]"
          disabled={loading}
        >
          Resend
        </button>
      </div>

      {serverError ? <div className="text-[13px] text-red-600">{serverError}</div> : null}

      <AuthPrimaryButton type="submit" disabled={!canSubmit} loading={loading}>
        Verify
      </AuthPrimaryButton>
    </form>
  );
}