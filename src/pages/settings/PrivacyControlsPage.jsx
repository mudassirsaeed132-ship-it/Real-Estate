// src/pages/settings/PrivacyControlsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Trash2 } from "lucide-react";

import PageShell from "../../app/layout/PageShell";
import PageHeaderBar from "../../shared/ui/PageHeaderBar";
import Skeleton from "../../shared/ui/Skeleton";
import { apiGet, apiPost } from "../../services/api/client";
import { ENDPOINTS } from "../../services/api/endpoints";

function Switch({ checked, onChange, ariaLabel }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-5 w-10 items-center rounded-full border transition",
        checked ? "bg-[#D66355] border-[#D66355]" : "bg-white border-[#D1D5DB]",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-4 w-4 rounded-full transition",
          checked ? "translate-x-5 bg-white" : "translate-x-1 bg-[#111827]",
        ].join(" ")}
      />
    </button>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mt-6">
      <div className="text-[14px] font-semibold text-[#111827]">{title}</div>
      {subtitle ? (
        <div className="mt-1 text-[12px] text-[#6B7280]">{subtitle}</div>
      ) : null}
    </div>
  );
}

function ToggleRow({ title, desc, checked, onChange }) {
  return (
    <div className="rounded-xl border border-[#EDEDED] bg-white px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-[#111827]">{title}</div>
          {desc ? <div className="mt-1 text-[11px] text-[#6B7280]">{desc}</div> : null}
        </div>
        <div className="shrink-0 pt-1">
          <Switch checked={checked} onChange={onChange} ariaLabel={title} />
        </div>
      </div>
    </div>
  );
}

