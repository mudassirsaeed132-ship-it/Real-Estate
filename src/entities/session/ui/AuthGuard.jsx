import { Navigate, useLocation } from "react-router-dom";
import { useSessionStore } from "../model/sessionStore";

/**
 * Wrap protected pages:
 * <AuthGuard><Page /></AuthGuard>
 */
export default function AuthGuard({ children, redirectTo = "/auth/login" }) {
  const location = useLocation();
  const token = useSessionStore((s) => s.token);

  if (!token) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${redirectTo}?next=${next}`} replace />;
  }

  return children;
}