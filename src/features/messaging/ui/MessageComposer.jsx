// PATH: src/features/messaging/ui/MessageComposer.jsx
import { Paperclip, Send } from "lucide-react";
import { useState } from "react";

export default function MessageComposer({ onSend }) {
  const [value, setValue] = useState("");

  const send = () => {
    const text = value.trim();
    if (!text) return;
    onSend?.(text);
    setValue("");
  };

  return (
    <div className="shrink-0 px-5 pb-5">
      <div className="flex items-center gap-3 rounded-xl bg-[#F7E5E2] px-4 py-3">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="Write your message"
          className="w-full bg-transparent text-[13px] text-[#111827] outline-none placeholder:text-[#9CA3AF]"
        />

        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5"
          aria-label="Attach"
          onClick={() => alert("Attach (dummy)")}
        >
          <Paperclip className="h-4 w-4 text-[#D66355]" />
        </button>

        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5"
          aria-label="Send"
          onClick={send}
        >
          <Send className="h-4 w-4 text-[#D66355]" />
        </button>
      </div>
    </div>
  );
}
