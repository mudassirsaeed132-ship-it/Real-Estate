import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import AuthCard from "../../features/auth/ui/AuthCard";
import VerifyCodeForm from "../../features/auth/ui/VerifyCodeForm";

export default function VerifyCodePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next");

  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    try {
      navigate(`/auth/set-password${next ? `?next=${encodeURIComponent(next)}` : ""}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      align="left"  // ✅ left align like Forgot Password
      title="Verify code"
      subtitle="An authentication code has been sent to your email."
      top={
        <button
          type="button"
          onClick={() =>
            navigate(`/auth/login${next ? `?next=${encodeURIComponent(next)}` : ""}`)
          }
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#6B7280] hover:text-[#111827] transition"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to login
        </button>
      }
    >
      <VerifyCodeForm loading={loading} onSubmit={onSubmit} onResend={() => {}} />
    </AuthCard>
  );
}