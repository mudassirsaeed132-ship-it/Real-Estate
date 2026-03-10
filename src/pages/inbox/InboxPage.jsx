// PATH: src/pages/inbox/InboxPage.jsx
import { useEffect, useMemo, useState } from "react";
import PageShell from "../../app/layout/PageShell";
import { apiGet, apiPost } from "../../services/api/client";
import { ENDPOINTS } from "../../services/api/endpoints";

import ConversationList from "../../features/messaging/ui/ConversationList";
import ChatLayout from "../../features/messaging/ui/ChatLayout";
import agentSarah from "../../assets/images/avatars/agent-sarah.jpg";


function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-full py-3 text-[12px] font-semibold"
    >
      <span className={active ? "text-[#111827]" : "text-[#9CA3AF]"}>{children}</span>
      {active ? (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#111827]" />
      ) : null}
    </button>
  );
}

export default function InboxPage() {
  const [tab, setTab] = useState("buying"); // buying | renting
  const [list, setList] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [chat, setChat] = useState(null);

  // load list
  useEffect(() => {
    let alive = true;

    apiGet(`${ENDPOINTS.chats}?tab=${tab}`)
      .then((d) => {
        if (!alive) return;
        const items = d?.items || d?.data?.items || [];
        setList(items);
        // auto select first on desktop-like experience
        if (!activeId && items[0]?.id) setActiveId(items[0].id);
      })
      .catch(() => {
        if (!alive) return;
        setList([]);
      });

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // load chat detail
  useEffect(() => {
    let alive = true;
    if (!activeId) {
      setChat(null);
      return;
    }

    apiGet(`${ENDPOINTS.chats}/${activeId}`)
      .then((d) => {
        if (!alive) return;
        setChat(d?.item || d?.data?.item || null);
      })
      .catch(() => {
        if (!alive) return;
        setChat(null);
      });

    return () => {
      alive = false;
    };
  }, [activeId]);

  const title = "Inbox";

  const onSend = async (text) => {
    if (!activeId) return;

    // optimistic UI
    setChat((prev) => {
      if (!prev) return prev;
      const newMsg = {
        id: `tmp_${Math.random().toString(16).slice(2)}`,
        from: "me",
        text,
        avatar: agentSarah,
        at: new Date().toISOString(),
      };
      return { ...prev, messages: [...(prev.messages || []), newMsg] };
    });

    // API (MSW)
    try {
      await apiPost(`${ENDPOINTS.chats}/${activeId}/messages`, { text });
    } catch {
      // ignore for now
    }
  };

  const selectedChat = chat;

  return (
    <div className="bg-[#FAFAFA]">
      <PageShell className="py-8 min-w-0">
        <div className="text-[26px] font-semibold text-[#D66355]">{title}</div>

        <div className="mt-5">
          <div className="grid gap-0 overflow-hidden rounded-2xl border border-[#EDEDED] bg-white lg:grid-cols-[360px_minmax(0,1fr)]">
            {/* Left panel */}
            <div className="min-w-0 border-b border-[#F3F4F6] lg:border-b-0 lg:border-r lg:border-[#F3F4F6]">
              {/* Tabs */}
              <div className="grid grid-cols-2 border-b border-[#F3F4F6]">
                <TabButton active={tab === "buying"} onClick={() => setTab("buying")}>
                  Buying
                </TabButton>
                <TabButton active={tab === "renting"} onClick={() => setTab("renting")}>
                  Renting
                </TabButton>
              </div>

              <ConversationList
                items={list}
                activeId={activeId}
                onSelect={(id) => setActiveId(id)}
              />
            </div>

            {/* Right panel */}
            <div className="min-w-0 bg-white p-4 sm:p-5">
              {selectedChat ? (
                <ChatLayout
                  chat={selectedChat}
                  meAvatar={agentSarah}
                  onClose={() => setActiveId("")}
                  onSend={onSend}
                />
              ) : (
                <div className="grid min-h-130 place-items-center rounded-2xl border border-dashed border-[#EDEDED] bg-white p-6 text-sm text-[#9CA3AF]">
                  Select a conversation
                </div>
              )}
            </div>
          </div>
        </div>
      </PageShell>
    </div>
  );
}
