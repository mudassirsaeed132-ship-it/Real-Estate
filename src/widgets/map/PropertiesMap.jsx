import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import MapPropertyPopover from "./MapPropertyPopover";

function FitBounds({ points = [] }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, points]);

  return null;
}

function markerIcon(imgUrl) {
  const html = `
    <div style="
      width: 42px;
      height: 42px;
      border-radius: 9999px;
      background: #D66355;
      padding: 3px;
      box-shadow: 0 8px 24px rgba(0,0,0,.12);
      display:flex;
      align-items:center;
      justify-content:center;
    ">
      <div style="
        width: 36px;
        height: 36px;
        border-radius: 9999px;
        overflow:hidden;
        background:#fff;
        display:flex;
        align-items:center;
        justify-content:center;
      ">
        <img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover;" />
      </div>
    </div>
  `;

  return L.divIcon({
    className: "re-marker",
    html,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -40],
  });
}

export default function PropertiesMap({ items = [] }) {
  const points = useMemo(
    () => items.filter((x) => typeof x.lat === "number" && typeof x.lng === "number"),
    [items]
  );

  const center = points.length
    ? [points[0].lat, points[0].lng]
    : [30.3753, 69.3451]; // Pakistan fallback

  // ✅ memoize marker icons to avoid recreation on re-render
  const iconById = useMemo(() => {
    const m = new Map();
    for (const p of points) {
      const src = p.images?.[0] || "";
      m.set(p.id, markerIcon(src));
    }
    return m;
  }, [points]);

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-[#EDEDED] bg-white">
      <div className="h-[420px] md:h-[520px] w-full min-w-0">
        <MapContainer
          center={center}
          zoom={12}
          className="h-full w-full"
          scrollWheelZoom={false}
          zoomControl={false}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBounds points={points} />

          {points.map((p) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={iconById.get(p.id)}
            >
              <Popup closeButton={false} autoPan>
                <MapPropertyPopover item={p} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}