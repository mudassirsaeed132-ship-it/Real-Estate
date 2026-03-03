// PATH: src/mocks/db/fixtures/chats.js
import userLeslie from "../../../assets/images/avatars/user-leslie.jpg";
import agentSarah from "../../../assets/images/avatars/agent-sarah.jpg";
import agentTom from "../../../assets/images/avatars/agent-tom.jpg";

import p1 from "../../../assets/images/properties/p1.png";
import p2 from "../../../assets/images/properties/p2.png";
import p3 from "../../../assets/images/properties/p3.png";

function minutesAgo(n) {
  const d = new Date(Date.now() - n * 60 * 1000);
  return d.toISOString();
}

export const CHATS_FIXTURE = [
  {
    id: "chat_001",
    tab: "buying",
    propertyTitle: "5 Acres Agricultural land",
    participant: { name: "Haris Khan", avatar: userLeslie },
    lastMessage: "Lorem ipsum dolor sit amet, ...",
    lastAt: minutesAgo(2),
    unread: 2,
    messages: [
      {
        id: "m_001",
        from: "me",
        text: "Lorem ipsum dolor sit amet, savd",
        at: minutesAgo(2),
        avatar: agentSarah,
      },
      {
        id: "m_002",
        from: "other",
        text: "Lorem ipsum dolor sit amet, conse",
        at: minutesAgo(3),
        avatar: userLeslie,
      },
      {
        id: "m_003",
        from: "other",
        text: "",
        at: minutesAgo(3),
        avatar: userLeslie,
        attachment: { type: "image", src: p3 },
      },
    ],
  },
  {
    id: "chat_002",
    tab: "buying",
    propertyTitle: "5 kanal farm house for rent",
    participant: { name: "MK Builders", avatar: agentTom },
    lastMessage: "12 min ago",
    lastAt: minutesAgo(12),
    unread: 0,
    messages: [
      {
        id: "m_101",
        from: "other",
        text: "Hi, is it still available?",
        at: minutesAgo(12),
        avatar: agentTom,
      },
      {
        id: "m_102",
        from: "me",
        text: "Yes available.",
        at: minutesAgo(11),
        avatar: agentSarah,
      },
    ],
  },
  {
    id: "chat_003",
    tab: "renting",
    propertyTitle: "Apartment for rent",
    participant: { name: "Quaid e azam", avatar: userLeslie },
    lastMessage: "22 min ago",
    lastAt: minutesAgo(22),
    unread: 0,
    messages: [
      {
        id: "m_201",
        from: "other",
        text: "Can you share location?",
        at: minutesAgo(22),
        avatar: userLeslie,
      },
      {
        id: "m_202",
        from: "me",
        text: "Sure, sending details.",
        at: minutesAgo(21),
        avatar: agentSarah,
      },
      {
        id: "m_203",
        from: "me",
        text: "",
        at: minutesAgo(21),
        avatar: agentSarah,
        attachment: { type: "image", src: p2 },
      },
    ],
  },
  {
    id: "chat_004",
    tab: "renting",
    propertyTitle: "Apartment for rent",
    participant: { name: "MK Builders", avatar: agentTom },
    lastMessage: "22 min ago",
    lastAt: minutesAgo(22),
    unread: 0,
    messages: [
      {
        id: "m_301",
        from: "other",
        text: "Is price negotiable?",
        at: minutesAgo(22),
        avatar: agentTom,
      },
      {
        id: "m_302",
        from: "me",
        text: "Slightly negotiable.",
        at: minutesAgo(20),
        avatar: agentSarah,
      },
      {
        id: "m_303",
        from: "other",
        text: "",
        at: minutesAgo(19),
        avatar: agentTom,
        attachment: { type: "image", src: p1 },
      },
    ],
  },
];