// PATH: src/features/messaging/ui/MessageList.jsx
import MessageBubble from "../../../entities/chat/ui/MessageBubble";

export default function MessageList({ messages = [], meAvatar }) {
  return (
    <div className="flex-1 overflow-auto px-5 py-5">
      <div className="space-y-4">
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            side={m.from === "me" ? "right" : "left"}
            text={m.text}
            avatar={m.from === "me" ? meAvatar : m.avatar}
            attachment={m.attachment}
          />
        ))}
      </div>
    </div>
  );
}
