import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import AuthCard from "../../features/auth/ui/AuthCard";
import VerifyCodeForm from "../../features/auth/ui/VerifyCodeForm";
import { normalizeRole, getNextFromSearchParams, safeEncodeNext } from "../../features/auth/model/authFlow";
import { authApi } from "../../services/api/auth";
import { useSessionStore } from "../../entities/session/model/sessionStore";

export default function VerifyCodePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

  const setSession = useSessionStore((s) => s.setSession);

  // ✅ mode decides UI + flow
  const mode = searchParams.get("mode") || "signup"; // signup by default
  const showBackToLogin = mode === "forgot"; // ✅ ONLY forgot flow shows back button

  const role = useMemo(() => normalizeRole(searchParams.get("role")), [searchParams]);
  const email = useMemo(() => String(searchParams.get("email") || "").trim(), [searchParams]);
  const cid = useMemo(() => String(searchParams.get("cid") || "").trim(), [searchParams]);
  const next = searchParams.get("next");

  useEffect(() => {
    if (!email) {
      const fallbackNext = next || encodeURIComponent("/");
      navigate(`/auth/role?next=${fallbackNext}`, { replace: true });
    }
  }, [email, navigate, next]);

  const onSubmit = async ({ code }) => {
    setLoading(true);
    try {
      const data = await authApi.verifyCode({
        email,
        role,
        code,
        challengeId: cid || undefined,
        mode,
      });

      // ✅ Forgot flow: Verify -> Set Password
      if (mode === "forgot") {
        const nextParam = next ? `&next=${safeEncodeNext(next)}` : "";
        const cidParam = cid ? `&cid=${encodeURIComponent(cid)}` : "";
        navigate(
          `/auth/set-password?mode=forgot&role=${encodeURIComponent(role)}&email=${encodeURIComponent(
            email
          )}${cidParam}${nextParam}`,
          { replace: true }
        );
        return;
      }

      // ✅ Signup flow: (no back button) token => auto-login => home/next
      if (data?.token && data?.user) {
        setSession({ token: data.token, user: data.user });
        const finalNext = getNextFromSearchParams(searchParams);
        navigate(finalNext || "/", { replace: true });
        return;
      }

      // fallback -> login
      const nextParam = next ? `&next=${safeEncodeNext(next)}` : "";
      navigate(`/auth/login?role=${encodeURIComponent(role)}${nextParam}`, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await authApi.resendCode({
        email,
        role,
        challengeId: cid || undefined,
        mode,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      align="left"
      title="Verify code"
      subtitle="An authentication code has been sent to your email."
      top={
        showBackToLogin ? (
          <button
            type="button"
            onClick={() => {
              const nextParam = next ? `&next=${safeEncodeNext(next)}` : "";
              navigate(`/auth/login?role=${encodeURIComponent(role)}${nextParam}`);
            }}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#6B7280] hover:text-[#111827] transition"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to login
          </button>
        ) : null
      }
    >
      <VerifyCodeForm loading={loading} onSubmit={onSubmit} onResend={onResend} />
    </AuthCard>
  );
}