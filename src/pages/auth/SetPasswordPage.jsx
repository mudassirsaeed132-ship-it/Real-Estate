import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthCard from "../../features/auth/ui/AuthCard";
import SetPasswordForm from "../../features/auth/ui/SetPasswordForm";
import { normalizeRole, safeEncodeNext } from "../../features/auth/model/authFlow";
import { authApi } from "../../services/api/auth";

export default function SetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

  const mode = searchParams.get("mode") || "signup";
  const role = useMemo(() => normalizeRole(searchParams.get("role")), [searchParams]);
  const email = useMemo(() => String(searchParams.get("email") || "").trim(), [searchParams]);
  const cid = useMemo(() => String(searchParams.get("cid") || "").trim(), [searchParams]);
  const next = searchParams.get("next");

  // Guard for forgot mode
  useEffect(() => {
    if (mode === "forgot" && !email) {
      const fallbackNext = next || encodeURIComponent("/");
      navigate(`/auth/role?next=${fallbackNext}`, { replace: true });
    }
  }, [mode, email, navigate, next]);

  const onSubmit = async ({ password }) => {
    setLoading(true);
    try {
      await authApi.setPassword({
        email,
        role,
        password,
        challengeId: cid || undefined,
        mode,
      });

      // ✅ Forgot flow: Set Password -> Login
      if (mode === "forgot") {
        const nextParam = next ? `&next=${safeEncodeNext(next)}` : "";
        navigate(`/auth/login?role=${encodeURIComponent(role)}${nextParam}`, { replace: true });
        return;
      }

      // ✅ Signup flow (your existing): Set Password -> Verify Code
      const nextParam = next ? `&next=${safeEncodeNext(next)}` : "";
      const cidParam = cid ? `&cid=${encodeURIComponent(cid)}` : "";
      navigate(
        `/auth/verify-code?role=${encodeURIComponent(role)}&email=${encodeURIComponent(
          email
        )}${cidParam}${nextParam}`,
        { replace: true }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      align="left"
      title="Set a password"
      subtitle="Your previous password has been reseted. Please set a new password for your account."
      titleClassName="mt-14"
    >
      <SetPasswordForm loading={loading} onSubmit={onSubmit} />
    </AuthCard>
  );
}