import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthCard from "../../features/auth/ui/AuthCard";
import LoginForm from "../../features/auth/ui/LoginForm";
import { authApi } from "../../services/api/auth";
import { normalizeRole, getNextFromSearchParams, safeEncodeNext } from "../../features/auth/model/authFlow";
import { useSessionStore } from "../../entities/session/model/sessionStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const setSession = useSessionStore((s) => s.setSession);
  const setRemember = useSessionStore((s) => s.setRemember);
  const setRole = useSessionStore((s) => s.setRole);

  const role = useMemo(() => normalizeRole(searchParams.get("role")), [searchParams]);
  const next = searchParams.get("next");

  // if user hits /auth/login without role -> send to role selection WITH next preserved
  useEffect(() => {
    if (!searchParams.get("role")) {
      const fallbackNext = next || encodeURIComponent("/");
      navigate(`/auth/role?next=${fallbackNext}`, { replace: true });
    }
  }, [searchParams, navigate, next]);

  const onSubmit = async ({ email, password, remember }) => {
    setLoading(true);
    try {
      setRemember(remember);
      setRole(role);

      const data = await authApi.login({ email, password, role });
      setSession({ token: data.token, user: data.user });

      const finalNext = getNextFromSearchParams(searchParams);
      navigate(finalNext || "/", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Login" subtitle="Login to access your account" top={<div className="h-6" />}>
      <LoginForm
        loading={loading}
        onSubmit={onSubmit}
        onForgot={() => {
          const nextParam = next ? `&next=${safeEncodeNext(next)}` : "";
          navigate(`/auth/forgot-password?role=${encodeURIComponent(role)}${nextParam}`);
        }}
        onSignup={() => {
          const nextParam = next ? `&next=${safeEncodeNext(next)}` : "";
          navigate(`/auth/signup?role=${encodeURIComponent(role)}${nextParam}`);
        }}
      />
    </AuthCard>
  );
}