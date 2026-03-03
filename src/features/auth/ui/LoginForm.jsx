import { useMemo, useState } from "react";
import AuthTextField from "./AuthTextField";
import AuthPasswordField from "./AuthPasswordField";
import AuthPrimaryButton from "./AuthPrimaryButton";
import { isEmail, required } from "../model/validators";

export default function LoginForm({ onSubmit, onForgot, onSignup, loading = false, defaultRemember = true }) {
  const [values, setValues] = useState({ email: "", password: "", remember: defaultRemember });
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");

  const errors = useMemo(() => {
    const e = {};
    const emailErr = required(values.email, "Email") || (!isEmail(values.email) ? "Enter a valid email." : null);
    if (emailErr) e.email = emailErr;

    const passErr = required(values.password, "Password");
    if (passErr) e.password = passErr;
    return e;
  }, [values.email, values.password]);

  const canSubmit = Object.keys(errors).length === 0 && !loading;

  const change = (name) => (ev) => {
    const v = ev?.target?.type === "checkbox" ? ev.target.checked : ev.target.value;
    setValues((s) => ({ ...s, [name]: v }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setServerError("");
    if (!canSubmit) return;

    try {
      await onSubmit?.(values);
    } catch (err) {
      setServerError(err?.message || "Login failed. Please try again.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <AuthTextField
        label="Email"
        value={values.email}
        onChange={change("email")}
        placeholder="john.doe@gmail.com"
        autoComplete="email"
        error={touched.email ? errors.email : ""}
      />

      <AuthPasswordField
        label="Password"
        value={values.password}
        onChange={change("password")}
        error={touched.password ? errors.password : ""}
      />

      <div className="flex items-center justify-between pt-1">
        <label className="inline-flex items-center gap-2 text-[13px] text-[#111827]">
          <input
            type="checkbox"
            checked={values.remember}
            onChange={change("remember")}
            className="h-4 w-4 rounded border-[#D1D5DB] text-[#D66355] focus:ring-[#D66355]/30"
          />
          Remember me
        </label>

        <button type="button" onClick={onForgot} className="text-[13px] font-semibold text-[#D66355]">
          Forgot Password
        </button>
      </div>

      {serverError ? <div className="text-[13px] text-red-600">{serverError}</div> : null}

      <AuthPrimaryButton type="submit" disabled={!canSubmit} loading={loading}>
        Login
      </AuthPrimaryButton>

      <div className="text-center text-[14px] text-[#111827]">
        Don’t have an account?{" "}
        <button type="button" onClick={onSignup} className="font-semibold text-[#D66355]">
          Sign up
        </button>
      </div>
    </form>
  );
}