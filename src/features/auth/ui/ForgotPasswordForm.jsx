import { useMemo, useState } from "react";
import AuthTextField from "./AuthTextField";
import AuthPrimaryButton from "./AuthPrimaryButton";
import { isEmail, required } from "../model/validators";

export default function ForgotPasswordForm({ onSubmit, loading = false }) {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [serverError, setServerError] = useState("");

  const error = useMemo(() => {
    const e = required(email, "Email") || (!isEmail(email) ? "Enter a valid email." : null);
    return e;
  }, [email]);

  const canSubmit = !error && !loading;

  const submit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setServerError("");
    if (!canSubmit) return;

    try {
      await onSubmit?.({ email: email.trim() });
    } catch (err) {
      setServerError(err?.message || "Request failed. Please try again.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <AuthTextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="john.doe@gmail.com"
        autoComplete="email"
        error={touched ? error : ""}
      />

      {serverError ? <div className="text-[13px] text-red-600">{serverError}</div> : null}

      <AuthPrimaryButton type="submit" disabled={!canSubmit} loading={loading}>
        Submit
      </AuthPrimaryButton>
    </form>
  );
}