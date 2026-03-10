import { cn } from "../../../shared/lib/cn";

export default function RoleCard({ selected, title, imageSrc, onClick }) {
  return (
    <button type="button" onClick={onClick} className={cn("w-full")}>
      <div
        className={[
          "w-full max-w-70 mx-auto",
          "h-55 rounded-[18px] bg-white",
          selected ? "border-2 border-[#D66355]" : "border border-[#D1D5DB]",
          "flex flex-col items-center justify-center gap-4",
        ].join(" ")}
      >
        <img
          src={imageSrc}
          alt=""
          className="h-21.5 w-21.5 object-contain"
          draggable={false}
        />
        <div className="text-[12px] font-semibold text-[#111827] text-center">
          {title}
        </div>
      </div>
    </button>
  );
}