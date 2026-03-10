
// PATH: src/features/messaging/ui/ConversationList.jsx
import { cn } from "../../../shared/lib/cn";

export default function ConversationList({ items = [], activeId, onSelect }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-[#EDEDED] bg-white">
      {items.map((c) => {
        const active = String(c.id) === String(activeId);

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect?.(c.id)}
            className={cn(
              "w-full text-left",
              "border-b border-[#F3F4F6] last:border-b-0",
              active ? "bg-[#F7E5E2]" : "bg-white hover:bg-black/2"
            )}
          >
            <div className="px-5 py-4">
              <div className="text-[12px] font-semibold text-[#D66355]">
                {c.propertyTitle}
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <img
                    src={c.participant?.avatar}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                    draggable={false}
                  />
                  <div className="truncate text-[13px] text-[#111827]">
                    {c.participant?.name}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {c.unread ? (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#D66355] px-1 text-[11px] font-semibold text-white">
                      {c.unread}
                    </span>
                  ) : null}
                  <div className="text-[11px] text-[#9CA3AF]">{c.timeLabel}</div>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}