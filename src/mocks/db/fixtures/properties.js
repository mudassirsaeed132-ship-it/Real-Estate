import p1 from "../../../assets/images/properties/p1.png";
import p2 from "../../../assets/images/properties/p2.png";
import p3 from "../../../assets/images/properties/p3.png";
import p4 from "../../../assets/images/properties/p4.png";

const IMGS = [p1, p2, p3, p4];

function rotate(arr, startIndex) {
  const s = startIndex % arr.length;
  return [...arr.slice(s), ...arr.slice(0, s)];
}

function makeGallery(i, count = 5) {
  const base = rotate(IMGS, i);
  const out = [];
  for (let k = 0; k < count; k++) out.push(base[k % base.length]);
  return out;
}

export const PROPERTIES_FIXTURE = Array.from({ length: 40 }).map((_, i) => {
  const id = String(i + 1).padStart(3, "0");
  const purpose = i % 3 === 0 ? "rent" : "sale";
  const rooms = i % 4 === 0 ? 1 : 4;
  const baths = i % 5 === 0 ? 1 : 2;
  const hasBalcony = i % 6 !== 0;

  const badges = [];
  if (i % 2 === 0) badges.push("owner_verified");
  if (i % 3 === 0) badges.push("new");

  const gallery = makeGallery(i, 5);

  return {
    id: `prop_${id}`,
    title: "Modern Luxury Apartment",
    address: "Bahnhofstrasse 12, Zurich",
    purpose,
    rooms,
    baths,
    features: hasBalcony ? ["balcony"] : [],
    badges,
    bedsText: rooms === 1 ? "Single room" : "4.5rms",
    areaText: "120m²",

    // ✅ important: different first image per card
    images: gallery,
    cover: gallery[0],

    lat: 47.3769 + i * 0.001,
    lng: 8.5417 + i * 0.001,
  };
});