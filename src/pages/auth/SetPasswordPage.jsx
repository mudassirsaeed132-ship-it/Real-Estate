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

  const role = useMemo(() => normalizeRole(searchParams.get("role")), [searchParams]);
  const email = useMemo(() => String(searchParams.get("email") || "").trim(), [searchParams]);
  const cid = useMemo(() => String(searchParams.get("cid") || "").trim(), [searchParams]);
  const next = searchParams.get("next");

  // Guard: if user lands here directly, send back to role picker
  useEffect(() => {
    if (!email) {
      const fallbackNext = next || encodeURIComponent("/");
      navigate(`/auth/role?next=${fallbackNext}`, { replace: true });
    }
  }, [email, navigate, next]);

  const onSubmit = async ({ password }) => {
    setLoading(true);
    try {
      await authApi.setPassword({
        email,
        role,
        password,
        challengeId: cid || undefined,
      });

      // ✅ Figma flow: Set Password -> Verify Code
      const nextParam = next ? `&next=${safeEncodeNext(next)}` : "";
      const cidParam = cid ? `&cid=${encodeURIComponent(cid)}` : "";

      navigate(
        `/auth/verify-code?role=${encodeURIComponent(role)}&email=${encodeURIComponent(email)}${cidParam}${nextParam}`,
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
      subtitle="Please set a new password for your account."
      titleClassName="mt-14"
    >
      <SetPasswordForm loading={loading} onSubmit={onSubmit} />
    </AuthCard>
  );
}