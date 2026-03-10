// src/widgets/property/AgentSidebar.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MessageSquareText, CalendarDays } from "lucide-react";
import Button from "../../shared/ui/Button";
import { cn } from "../../shared/lib/cn";

export default function AgentSidebar({
  agent,
  reviews = [],
  propertyId,
  bookingPurpose = "rent", //  "rent" | "sale"
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const visible = useMemo(() => {
    if (expanded) return reviews;
    return reviews.slice(0, 1);
  }, [expanded, reviews]);

  const goChat = () => {
    navigate(`/inbox?propertyId=${encodeURIComponent(propertyId || "")}`);
  };

  const goBooking = () => {
    const pid = encodeURIComponent(propertyId || "");
    const p = encodeURIComponent(bookingPurpose || "rent");
    navigate(`/booking?propertyId=${pid}&purpose=${p}`);
  };

  return (
    <aside className="rounded-2xl border border-[#EDEDED] bg-white p-5 min-w-0">
      <div className="flex items-start gap-3 min-w-0">
        <img
          src={agent.avatar}
          alt={agent.name}
          className="h-12 w-12 rounded-full object-cover shrink-0"
        />
        <div className="min-w-0">
          <div className="font-semibold text-[#111827] truncate">{agent.name}</div>
          <div className="text-sm text-[#6B7280] truncate">{agent.role}</div>

          <div className="mt-1 flex items-center gap-2">
            <Star className="h-4 w-4 fill-[#F5B301] text-[#F5B301]" />
            <span className="text-sm text-[#111827]">{agent.rating}</span>
            <span className="text-sm text-[#6B7280]">
              ({agent.reviewsCount} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 text-sm text-[#6B7280]">
        Managing {agent.managing} properties in Downtown
      </div>

      <div className="my-4 h-px bg-[#EDEDED]" />

      {/* Reviews */}
      <div className="space-y-4">
        {visible.map((r) => (
          <div key={r.id} className="flex gap-3">
            <img
              src={r.avatar}
              alt={r.name}
              className="h-10 w-10 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[#111827]">{r.name}</div>

              <div className="mt-1 flex items-center gap-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < r.stars
                          ? "fill-[#F5B301] text-[#F5B301]"
                          : "text-[#E5E7EB]"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#6B7280]">
                  {r.stars}/5 • {r.time}
                </span>
              </div>

              <div className="mt-2 text-[15px] font-semibold text-[#111827]">
                {r.title}
              </div>
              <div className="mt-1 text-sm text-[#6B7280]">{r.text}</div>
            </div>
          </div>
        ))}

        {reviews.length > 1 ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="w-full text-center text-sm font-semibold text-[#D66355] underline-offset-4 hover:underline"
          >
            {expanded ? "See less" : "See more"}
          </button>
        ) : null}
      </div>

      <div className="mt-5 h-px bg-[#EDEDED]" />

      <div className="mt-5 space-y-3">
        <Button
          className="h-12 w-full bg-[#D66355] text-white hover:bg-[#C85A4E]"
          onClick={goChat}
        >
          <span className="inline-flex items-center gap-2">
            <MessageSquareText className="h-5 w-5" />
            Chat with Owner
          </span>
        </Button>

        <Button
          variant="outline"
          className="h-12 w-full border-[#D66355] text-[#D66355] hover:bg-[#D66355]/10"
          onClick={goBooking}
        >
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Book Viewing
          </span>
        </Button>

        <div className="pt-1 text-center text-xs text-[#6B7280]">
          Response rate: 95% • Avg. response: 2 hours
        </div>
      </div>
    </aside>
  );
}