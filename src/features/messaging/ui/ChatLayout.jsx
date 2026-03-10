// PATH: src/features/messaging/ui/ChatLayout.jsx
import { X } from "lucide-react";
import { cn } from "../../../shared/lib/cn";
import MessageList from "./MessageList";
import MessageComposer from "./MessageComposer";

export default function ChatLayout({
  chat,
  meAvatar,
  onClose,
  onSend,
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-[#EDEDED] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#F3F4F6] px-5 py-4">
        <div className="flex items-center gap-2">
          <img
            src={chat?.participant?.avatar}
            alt=""
            className="h-7 w-7 rounded-full object-cover"
            draggable={false}
          />
          <div className="text-[13px] font-semibold text-[#111827]">
            {chat?.participant?.name || "Conversation"}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-[#111827]" />
        </button>
      </div>

      {/* Property title */}
      <div className="px-5 pt-4 text-center text-[12px] font-semibold text-[#D66355]">
        {chat?.propertyTitle}
      </div>

      {/* Thread + Composer */}
      <div className={cn("flex min-h-105 flex-col")}>
        <MessageList messages={chat?.messages || []} meAvatar={meAvatar} />
        <MessageComposer onSend={onSend} />
      </div>
    </div>
  );
}
