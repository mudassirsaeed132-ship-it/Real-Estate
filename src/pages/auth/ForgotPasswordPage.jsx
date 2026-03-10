import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import AuthCard from "../../features/auth/ui/AuthCard";
import ForgotPasswordForm from "../../features/auth/ui/ForgotPasswordForm";
import { normalizeRole, safeEncodeNext } from "../../features/auth/model/authFlow";
import { authApi } from "../../services/api/auth";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

  const role = useMemo(() => normalizeRole(searchParams.get("role")), [searchParams]);
  const next = searchParams.get("next");

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      const data = await authApi.forgotPassword({ email, role, mode: "forgot" });
      const cid = data?.challengeId ? String(data.challengeId) : "";

      const nextParam = next ? `&next=${safeEncodeNext(next)}` : "";
      const cidParam = cid ? `&cid=${encodeURIComponent(cid)}` : "";

      //  forgot flow => verify-code (with mode=forgot)
      navigate(
        `/auth/verify-code?mode=forgot&role=${encodeURIComponent(role)}&email=${encodeURIComponent(
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
      title="Forgot your password?"
      subtitle="Don’t worry, happens to all of us. Enter your email below to recover your password"
      top={
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
      }
    >
      <ForgotPasswordForm loading={loading} onSubmit={onSubmit} />
    </AuthCard>
  );
}