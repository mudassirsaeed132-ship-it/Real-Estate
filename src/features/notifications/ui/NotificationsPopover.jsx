import { useState } from "react";
import Skeleton from "../../../shared/ui/Skeleton";
import { useNotifications } from "../model/useNotifications";

const TABS = [
  { key: "all", label: "All" },
  { key: "sale", label: "Sale" },
  { key: "rent", label: "Rent" },
  { key: "short-stays", label: "Short-Stays" },
];

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative px-4 py-2 text-[12px] font-semibold",
        active ? "text-[#111827]" : "text-[#9CA3AF]",
      ].join(" ")}
    >
      {children}
      {active ? <span className="absolute left-4 right-4 -bottom-[1px] h-[2px] bg-[#111827]" /> : null}
    </button>
  );
}

function NotificationRow({ item }) {
  return (
    <div className="rounded-2xl bg-[#FDE2E0]/50 px-4 py-3">
      <div className="flex gap-3">
        <img
          src={item.avatar}
          alt=""
          className="h-9 w-9 rounded-full object-cover"
          draggable={false}
        />
        <div className="min-w-0">
          <div className="text-[12px] font-semibold text-[#D66355]">{item.name}</div>

          <div className="mt-1 text-[11px] leading-5 text-[#6B7280]">
            {item.text}{" "}
            {item.accent ? (
              <span className="font-semibold text-[#D66355]">{item.accent}</span>
            ) : null}
          </div>

          <div className="mt-1 text-[10px] text-[#9CA3AF]">{item.time}</div>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPopover({ open, onClose }) {
  const [tab, setTab] = useState("all");
  const { today, older, loading } = useNotifications(tab, { enabled: open });

  const hasToday = today?.length > 0;
  const hasOlder = older?.length > 0;

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      className={[
        // ✅ Anchor to bell button container (UserMenu wrapper)
        "absolute right-0 top-full mt-3",
        "z-[80]",
        "w-[520px] max-w-[92vw]",
        "overflow-hidden rounded-2xl border border-[#EDEDED] bg-white shadow-xl",
        // ✅ Mobile: behave like sheet under header
        "max-sm:fixed max-sm:left-3 max-sm:right-3 max-sm:top-16 max-sm:mt-0",
      ].join(" ")}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="text-[18px] font-semibold text-[#D66355]">Notifications</div>

        {/* Tabs */}
        <div className="mt-4 flex items-center gap-4 border-b border-[#EDEDED]">
          {TABS.map((t) => (
            <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
              {t.label}
            </TabButton>
          ))}
        </div>
      </div>

      {/* Body scroll */}
      <div className="max-h-[60vh] overflow-auto px-5 pb-5">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        ) : (
          <div className="space-y-5">
            {hasToday ? (
              <div>
                <div className="text-[12px] font-semibold text-[#6B7280]">Today</div>
                <div className="mt-3 space-y-3">
                  {today.map((n) => (
                    <NotificationRow key={n.id} item={n} />
                  ))}
                </div>
              </div>
            ) : null}

            {hasOlder ? (
              <div>
                <div className="text-[12px] font-semibold text-[#6B7280]">
                  Older Notifications
                </div>
                <div className="mt-3 space-y-3">
                  {older.map((n) => (
                    <NotificationRow key={n.id} item={n} />
                  ))}
                </div>
              </div>
            ) : null}

            {!hasToday && !hasOlder ? (
              <div className="rounded-2xl border border-[#EDEDED] bg-white p-4 text-sm text-[#6B7280]">
                No notifications.
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Click outside close handled in UserMenu */}
      <button type="button" onClick={onClose} className="sr-only" aria-label="Close" />
    </div>
  );
}