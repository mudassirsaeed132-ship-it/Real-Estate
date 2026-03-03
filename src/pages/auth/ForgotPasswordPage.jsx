import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import AuthCard from "../../features/auth/ui/AuthCard";
import ForgotPasswordForm from "../../features/auth/ui/ForgotPasswordForm";
// import { authApi } from "../../services/api/auth"; // if you want API call

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next");
  const [loading, setLoading] = useState(false);

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      // ✅ if you want real flow later:
      // await authApi.forgotPassword({ email });
      // navigate(`/auth/verify-code${next ? `?next=${encodeURIComponent(next)}` : ""}`);

      // For now (UI flow):
      navigate(`/auth/verify-code${next ? `?next=${encodeURIComponent(next)}` : ""}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      align="left" // ✅ THIS is the key to match UI
      title="Forgot your password?"
      subtitle="Don’t worry, happens to all of us. Enter your email below to recover your password"
      top={
        <button
          type="button"
          onClick={() => navigate(`/auth/login${next ? `?next=${encodeURIComponent(next)}` : ""}`)}
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