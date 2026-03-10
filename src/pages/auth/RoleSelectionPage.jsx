import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";

import AuthCard from "../../features/auth/ui/AuthCard";
import RolePicker from "../../features/auth/ui/RolePicker";
import AuthPrimaryButton from "../../features/auth/ui/AuthPrimaryButton";
import { useSessionStore } from "../../entities/session/model/sessionStore";
import { normalizeRole } from "../../features/auth/model/authFlow";

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  const sessionRole = useSessionStore((s) => s.role);
  const setRole = useSessionStore((s) => s.setRole);

  const initialRole = useMemo(
    () => normalizeRole(searchParams.get("role") || sessionRole),
    [searchParams, sessionRole]
  );

  const [role, setLocalRole] = useState(initialRole);
  const next = searchParams.get("next");

  const containerVariants = shouldReduceMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.34,
            ease: [0.22, 1, 0.36, 1],
            staggerChildren: 0.08,
          },
        },
      };

  const itemVariants = shouldReduceMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.28,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      };

  return (
    <LazyMotion features={domAnimation}>
      <AuthCard
        showLogo={false}
        align="left"
        title="Choose your role Below"
        titleClassName="text-[#D66355] text-[32px] sm:text-[36px]"
        contentClassName="max-w-[860px] mx-auto mt-20"
      >
        <m.div
          className="space-y-12"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? false : "visible"}
        >
          <m.div variants={itemVariants}>
            <RolePicker value={role} onChange={setLocalRole} />
          </m.div>

          <m.div variants={itemVariants} className="flex justify-center">
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
          </m.div>
        </m.div>
      </AuthCard>
    </LazyMotion>
  );
}