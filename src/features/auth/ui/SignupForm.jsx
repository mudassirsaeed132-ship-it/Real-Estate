import { useMemo, useState } from "react";
import AuthTextField from "./AuthTextField";
import AuthFileField from "./AuthFileField";
import AuthPrimaryButton from "./AuthPrimaryButton";
import { isEmail, required } from "../model/validators";
import { signupInitialValues } from "../model/signupForm";

export default function SignupForm({ onSubmit, loading = false }) {
  const [values, setValues] = useState(signupInitialValues());
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");

  const errors = useMemo(() => {
    const e = {};
    const fn = required(values.firstName, "First Name");
    if (fn) e.firstName = fn;

    const ln = required(values.lastName, "Last Name");
    if (ln) e.lastName = ln;

    const em = required(values.email, "Email") || (!isEmail(values.email) ? "Enter a valid email." : null);
    if (em) e.email = em;

    const ph = required(values.phone, "Phone no");
    if (ph) e.phone = ph;

    if (!values.acceptTerms) e.acceptTerms = "Please accept terms to continue.";
    return e;
  }, [values.firstName, values.lastName, values.email, values.phone, values.acceptTerms]);

  const canSubmit = Object.keys(errors).length === 0 && !loading;

  const change = (name) => (e) => {
    const v = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setValues((s) => ({ ...s, [name]: v }));
  };

  const onFile = (file) => {
    if (!file) {
      setValues((s) => ({ ...s, avatarFile: null, avatarFileName: "" }));
      return;
    }
    setValues((s) => ({ ...s, avatarFile: file, avatarFileName: file.name }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, email: true, phone: true, acceptTerms: true });
    setServerError("");
    if (!canSubmit) return;

    try {
      await onSubmit?.(values);
    } catch (err) {
      setServerError(err?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AuthTextField
          label="First Name"
          value={values.firstName}
          onChange={change("firstName")}
          error={touched.firstName ? errors.firstName : ""}
        />
        <AuthTextField
          label="Last Name"
          value={values.lastName}
          onChange={change("lastName")}
          error={touched.lastName ? errors.lastName : ""}
        />
      </div>

      <AuthTextField
        label="Email"
        value={values.email}
        onChange={change("email")}
        placeholder="john.doe@gmail.com"
        autoComplete="email"
        error={touched.email ? errors.email : ""}
      />

      <AuthTextField
        label="Phone no"
        value={values.phone}
        onChange={change("phone")}
        placeholder="+92 6728769"
        error={touched.phone ? errors.phone : ""}
      />

      <AuthFileField
        label="Upload image file"
        value={values.avatarFileName}
        onFile={onFile}
        placeholder="IMG-988-000"
      />

      <div className="pt-1">
        <label className="inline-flex items-center gap-2 text-[13px] text-[#111827]">
          <input
            type="checkbox"
            checked={values.acceptTerms}
            onChange={change("acceptTerms")}
            className="h-4 w-4 rounded border-[#D1D5DB] text-[#D66355] focus:ring-[#D66355]/30"
          />
          <span>
            I agree to all the <span className="text-[#D66355] font-semibold">Terms</span> and{" "}
            <span className="text-[#D66355] font-semibold">Privacy Policies</span>
          </span>
        </label>

        {touched.acceptTerms && errors.acceptTerms ? (
          <div className="mt-2 text-[12px] text-red-600">{errors.acceptTerms}</div>
        ) : null}
      </div>

      {serverError ? <div className="text-[13px] text-red-600">{serverError}</div> : null}

      <AuthPrimaryButton type="submit" disabled={!canSubmit} loading={loading}>
        Create account
      </AuthPrimaryButton>
    </form>
  );
}