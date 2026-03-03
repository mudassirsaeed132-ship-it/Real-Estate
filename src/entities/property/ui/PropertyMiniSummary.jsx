import locationIcon from "../../../assets/icons/property/location.svg";

export default function PropertyMiniSummary({ property }) {
  const img = property.images?.[0];

  return (
    <a href={`/properties/${property.id}`} className="flex gap-3">
      <div className="h-16 w-20 overflow-hidden rounded-xl bg-[#F3F4F6]">
        {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : null}
      </div>

      <div className="min-w-0">
        <div className="text-sm font-semibold text-[#111827] line-clamp-1">{property.title}</div>
        <div className="mt-1 flex items-center gap-2 text-xs text-[#6B7280]">
          <img src={locationIcon} alt="" className="h-3.5 w-3.5" />
          <span className="line-clamp-1">{property.address}</span>
        </div>
        <div className="mt-2 text-xs text-[#D66355] font-semibold">
          {property.purpose === "rent" ? "For Rent" : "For Sale"}
        </div>
      </div>
    </a>
  );
}
