import { Check, X, Share2, Pencil, TrendingUp, DollarSign, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { precheckActions, usePrecheckStore } from "../model/precheckStore";

function Pill({ ok, label }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold",
        ok ? "bg-[#22C55E]/10 text-[#16A34A]" : "bg-[#FDE2E0] text-[#D66355]",
      ].join(" ")}
    >
      {ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
}

function OverviewRow({ icon, title, value, note, tone }) {
  const toneCls =
    tone === "green"
      ? "bg-[#22C55E]/10 text-[#16A34A]"
      : tone === "red"
        ? "bg-[#FDE2E0] text-[#D66355]"
        : "bg-[#F3F4F6] text-[#6B7280]";

  return (
    <div className="flex items-start gap-3 py-4 border-b border-[#EDEDED] last:border-b-0">
      <div className={`grid h-9 w-9 place-items-center rounded-xl ${toneCls}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] text-[#6B7280]">{title}</div>
        <div className="mt-1 text-[14px] font-semibold text-[#111827]">{value}</div>
        {note ? <div className="mt-1 text-[11px] text-[#D66355]">{note}</div> : null}
      </div>
    </div>
  );
}

export default function ResultsStep() {
  const navigate = useNavigate();
  const result = usePrecheckStore((s) => s.result);

  if (!result) return null;

  const ok = !!result.affordable;

  return (
    <div>
      <div className="flex items-center justify-center">
        <Pill ok={ok} label={result.badge} />
      </div>

      <div className="mt-5 rounded-2xl border border-[#EDEDED] bg-white overflow-hidden">
        <div className="py-4 text-center text-[12px] font-semibold text-[#111827]">
          Financial Overview
        </div>

        <div className="px-5">
          <OverviewRow
            icon={<TrendingUp className="h-4 w-4" />}
            title="Estimated max purchase price"
            value={result.financialOverview?.[0]?.value}
            tone="red"
          />
          <OverviewRow
            icon={<DollarSign className="h-4 w-4" />}
            title="Required equity"
            value={result.financialOverview?.[1]?.value}
            note={result.financialOverview?.[1]?.note}
            tone="green"
          />
          <OverviewRow
            icon={<Home className="h-4 w-4" />}
            title="Estimated monthly housing cost"
            value={result.financialOverview?.[2]?.value}
            note={result.financialOverview?.[2]?.note}
            tone="gray"
          />
        </div>
      </div>

      <div className="mt-5 text-[12px] text-[#111827] font-semibold">Calculation Details:</div>

      <div className="mt-3 grid gap-6 md:grid-cols-2 text-[11px] text-[#6B7280]">
        <ul className="space-y-2 list-disc pl-5">
          {(result.calculationLeft || []).map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
        <ul className="space-y-2 list-disc pl-5">
          {(result.calculationRight || []).map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-2xl border border-[#F59E0B]/30 bg-[#FFFBEB] p-4">
        <div className="text-[12px] font-semibold text-[#D97706]">Important Considerations:</div>
        <ul className="mt-3 space-y-2 text-[11px] text-[#D97706] list-disc pl-5">
          {(result.important || []).map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-2xl border border-[#3B82F6]/30 bg-[#EFF6FF] p-4">
        <div className="text-[12px] font-semibold text-[#2563EB]">Disclaimer:</div>
        <div className="mt-2 text-[11px] text-[#2563EB]">{result.disclaimer}</div>
      </div>

      <button
        type="button"
        onClick={() => navigate("/precheck/share")}
        className="mt-6 h-12 w-full rounded-xl bg-[#D66355] text-[13px] font-semibold text-white hover:bg-[#C85A4E]"
      >
        <span className="inline-flex items-center justify-center gap-2">
          <Share2 className="h-4 w-4" />
          Share with Banks
        </span>
      </button>

      <button
        type="button"
        onClick={() => precheckActions.setStep(2)}
        className="mt-3 h-12 w-full rounded-xl border border-[#D66355] bg-white text-[13px] font-semibold text-[#D66355] hover:bg-[#D66355]/10"
      >
        <span className="inline-flex items-center justify-center gap-2">
          <Pencil className="h-4 w-4" />
          Edit Inputs
        </span>
      </button>
    </div>
  );
}