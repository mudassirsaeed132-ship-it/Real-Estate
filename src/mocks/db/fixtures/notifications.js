import avatar1 from "../../../assets/images/avatars/agent-tom.jpg";
import avatar2 from "../../../assets/images/avatars/agent-sarah.jpg";

export const NOTIFICATIONS_FIXTURE = [
  // TODAY
  {
    id: "n_1",
    bucket: "today",
    type: "sale",
    name: "Geraldo",
    avatar: avatar1,
    text: "Just giving 5 Star review on your listing",
    accent: "Fairview Apartment.",
    time: "3 mins ago",
  },
  {
    id: "n_2",
    bucket: "today",
    type: "rent",
    name: "Emmett Perry",
    avatar: avatar2,
    text: "Just booked 2 days in Geraldo’s game Apartment. View full details…",
    accent: "",
    time: "1 hour ago",
  },

  // OLDER
  {
    id: "n_3",
    bucket: "older",
    type: "sale",
    name: "Velma Cole",
    avatar: avatar1,
    text: "Just favorited your listing",
    accent: "Schoolview House",
    time: "2 days ago",
  },
  {
    id: "n_4",
    bucket: "older",
    type: "short-stays",
    name: "Velma Cole",
    avatar: avatar2,
    text: "Just favorited your listing",
    accent: "Schoolview House",
    time: "2 days ago",
  },
];