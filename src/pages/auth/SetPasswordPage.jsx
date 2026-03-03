import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthCard from "../../features/auth/ui/AuthCard";
import SetPasswordForm from "../../features/auth/ui/SetPasswordForm";

export default function SetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next");

  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    try {
      navigate(`/auth/login${next ? `?next=${encodeURIComponent(next)}` : ""}`, {
        replace: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      align="left" // ✅ left align title + subtitle
      title="Set a password"
      subtitle="Your previous password has been reseted. Please set a new password for your account."
      // ✅ add more space between logo and title
      titleClassName="mt-14"
    >
      <SetPasswordForm loading={loading} onSubmit={onSubmit} />
    </AuthCard>
  );
}