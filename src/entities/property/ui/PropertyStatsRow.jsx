import bedIcon from "../../../assets/icons/property/bed.svg";
import areaIcon from "../../../assets/icons/property/area.svg";

export default function PropertyStatsRow({ bedsText, areaText }) {
  return (
    <div className="mt-3 flex items-center gap-6 text-sm text-[#6B7280]">
      <div className="flex items-center gap-2">
        <img src={bedIcon} alt="" className="h-4 w-4" />
        <span>{bedsText}</span>
      </div>

      <div className="flex items-center gap-2">
        <img src={areaIcon} alt="" className="h-4 w-4" />
        <span>{areaText}</span>
      </div>
    </div>
  );
}
