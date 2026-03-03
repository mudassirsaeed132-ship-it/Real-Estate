import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthCard from "../../features/auth/ui/AuthCard";
import SignupForm from "../../features/auth/ui/SignupForm";
import { normalizeRole, getNextFromSearchParams } from "../../features/auth/model/authFlow";
import { mapSignupPayload } from "../../features/auth/model/signupForm";
import { authApi } from "../../services/api/auth";
import { uploadsApi } from "../../services/uploads/uploadsApi";
import { useSessionStore } from "../../entities/session/model/sessionStore";

export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const setRole = useSessionStore((s) => s.setRole);
  const setSession = useSessionStore((s) => s.setSession);

  const role = useMemo(() => normalizeRole(searchParams.get("role")), [searchParams]);
  const next = searchParams.get("next");

  // if user hits /auth/signup without role -> send to role selection WITH next preserved
  useEffect(() => {
    if (!searchParams.get("role")) {
      const fallbackNext = next || encodeURIComponent("/");
      navigate(`/auth/role?next=${fallbackNext}`, { replace: true });
    }
  }, [searchParams, navigate, next]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      setRole(role);

      let avatarFileId = null;
      if (values.avatarFile) {
        const up = await uploadsApi.uploadImage(values.avatarFile);
        avatarFileId = up.fileId;
      }

      const payload = mapSignupPayload(values, role, avatarFileId);
      const data = await authApi.register(payload);

      // Auto-login supported
      if (data?.token && data?.user) {
        setSession({ token: data.token, user: data.user });

        const finalNext = getNextFromSearchParams(searchParams);
        navigate(finalNext || "/", { replace: true });
        return;
      }

      // fallback to login (keep next)
      navigate(`/auth/login?role=${role}${next ? `&next=${encodeURIComponent(next)}` : ""}`, {
        replace: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Sign up"
      subtitle="Let’s get you all set up so you can access your personal account."
      top={<div className="h-6" />}
    >
      <SignupForm loading={loading} onSubmit={onSubmit} />

      <div className="mt-5 text-center text-[14px] text-[#111827]">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() =>
            navigate(`/auth/login?role=${role}${next ? `&next=${encodeURIComponent(next)}` : ""}`)
          }
          className="font-semibold text-[#D66355]"
        >
          Login
        </button>
      </div>
    </AuthCard>
  );
}