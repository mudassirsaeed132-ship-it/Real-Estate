import { useState } from "react";
import Input from "../../../shared/ui/Input";
import IconButton from "../../../shared/ui/IconButton";

function EyeIcon({ off }) {
  return (
    <span aria-hidden="true" style={{ fontSize: 16, lineHeight: "16px" }}>
      {off ? "🙈" : "👁️"}
    </span>
  );
}

export default function PasswordField({
  label = "Password",
  value,
  onChange,
  name = "password",
  error,
  placeholder = "••••••••",
}) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <Input
        label={label}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
      />

      <div style={{ position: "absolute", right: 10, top: 34 }}>
        <IconButton aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((s) => !s)}>
          <EyeIcon off={show} />
        </IconButton>
      </div>
    </div>
  );
}