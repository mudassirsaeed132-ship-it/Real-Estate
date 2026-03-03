// PATH: src/mocks/db/fixtures/profile.js
import userLeslie from "../../../assets/images/avatars/user-leslie.jpg";
import p1 from "../../../assets/images/properties/p1.png";
import p2 from "../../../assets/images/properties/p2.png";

export const PROFILE_FIXTURE = {
  user: {
    id: "user_001",
    name: "Benjamin Franklyn",
    avatar: userLeslie,
  },

  settings: {
    language: "swedish",
    currency: "pound",
  },

  languageOptions: [
    { value: "english", label: "English" },
    { value: "swedish", label: "Swedish" },
    { value: "french", label: "French" },
    { value: "urdu", label: "Urdu" },
  ],

  currencyOptions: [
    { value: "dollar", label: "Dollar" },
    { value: "pound", label: "Pound" },
    { value: "rupee", label: "Rupee" },
  ],
};

export const SAVED_SEARCHES_FIXTURE = [
  { id: "ss_1", title: "500 Sq yd House for sale in Zurich, LETTEN", results: 17 },
  { id: "ss_2", title: "500 Sq yd House for sale in Zurich, LETTEN", results: 17 },
  { id: "ss_3", title: "500 Sq yd House for sale in Zurich, LETTEN", results: 17 },
  { id: "ss_4", title: "500 Sq yd House for sale in Zurich, LETTEN", results: 17 },
  { id: "ss_5", title: "500 Sq yd House for sale in Zurich, LETTEN", results: 17 },
];

export const VIEWED_PROPERTIES_FIXTURE = [
  {
    label: "Today",
    items: [
      { id: "prop_001", title: "Modern Downtown Apartment", price: "$2500/mo", purpose: "sale", thumb: p1 },
      { id: "prop_002", title: "Modern Downtown Apartment", price: "$2500/mo", purpose: "rent", thumb: p2 },
    ],
  },
  {
    label: "12 May 2025",
    items: [
      { id: "prop_003", title: "Modern Downtown Apartment", price: "$2500/mo", purpose: "sale", thumb: p1 },
      { id: "prop_004", title: "Modern Downtown Apartment", price: "$2500/mo", purpose: "rent", thumb: p2 },
    ],
  },
  {
    label: "11 May 2025",
    items: [
      { id: "prop_005", title: "Modern Downtown Apartment", price: "$2500/mo", purpose: "sale", thumb: p1 },
      { id: "prop_006", title: "Modern Downtown Apartment", price: "$2500/mo", purpose: "rent", thumb: p2 },
    ],
  },
];

/**
 * ✅ NEW: Figma Bookings data (Completed + Ongoing)
 * - Completed = list rows (title, person, location, price, status, thumb)
 * - Ongoing = cards (image, tags, details OR review)
 */
export const PROFILE_BOOKINGS_FIXTURE = {
  completed: [
    {
      id: "c_001",
      title: "Sky Dandelions Apartment",
      person: "Jordan Smith",
      location: "Manhattan, New York",
      price: "$400",
      status: "Pending",
      thumb: p1,
    },
    {
      id: "c_002",
      title: "Sky Dandelions Apartment",
      person: "Jordan Smith",
      location: "Manhattan, New York",
      price: "$600,000",
      status: "Approved",
      thumb: p2,
    },
    {
      id: "c_003",
      title: "Sky Dandelions Apartment",
      person: "Jordan Smith",
      location: "Manhattan, NY",
      price: "$600,000",
      status: "Pending",
      thumb: p1,
    },
    {
      id: "c_004",
      title: "Sky Dandelions Apartment",
      person: "Jordan Smith",
      location: "Manhattan, New York",
      price: "$400",
      status: "Pending",
      thumb: p2,
    },
    {
      id: "c_005",
      title: "Sky Dandelions Apartment",
      person: "Jordan Smith",
      location: "Manhattan, New York",
      price: "$600,000",
      status: "Approved",
      thumb: p1,
    },
    {
      id: "c_006",
      title: "Sky Dandelions Apartment",
      person: "Jordan Smith",
      location: "Manhattan, New York",
      price: "$400",
      status: "Pending",
      thumb: p2,
    },
  ],

  ongoing: [
    // Details card
    {
      id: "o_001",
      title: "Bridgeland Modern House",
      location: "Manhattan, New York",
      image: p1,
      tagLeft: "Rented",
      tagRight: "Paid",
      duration: "12 months",
      start: "Jan 1, 2026",
      end: "Dec 31, 2026",
      action: "details",
    },
    {
      id: "o_002",
      title: "Bridgeland Modern House",
      location: "Manhattan, New York",
      image: p2,
      tagLeft: "Rented",
      tagRight: "Paid",
      duration: "12 months",
      start: "Jan 1, 2026",
      end: "Dec 31, 2026",
      action: "details",
    },

    // Review card (completed inside ongoing tab)
    {
      id: "o_003",
      title: "Bridgeland Modern House",
      location: "Manhattan, New York",
      image: p1,
      tagLeft: "Rented",
      tagRight: "Paid",
      completed: "Dec 31, 2025",
      owner: "Jane West",
      action: "review",
    },
    {
      id: "o_004",
      title: "Bridgeland Modern House",
      location: "Manhattan, New York",
      image: p2,
      tagLeft: "Rented",
      tagRight: "Paid",
      completed: "Dec 31, 2025",
      owner: "Jane West",
      action: "review",
    },
  ],
};

/**
 * ✅ Backwards-compat (if any old code still expects groups)
 * (Optional but safe)
 */
export const BOOKINGS_FIXTURE = [
  {
    label: "Today",
    items: PROFILE_BOOKINGS_FIXTURE.completed.slice(0, 2).map((x) => ({
      id: x.id,
      title: x.title,
      subtitle: x.price,
      status: x.status,
      thumb: x.thumb,
    })),
  },
  {
    label: "12 May 2025",
    items: PROFILE_BOOKINGS_FIXTURE.completed.slice(2, 3).map((x) => ({
      id: x.id,
      title: x.title,
      subtitle: x.price,
      status: x.status,
      thumb: x.thumb,
    })),
  },
];