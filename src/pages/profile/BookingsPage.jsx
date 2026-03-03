// src/pages/profile/BookingsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

import PageShell from "../../app/layout/PageShell";
import PageHeaderBar from "../../shared/ui/PageHeaderBar";
import Skeleton from "../../shared/ui/Skeleton";
import { apiGet } from "../../services/api/client";
import { ENDPOINTS } from "../../services/api/endpoints";

function StatusPill({ value }) {
  const v = String(value || "").toLowerCase();

  const cls =
    v === "approved"
      ? "bg-[#22C55E]/10 text-[#16A34A]"
      : v === "rejected" || v === "cancelled"
        ? "bg-[#EF4444]/10 text-[#EF4444]"
        : "bg-[#F59E0B]/10 text-[#D97706]";

  const label =
    v === "approved" ? "Approved" : v === "rejected" ? "Rejected" : "Pending";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function Tag({ label, tone }) {
  const cls =
    tone === "green"
      ? "bg-[#22C55E]/10 text-[#16A34A]"
      : "bg-[#FDE2E0] text-[#D66355]";
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function BookingRow({ item }) {
  return (
    <div className="rounded-2xl border border-[#EDEDED] bg-white px-4 py-4 overflow-hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={item.thumb}
            alt=""
            className="h-12 w-12 rounded-xl object-cover shrink-0"
            draggable={false}
          />
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold text-[#D66355]">
              {item.title}
            </div>
            <div className="mt-1 text-[12px] text-[#111827] truncate">
              {item.person}
            </div>
            <div className="mt-1 text-[11px] text-[#6B7280] truncate">
              {item.location}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-2">
          <div className="text-[13px] font-semibold text-[#111827]">
            {item.price}
          </div>
          <StatusPill value={item.status} />
        </div>
      </div>
    </div>
  );
}

function KeyValueMobile({ rows = [] }) {
  // ✅ mobile: stack label/value so nothing cuts
  return (
    <div className="mt-4 space-y-3 text-[11px]">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between gap-3">
          <div className="text-[#9CA3AF]">{r.label}</div>
          <div className="text-[#111827] font-medium">{r.value}</div>
        </div>
      ))}
    </div>
  );
}

function KeyValueDesktop({ rows = [] }) {
  // ✅ desktop: 2-column like figma
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 text-[11px]">
      <div className="space-y-2 text-[#9CA3AF]">
        {rows.map((r) => (
          <div key={r.label}>{r.label}</div>
        ))}
      </div>
      <div className="space-y-2 text-right text-[#111827]">
        {rows.map((r) => (
          <div key={r.label}>{r.value}</div>
        ))}
      </div>
    </div>
  );
}

function BookingCard({ item }) {
  const isReview = item.action === "review";

  const rows = !isReview
    ? [
        { label: "Duration:", value: item.duration },
        { label: "Start:", value: item.start },
        { label: "End:", value: item.end },
      ]
    : [
        { label: "Completed", value: item.completed },
        { label: "Owner/ Agent", value: item.owner },
      ];

  return (
    <div className="rounded-2xl border border-[#EDEDED] bg-white p-4 overflow-hidden min-w-0">
      {/* Image */}
      <div className="overflow-hidden rounded-2xl bg-[#F3F4F6]">
        <div className="aspect-[16/7] w-full">
          <img
            src={item.image}
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
      </div>

      {/* Title + tags */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-[#111827] truncate">
            {item.title}
          </div>
          <div className="mt-1 text-[11px] text-[#6B7280] truncate">
            {item.location}
          </div>
        </div>

        {/* ✅ FIX: tags wrap on mobile (no cutting) */}
        <div className="flex flex-wrap items-center gap-2">
          <Tag label={item.tagLeft || "Rented"} tone="red" />
          <Tag label={item.tagRight || "Paid"} tone="green" />
        </div>
      </div>

      {/* ✅ FIX: mobile stack rows, desktop keep original */}
      <div className="block sm:hidden">
        <KeyValueMobile rows={rows} />
      </div>
      <div className="hidden sm:block">
        <KeyValueDesktop rows={rows} />
      </div>

      <div className="mt-4 text-[11px] text-[#6B7280]">
        Share your experience to help others make informed decisions
      </div>

      {/* CTA */}
      {!isReview ? (
        <button
          type="button"
          onClick={() => alert("View details (dummy)")}
          className="mt-4 h-11 w-full rounded-xl bg-[#D66355] text-[13px] font-semibold text-white hover:bg-[#C85A4E]"
        >
          View Details
        </button>
      ) : (
        <button
          type="button"
          onClick={() => alert("Write review (dummy)")}
          className="mt-4 h-11 w-full rounded-xl border border-[#D66355] bg-white text-[13px] font-semibold text-[#D66355] hover:bg-[#D66355]/10"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <Pencil className="h-4 w-4" />
            Write a Review
          </span>
        </button>
      )}
    </div>
  );
}

export default function BookingsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("completed"); // completed | ongoing
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    apiGet(`${ENDPOINTS.profileBookings}?status=${status}`)
      .then((d) => alive && setItems(d?.items || []))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [status]);

  const right = useMemo(() => {
    return (
      <div className="rounded-xl border border-[#EDEDED] bg-white px-3 py-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-transparent text-[13px] font-semibold text-[#D66355] outline-none"
        >
          <option value="completed">Completed</option>
          <option value="ongoing">Ongoing</option>
        </select>
      </div>
    );
  }, [status]);

  return (
    <div className="bg-[#FAFAFA]">
      <PageShell className="py-8">
        <PageHeaderBar
          title="My Bookings & Applications"
          onBack={() => navigate("/profile")}
          right={right}
        />

        <div className="mt-5 rounded-2xl border border-[#EDEDED] bg-white p-5 sm:p-8 min-w-0">
          {loading ? (
            status === "completed" ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-[84px] w-full rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-[320px] w-full rounded-2xl" />
                ))}
              </div>
            )
          ) : status === "completed" ? (
            <div className="space-y-4">
              {items.map((it) => (
                <BookingRow key={it.id} item={it} />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {items.map((it) => (
                <BookingCard key={it.id} item={it} />
              ))}
            </div>
          )}
        </div>
      </PageShell>
    </div>
  );
}