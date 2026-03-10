import { useMemo } from "react";

function Progress({ step }) {
  const pct = useMemo(() => {
    if (step <= 1) return 33;
    if (step === 2) return 66;
    return 100;
  }, [step]);

  return (
    <div className="mt-3 h-2 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
      <div className="h-full rounded-full bg-[#D66355]" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function PrecheckWizardShell({ step, rightLabel, children }) {
  return (
    <div className="mx-auto w-full max-w-190 rounded-2xl border border-[#EDEDED] bg-white p-5 sm:p-8">
      <div className="flex items-center justify-between text-[12px]">
        <div className="text-[#D66355]">Step {step} of 3</div>
        <div className="text-[#111827]">{rightLabel}</div>
      </div>

      <Progress step={step} />

      <div className="mt-6">{children}</div>
    </div>
  );
}
