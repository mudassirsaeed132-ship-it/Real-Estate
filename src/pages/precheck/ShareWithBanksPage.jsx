import { useNavigate } from "react-router-dom";
import { FileText, Image as ImageIcon, MapPin } from "lucide-react";

import PageShell from "../../app/layout/PageShell";
import PageHeaderBar from "../../shared/ui/PageHeaderBar";
import { apiPost } from "../../services/api/client";
import { ENDPOINTS } from "../../services/api/endpoints";
import { precheckActions, usePrecheckStore } from "../../features/financial-precheck/model/precheckStore";

function Item({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#F3F4F6] px-4 py-4">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-white">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[12px] font-semibold text-[#111827]">{title}</div>
        <div className="mt-1 text-[11px] text-[#9CA3AF]">{subtitle}</div>
      </div>
    </div>
  );
}

export default function ShareWithBanksPage() {
  const navigate = useNavigate();
  const consent = usePrecheckStore((s) => s.shareConsent);
  const loading = usePrecheckStore((s) => s.loading.share);

  const onSend = () => {
    precheckActions.setLoading("share", true);

    apiPost(ENDPOINTS.precheckShare, { consent: true })
      .then(() => {
        alert("Sent to banks (dummy)");
        navigate("/precheck");
      })
      .catch((e) => alert(e.message || "Failed"))
      .finally(() => precheckActions.setLoading("share", false));
  };

  return (
    <div className="bg-[#FAFAFA]">
      <PageShell className="py-8">
        <PageHeaderBar title="Share with Partner Banks?" onBack={() => navigate("/precheck")} />

        <div className="mt-6 mx-auto w-full max-w-190 rounded-2xl border border-[#EDEDED] bg-white p-5 sm:p-8">
          <div className="text-[11px] text-[#9CA3AF]">
            We'll share your financial summary with our trusted partner banks to help you get the best mortgage offers.
          </div>

          <div className="mt-5 space-y-3">
            <Item
              icon={<FileText className="h-4 w-4 text-[#D66355]" />}
              title="Financial overview"
              subtitle="Income, equity, and expenses"
            />
            <Item
              icon={<ImageIcon className="h-4 w-4 text-[#D66355]" />}
              title="Uploaded documents"
              subtitle="Salary slips and tax returns (if any)"
            />
            <Item
              icon={<MapPin className="h-4 w-4 text-[#D66355]" />}
              title="Selected property details"
              subtitle="Location and price information"
            />
          </div>

          <div className="mt-5 flex items-center gap-3 text-[11px] text-[#111827]">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => precheckActions.setShareConsent(e.target.checked)}
              className="h-4 w-4"
            />
            <span>I agree to share my data for mortgage consultation with partner banks</span>
          </div>

          <div className="mt-5 rounded-2xl bg-[#F3F4F6] p-4">
            <div className="text-[12px] font-semibold text-[#111827]">What banks will receive:</div>
            <ul className="mt-3 space-y-2 text-[11px] text-[#6B7280] list-disc pl-5">
              <li>Your financial summary (income, equity, expenses)</li>
              <li>Uploaded documents (if any)</li>
              <li>Property listing & factsheet</li>
              <li>Affordability calculation results</li>
            </ul>
          </div>

          <button
            type="button"
            disabled={!consent || loading}
            onClick={onSend}
            className="mt-6 h-12 w-full rounded-xl bg-[#D66355] text-[13px] font-semibold text-white hover:bg-[#C85A4E] disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send to Banks"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/precheck")}
            className="mt-3 h-12 w-full rounded-xl border border-[#D66355] bg-white text-[13px] font-semibold text-[#D66355] hover:bg-[#D66355]/10"
          >
            Skip for now
          </button>
        </div>
      </PageShell>
    </div>
  );
}