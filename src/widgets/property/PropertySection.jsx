import { Link } from "react-router-dom";
import PropertyGrid from "./PropertyGrid";

export default function PropertySection({ title, subtitle, items = [] }) {
  return (
    <section className="py-10">
      {/* ✅ Make "View all" sit LOWER (aligned with the bottom of the heading block) */}
      <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-[#D66355]">{title}</h2>
          <p className="mt-1 text-sm text-[#9CA3AF]">{subtitle}</p>
        </div>

        <Link
          to="/properties"
          className="text-sm text-[#D66355] hover:underline pb-[2px]"
        >
          View all
        </Link>
      </div>

      <PropertyGrid items={items} />
    </section>
  );
}