import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PageShell from "../../app/layout/PageShell";
import PageHeaderBar from "../../shared/ui/PageHeaderBar";
import { apiGet, apiPost } from "../../services/api/client";
import { ENDPOINTS } from "../../services/api/endpoints";

import PrecheckWizardShell from "../../features/financial-precheck/ui/PrecheckWizardShell";
import PropertyPickerStep from "../../features/financial-precheck/ui/PropertyPickerStep";
import PersonalInfoStep from "../../features/financial-precheck/ui/PersonalInfoStep";
import ResultsStep from "../../features/financial-precheck/ui/ResultsStep";

import { precheckActions, usePrecheckStore } from "../../features/financial-precheck/model/precheckStore";

function PropertyPriceCard({ onContinue }) {
  const selected = usePrecheckStore((s) => s.selected);
  const propertyPrice = usePrecheckStore((s) => s.propertyPrice);

  if (!selected) return null;

  return (
    <div>
      <div className="text-center text-[11px] text-[#9CA3AF]">
        Get a realistic affordability indication for the properties.
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl bg-[#F3F4F6]">
        <div className="aspect-[16/7] w-full">
          <img src={selected.image} alt="" className="h-full w-full object-cover" draggable={false} />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[13px] font-semibold text-[#111827]">{selected.title}</div>
        <div className="mt-1 text-[11px] text-[#6B7280]">{selected.location}</div>

        <div className="mt-4 text-[12px] font-semibold text-[#111827]">Property Price</div>
        <input
          value={propertyPrice}
          onChange={(e) => precheckActions.setPropertyPrice(e.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-[#EDEDED] bg-white px-4 text-[13px] outline-none"
          placeholder="$ 45000"
        />

        <div className="mt-3 text-[11px] text-[#9CA3AF]">
          This is an indicative calculation, not a bank approval.
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="mt-5 h-12 w-full rounded-xl bg-[#D66355] text-[13px] font-semibold text-white hover:bg-[#C85A4E]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default function FinancialPrecheckPage() {
  const navigate = useNavigate();
  const step = usePrecheckStore((s) => s.step);
  const selected = usePrecheckStore((s) => s.selected);
  const form = usePrecheckStore((s) => s.form);
  const propertyPrice = usePrecheckStore((s) => s.propertyPrice);
  const uploads = usePrecheckStore((s) => s.uploads);

  // load recent once
  useEffect(() => {
    precheckActions.setLoading("recent", true);
    apiGet(ENDPOINTS.precheckRecent)
      .then((d) => precheckActions.setRecentItems(d?.items || []))
      .finally(() => precheckActions.setLoading("recent", false));
  }, []);

  const rightLabel =
    step === 1 ? "Property Selection" : step === 2 ? "Your Information" : "Your Results";

  const onCalculate = () => {
    precheckActions.setLoading("calc", true);
    precheckActions.setError("");

    apiPost(ENDPOINTS.precheckCalculate, {
      propertyId: selected?.id,
      propertyPrice,
      income: form.income,
      equity: form.equity,
      includePension: form.includePension,
      monthlyExpenses: form.monthlyExpenses,
      employment: form.employment,
      uploadsCount: uploads?.length || 0,
    })
      .then((d) => {
        precheckActions.setResult(d?.item || null);
        precheckActions.setStep(3);
      })
      .catch((e) => precheckActions.setError(e.message || "Failed"))
      .finally(() => precheckActions.setLoading("calc", false));
  };

  return (
    <div className="bg-[#FAFAFA]">
      <PageShell className="py-8">
        <PageHeaderBar title="Financial Precheck" onBack={() => navigate("/")} />

        <div className="mt-6">
          <PrecheckWizardShell step={step} rightLabel={rightLabel}>
            {step === 1 ? (
              selected ? (
                <PropertyPriceCard onContinue={() => precheckActions.setStep(2)} />
              ) : (
                <PropertyPickerStep />
              )
            ) : step === 2 ? (
              <PersonalInfoStep onCalculate={onCalculate} />
            ) : (
              <ResultsStep />
            )}
          </PrecheckWizardShell>
        </div>
      </PageShell>
    </div>
  );
}
