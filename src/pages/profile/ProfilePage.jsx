// PATH: src/pages/profile/ProfilePage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../app/layout/PageShell";
import Button from "../../shared/ui/Button";
import Skeleton from "../../shared/ui/Skeleton";
import { apiGet, apiPost } from "../../services/api/client";
import { ENDPOINTS } from "../../services/api/endpoints";

function InlineRadio({ name, value, checked, label, onChange }) {
  return (
    <label className="inline-flex items-center gap-2 text-[13px] text-[#111827]">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span
        className={[
          "h-3.5 w-3.5 rounded-full border",
          checked ? "border-[#D66355]" : "border-[#D1D5DB]",
          "grid place-items-center",
        ].join(" ")}
      >
        {checked ? <span className="h-2 w-2 rounded-full bg-[#D66355]" /> : null}
      </span>
      {label}
    </label>
  );
}

function RowLink({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 py-2 text-left"
    >
      <span className="text-[14px] text-[#D66355]">{label}</span>
      <span className="text-[#9CA3AF]">{">"}</span>
    </button>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const [lang, setLang] = useState("english");
  const [currency, setCurrency] = useState("dollar");

  useEffect(() => {
    let alive = true;
    setLoading(true);

    apiGet(ENDPOINTS.profile)
      .then((d) => {
        if (!alive) return;
        const item = d?.item || d?.data?.item || null;
        setProfile(item);
        setLang(item?.settings?.language || "english");
        setCurrency(item?.settings?.currency || "dollar");
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, []);

  const user = profile?.user;
  const languages = profile?.languageOptions || [];
  const currencies = profile?.currencyOptions || [];

  const applyLanguage = async () => {
    await apiPost(ENDPOINTS.profileSettings, { settings: { language: lang } }).catch(() => {});
    alert("Language applied (mock)");
  };

  const applyCurrency = async () => {
    await apiPost(ENDPOINTS.profileSettings, { settings: { currency } }).catch(() => {});
    alert("Currency applied (mock)");
  };

  return (
    <div className="bg-[#FAFAFA]">
      <PageShell className="py-8 min-w-0">
        <div className="text-[26px] font-semibold text-[#D66355]">Profile</div>

        <div className="mt-5 rounded-2xl border border-[#EDEDED] bg-white p-5 sm:p-8">
          {loading ? (
            <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
              <div className="space-y-4">
                <Skeleton className="h-[140px] w-[140px] rounded-full" />
                <Skeleton className="h-10 w-[160px] rounded-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-8 w-[260px]" />
                <Skeleton className="h-4 w-[220px]" />
                <Skeleton className="h-4 w-[320px]" />
              </div>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
              {/* Left */}
              <div className="flex flex-col items-start gap-4">
                <img
                  src={user?.avatar}
                  alt=""
                  className="h-[140px] w-[140px] rounded-full object-cover"
                  draggable={false}
                />
                <Button className="h-10 px-6 bg-[#D66355] text-white hover:bg-[#C85A4E]">
                  Edit Profile
                </Button>
              </div>

              {/* Right */}
              <div className="min-w-0">
                <div className="text-[28px] font-semibold text-[#111827]">
                  {user?.name}
                </div>
                <div className="mt-3 h-px w-full bg-[#EDEDED]" />

                {/* My Activity */}
                <div className="mt-4 text-[18px] font-semibold text-[#111827]">
                  My Activity
                </div>
                <div className="mt-2">
                  <RowLink
                    label="Favourites/ Saved Searches"
                    onClick={() => navigate("/profile/saved-searches")}
                  />
                  <RowLink
                    label="Viewed properties (History)"
                    onClick={() => navigate("/profile/viewed")}
                  />
                  <RowLink
                    label="My Bookings & Applications"
                    onClick={() => navigate("/profile/bookings")}
                  />
                </div>

                {/* Settings */}
                <div className="mt-6 text-[18px] font-semibold text-[#111827]">
                  Settings
                </div>

                {/* Language */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-[14px] font-semibold text-[#D66355]">
                    Language
                  </div>
                  <button
                    type="button"
                    onClick={applyLanguage}
                    className="text-[13px] font-semibold text-[#D66355] hover:underline"
                  >
                    Apply
                  </button>
                </div>

                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {languages.map((o) => (
                    <InlineRadio
                      key={o.value}
                      name="lang"
                      value={o.value}
                      label={o.label}
                      checked={lang === o.value}
                      onChange={setLang}
                    />
                  ))}
                </div>

                {/* Currency */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-[14px] font-semibold text-[#D66355]">
                    Currency
                  </div>
                  <button
                    type="button"
                    onClick={applyCurrency}
                    className="text-[13px] font-semibold text-[#D66355] hover:underline"
                  >
                    Apply
                  </button>
                </div>

                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {currencies.map((o) => (
                    <InlineRadio
                      key={o.value}
                      name="currency"
                      value={o.value}
                      label={o.label}
                      checked={currency === o.value}
                      onChange={setCurrency}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </PageShell>
    </div>
  );
}
