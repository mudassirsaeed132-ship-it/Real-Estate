// src/mocks/db/fixtures/precheck.js
import p1 from "../../../assets/images/properties/p1.png";
import p2 from "../../../assets/images/properties/p2.png";
import p3 from "../../../assets/images/properties/p3.png";
import p4 from "../../../assets/images/properties/p4.png";

const IMGS = [p1, p2, p3, p4];

export const PRECHECK_PROPERTIES_FIXTURE = Array.from({ length: 12 }).map((_, i) => {
  const id = `pc_${String(i + 1).padStart(3, "0")}`;
  const img = IMGS[i % IMGS.length];

  return {
    id,
    title: "Modern Downtown Apartment",
    location: "Downtown, City Center",
    price: "$2500/mo",
    thumb: img,
    image: img,
  };
});