
// PATH: src/entities/chat/ui/MessageBubble.jsx
import { cn } from "../../../shared/lib/cn";

export default function MessageBubble({ side = "left", text, avatar, attachment }) {
  const isRight = side === "right";

  return (
    <div className={cn("flex gap-2", isRight ? "justify-end" : "justify-start")}>
      {!isRight ? (
        <img
          src={avatar}
          alt=""
          className="h-6 w-6 shrink-0 rounded-full object-cover"
          draggable={false}
        />
      ) : null}

      <div className={cn("max-w-[320px] sm:max-w-[360px]", isRight ? "text-right" : "text-left")}>
        {text ? (
          <div
            className={cn(
              "rounded-2xl px-4 py-2 text-[12px] sm:text-[13px]",
              isRight
                ? "bg-[#F7E5E2] text-[#D66355]"
                : "bg-[#F3F4F6] text-[#6B7280]"
            )}
          >
            {text}
          </div>
        ) : null}

        {attachment?.type === "image" ? (
          <div className={cn("mt-2 overflow-hidden rounded-2xl border border-[#EDEDED] bg-white")}>
            <img
              src={attachment.src}
              alt=""
              className="h-[210px] w-[210px] object-cover sm:h-[240px] sm:w-[240px]"
              draggable={false}
            />
          </div>
        ) : null}
      </div>

      {isRight ? (
        <img
          src={avatar}
          alt=""
          className="h-6 w-6 shrink-0 rounded-full object-cover"
          draggable={false}
        />
      ) : null}
    </div>
  );
}