export default function PrivacyControlsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    apiGet(ENDPOINTS.privacy)
      .then((d) => alive && setData(d?.item || null))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, []);

  const patch = async (next) => {
    setData(next);
    // save (mock via MSW)
    await apiPost(ENDPOINTS.privacy, { settings: next }).catch(() => {});
  };

  if (loading) {
    return (
      <div className="bg-[#FAFAFA]">
        <PageShell className="py-8">
          <PageHeaderBar title="Privacy Controls" onBack={() => navigate(-1)} />
          <div className="mt-5 rounded-2xl border border-[#EDEDED] bg-white p-5 sm:p-8">
            <Skeleton className="h-4 w-[520px] max-w-full" />
            <Skeleton className="mt-4 h-4 w-[360px] max-w-full" />
            <Skeleton className="mt-6 h-[72px] w-full rounded-xl" />
            <Skeleton className="mt-4 h-[72px] w-full rounded-xl" />
            <Skeleton className="mt-4 h-[72px] w-full rounded-xl" />
            <Skeleton className="mt-8 h-[160px] w-full rounded-2xl" />
          </div>
        </PageShell>
      </div>
    );
  }

  const ds = data?.dataSharing || {};
  const ch = data?.channels || {};
  const nt = data?.notificationTypes || {};

  return (
    <div className="bg-[#FAFAFA]">
      <PageShell className="py-8">
        <PageHeaderBar title="Privacy Controls" onBack={() => navigate(-1)} />

        <div className="mt-5 rounded-2xl border border-[#EDEDED] bg-white p-5 sm:p-8">
          <div className="text-[12px] text-[#6B7280]">
            Manage your privacy settings, data sharing preference, and control who can see your information.
          </div>

          <SectionTitle
            title="Data Sharing Consent"
            subtitle="Manage your consent for sharing data with third parties (opt-in)"
          />

          <div className="mt-3 space-y-3">
            <ToggleRow
              title="Share Data with Banks"
              desc="Allow verified banks to access your financial documents"
              checked={!!ds.banks}
              onChange={(v) => patch({ ...data, dataSharing: { ...ds, banks: v } })}
            />
            <ToggleRow
              title="Share data with Notaries"
              desc="Allow notaries to access your legal documents"
              checked={!!ds.notaries}
              onChange={(v) => patch({ ...data, dataSharing: { ...ds, notaries: v } })}
            />
            <ToggleRow
              title="Share data with Verified Partners"
              desc="Allow verified partners to access your profile information"
              checked={!!ds.partners}
              onChange={(v) => patch({ ...data, dataSharing: { ...ds, partners: v } })}
            />
          </div>

          <SectionTitle
            title="Notification Preferences"
            subtitle="Choose how you want to receive notifications and updates"
          />

          <div className="mt-3">
            <div className="text-[12px] font-semibold text-[#111827]">Communication Channels</div>

            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[12px] text-[#111827]">Email Notifications</div>
                <Switch
                  checked={!!ch.email}
                  onChange={(v) => patch({ ...data, channels: { ...ch, email: v } })}
                  ariaLabel="Email Notifications"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[12px] text-[#111827]">SMS Notifications</div>
                <Switch
                  checked={!!ch.sms}
                  onChange={(v) => patch({ ...data, channels: { ...ch, sms: v } })}
                  ariaLabel="SMS Notifications"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[12px] text-[#111827]">Push Notifications</div>
                <Switch
                  checked={!!ch.push}
                  onChange={(v) => patch({ ...data, channels: { ...ch, push: v } })}
                  ariaLabel="Push Notifications"
                />
              </div>
            </div>

            <div className="mt-4 h-px bg-[#EDEDED]" />

            <div className="mt-4 text-[12px] font-semibold text-[#111827]">Notification Types</div>

            <div className="mt-3 space-y-2 text-[12px] text-[#111827]">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#D66355]"
                  checked={!!nt.security}
                  onChange={(e) => patch({ ...data, notificationTypes: { ...nt, security: e.target.checked } })}
                />
                <span>Security Alerts (Recommended)</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#D66355]"
                  checked={!!nt.documents}
                  onChange={(e) => patch({ ...data, notificationTypes: { ...nt, documents: e.target.checked } })}
                />
                <span>Document Updates</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#D66355]"
                  checked={!!nt.marketing}
                  onChange={(e) => patch({ ...data, notificationTypes: { ...nt, marketing: e.target.checked } })}
                />
                <span>Marketing &amp; Promotional</span>
              </label>
            </div>
          </div>

          <div className="mt-8 text-[#D66355] text-[14px] font-semibold">Data Rights (GDPR)</div>
          <div className="mt-1 text-[12px] text-[#6B7280]">
            Download a copy of your data or permanently delete your account
          </div>

          {/* Download */}
          <div className="mt-4 rounded-2xl border border-[#EDEDED] bg-white p-5">
            <div className="text-[13px] font-semibold text-[#111827]">Download Your Data</div>
            <div className="mt-1 text-[11px] text-[#6B7280]">
              Request a copy of all your personal data in a portable format. You'll receive an email with a download link within 48 hours.
            </div>

            <button
              type="button"
              onClick={() => apiPost(ENDPOINTS.privacyExport, {}).then(() => alert("Requested (mock)")).catch(() => {})}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#EDEDED] bg-white text-[13px] font-semibold text-[#111827] hover:bg-black/[0.02]"
            >
              <Download className="h-4 w-4" />
              Request Data Export
            </button>
          </div>

          {/* Delete */}
          <div className="mt-4 rounded-2xl border border-[#D66355] bg-white p-5">
            <div className="text-[13px] font-semibold text-[#D66355]">Delete your Account</div>
            <div className="mt-1 text-[11px] text-[#6B7280]">
              Deleting your Account will permanently delete all your data.
            </div>

            <button
              type="button"
              onClick={() => apiPost(ENDPOINTS.privacyDelete, {}).then(() => alert("Delete requested (mock)")).catch(() => {})}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#D66355] text-[13px] font-semibold text-white hover:bg-[#C85A4E]"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </div>
        </div>
      </PageShell>
    </div>
  );
}
