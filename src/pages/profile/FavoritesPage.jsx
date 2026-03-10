// PATH: src/pages/profile/FavoritesPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Heart } from "lucide-react";
import PageShell from "../../app/layout/PageShell";
import PageHeaderBar from "../../shared/ui/PageHeaderBar";
import IconButton from "../../shared/ui/IconButton";
import Skeleton from "../../shared/ui/Skeleton";
import PropertyGrid from "../../widgets/property/PropertyGrid";
import { apiGet } from "../../services/api/client";
import { ENDPOINTS } from "../../services/api/endpoints";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    apiGet(ENDPOINTS.profileFavorites)
      .then((d) => alive && setItems(d?.items || []))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="bg-[#FAFAFA]">
      <PageShell className="py-8">
        <PageHeaderBar
          title="Favourites"
          onBack={() => navigate("/profile")}
          right={
            <div className="flex items-center overflow-hidden rounded-xl border border-[#EDEDED] bg-[#F7E5E2]">
              {/*  go to saved searches */}
              <IconButton
                className="h-10 w-10"
                aria-label="Saved Searches"
                onClick={() => navigate("/profile/saved-searches")}
              >
                <Bookmark className="h-4 w-4 text-[#D66355]" />
              </IconButton>

              <div className="h-6 w-px bg-[#EDEDED]" />

              {/* active tab (Favourites) */}
              <IconButton className="h-10 w-10" aria-label="Favourites">
                <Heart className="h-4 w-4 text-[#D66355]" />
              </IconButton>
            </div>
          }
        />

        <div className="mt-5 rounded-2xl border border-[#EDEDED] bg-white p-5 sm:p-8">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-[#EDEDED] bg-white p-4">
                  <Skeleton className="aspect-4/3 w-full" />
                  <Skeleton className="mt-4 h-4 w-3/4" />
                  <Skeleton className="mt-2 h-4 w-2/3" />
                  <Skeleton className="mt-4 h-10 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <PropertyGrid items={items} cardProps={{ initialFav: true }} />
          )}
        </div>
      </PageShell>
    </div>
  );
}