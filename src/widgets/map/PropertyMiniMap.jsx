import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";

function pin() {
  return L.divIcon({
    className: "re-marker",
    html: `
      <div style="
        width: 34px;height:34px;border-radius:9999px;
        background:#D66355;display:flex;align-items:center;justify-content:center;
        box-shadow:0 10px 24px rgba(0,0,0,.18);
      ">
        <div style="width:12px;height:12px;border-radius:9999px;background:#fff"></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
  });
}

export default function PropertyMiniMap({ lat, lng }) {
  const center = useMemo(() => {
    if (typeof lat === "number" && typeof lng === "number") return [lat, lng];
    return [30.3753, 69.3451]; // fallback
  }, [lat, lng]);

  return (
    <div className="overflow-hidden rounded-xl border border-[#EDEDED]">
      <div className="h-42.5 w-full">
        <MapContainer center={center} zoom={13} className="h-full w-full">
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {typeof lat === "number" && typeof lng === "number" ? (
            <Marker position={[lat, lng]} icon={pin()} />
          ) : null}
        </MapContainer>
      </div>
    </div>
  );
}