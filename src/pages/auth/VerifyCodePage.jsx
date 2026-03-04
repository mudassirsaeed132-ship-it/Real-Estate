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
  const next = searchParams.get("next");

  const [loading, setLoading] = useState(false);

  const setSession = useSessionStore((s) => s.setSession);

  const role = useMemo(() => normalizeRole(searchParams.get("role")), [searchParams]);
  const email = useMemo(() => String(searchParams.get("email") || "").trim(), [searchParams]);
  const cid = useMemo(() => String(searchParams.get("cid") || "").trim(), [searchParams]);

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
      });

      // ✅ If backend returns token => auto-login then go home/next
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
        <button
          type="button"
          onClick={() => {
            const nextParam = next ? `?next=${safeEncodeNext(next)}` : "";
            navigate(`/auth/login${nextParam}`);
          }}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#6B7280] hover:text-[#111827] transition"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to login
        </button>
      }
    >
      <VerifyCodeForm loading={loading} onSubmit={onSubmit} onResend={onResend} />
    </AuthCard>
  );
}