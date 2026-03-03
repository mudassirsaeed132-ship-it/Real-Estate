import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthCard from "../../features/auth/ui/AuthCard";
import RolePicker from "../../features/auth/ui/RolePicker";
import AuthPrimaryButton from "../../features/auth/ui/AuthPrimaryButton";
import { useSessionStore } from "../../entities/session/model/sessionStore";
import { normalizeRole } from "../../features/auth/model/authFlow";

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sessionRole = useSessionStore((s) => s.role);
  const setRole = useSessionStore((s) => s.setRole);

  const initialRole = useMemo(
    () => normalizeRole(searchParams.get("role") || sessionRole),
    [searchParams, sessionRole]
  );

  const [role, setLocalRole] = useState(initialRole);
  const next = searchParams.get("next");

  return (
    <AuthCard
      showLogo={false}
      align="left" // ✅ title left
      title="Choose your role Below"
      titleClassName="text-[#D66355] text-[32px] sm:text-[36px]"
      // ✅ increase gap between title and cards by pushing content down
      contentClassName="max-w-[860px] mx-auto mt-20"
    >
      <div className="space-y-12">
        <RolePicker value={role} onChange={setLocalRole} />

        <div className="flex justify-center">
          <div className="w-full max-w-[760px]">
            <AuthPrimaryButton
              disabled={!role}
              onClick={() => {
                setRole(role);
                navigate(
                  `/auth/login?role=${role}${next ? `&next=${encodeURIComponent(next)}` : ""}`
                );
              }}
            >
              Continue
            </AuthPrimaryButton>
          </div>
        </div>
      </div>
    </AuthCard>
  );
}