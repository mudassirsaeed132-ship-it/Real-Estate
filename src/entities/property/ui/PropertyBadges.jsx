export default function PropertyBadges({ badges = [] }) {
  const hasOwner = badges.includes("owner_verified");
  const hasNew = badges.includes("new");

  return (
    <div className="absolute left-3 top-3 flex flex-col gap-2">
      {hasOwner && (
        <span className="w-fit rounded-full bg-white px-3 py-1 text-[11px] font-medium text-[#111827] shadow-sm">
          Owner Verified
        </span>
      )}
      {hasNew && (
        <span className="w-fit rounded-full bg-white px-3 py-1 text-[11px] font-medium text-[#111827] shadow-sm">
          New
        </span>
      )}
    </div>
  );
}
