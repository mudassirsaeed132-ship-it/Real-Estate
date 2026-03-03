// PATH: src/mocks/msw/handlers/chat.handlers.js
import { http, HttpResponse } from "msw";
import { ENDPOINTS } from "../../../services/api/endpoints";
import { CHATS_FIXTURE } from "../../db/fixtures/chats";

const toStr = (v) => (v == null ? "" : String(v));

function formatTime(iso) {
  const d = new Date(iso);
  const mins = Math.max(1, Math.round((Date.now() - d.getTime()) / 60000));
  return `${mins} min ago`;
}

export const chatHandlers = [
  // LIST: /api/chats?tab=buying|renting
  http.get(ENDPOINTS.chats, ({ request }) => {
    const url = new URL(request.url);
    const tab = toStr(url.searchParams.get("tab")) || "buying";

    const items = CHATS_FIXTURE.filter((c) => c.tab === tab).map((c) => ({
      id: c.id,
      tab: c.tab,
      propertyTitle: c.propertyTitle,
      participant: c.participant,
      lastMessage: c.lastMessage,
      timeLabel: formatTime(c.lastAt),
      unread: c.unread,
    }));

    return HttpResponse.json({ items });
  }),

  // DETAIL: /api/chats/:id
  http.get(`${ENDPOINTS.chats}/:id`, ({ params }) => {
    const item = CHATS_FIXTURE.find((c) => c.id === params.id);
    if (!item) return HttpResponse.json({ message: "Chat not found" }, { status: 404 });

    return HttpResponse.json({
      item: {
        id: item.id,
        tab: item.tab,
        propertyTitle: item.propertyTitle,
        participant: item.participant,
        messages: item.messages,
      },
    });
  }),

  // SEND: POST /api/chats/:id/messages
  http.post(`${ENDPOINTS.chats}/:id/messages`, async ({ params, request }) => {
    const chat = CHATS_FIXTURE.find((c) => c.id === params.id);
    if (!chat) return HttpResponse.json({ message: "Chat not found" }, { status: 404 });

    const body = await request.json().catch(() => ({}));
    const text = toStr(body.text).trim();

    const newMsg = {
      id: `m_${Math.random().toString(16).slice(2)}`,
      from: "me",
      text,
      at: new Date().toISOString(),
      avatar: chat.messages?.[0]?.avatar || chat.participant?.avatar,
    };

    chat.messages = [...(chat.messages || []), newMsg];
    chat.lastAt = new Date().toISOString();
    chat.lastMessage = text || "Sent";

    return HttpResponse.json({ item: newMsg });
  }),
];