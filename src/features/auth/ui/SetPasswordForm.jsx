import { useMemo, useState } from "react";
import AuthPasswordField from "./AuthPasswordField";
import AuthPrimaryButton from "./AuthPrimaryButton";
import { validatePassword } from "../model/validators";

export default function SetPasswordForm({ onSubmit, loading = false }) {
  const [values, setValues] = useState({ password: "", confirm: "" });
  const [touched, setTouched] = useState({});

  const errors = useMemo(() => {
    const e = {};
    const pErr = validatePassword(values.password);
    if (pErr) e.password = pErr;

    if (!values.confirm) e.confirm = "Please re-enter password.";
    if (values.confirm && values.confirm !== values.password) e.confirm = "Passwords do not match.";
    return e;
  }, [values.password, values.confirm]);

  const canSubmit = Object.keys(errors).length === 0 && !loading;

  const change = (name) => (e) => setValues((s) => ({ ...s, [name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ password: true, confirm: true });
    if (!canSubmit) return;
    await onSubmit?.({ password: values.password });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <AuthPasswordField
        label="Create Password"
        value={values.password}
        onChange={change("password")}
        error={touched.password ? errors.password : ""}
      />
      <AuthPasswordField
        label="Re-enter Password"
        value={values.confirm}
        onChange={change("confirm")}
        name="confirmPassword"
        error={touched.confirm ? errors.confirm : ""}
      />

      <AuthPrimaryButton type="submit" disabled={!canSubmit} loading={loading}>
        Set password
      </AuthPrimaryButton>
    </form>
  );
}