// PATH: src/widgets/property/PropertyGrid.jsx
import PropertyCard from "./PropertyCard";

export default function PropertyGrid({ items = [], cardProps = {} }) {
  return (
    <div className="grid min-w-0 gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((p) => (
        <div key={p.id} className="min-w-0">
          <PropertyCard property={p} {...cardProps} />
        </div>
      ))}
    </div>
  );
}