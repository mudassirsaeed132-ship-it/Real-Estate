// PATH: src/pages/profile/SavedSearchesPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Heart } from "lucide-react";
import PageShell from "../../app/layout/PageShell";
import PageHeaderBar from "../../shared/ui/PageHeaderBar";
import ListRow from "../../shared/ui/ListRow";
import IconButton from "../../shared/ui/IconButton";
import Skeleton from "../../shared/ui/Skeleton";
import { apiGet } from "../../services/api/client";
import { ENDPOINTS } from "../../services/api/endpoints";

export default function SavedSearchesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    apiGet(ENDPOINTS.profileSavedSearches)
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
          title="Saved Searches"
          onBack={() => navigate("/profile")}
          right={
            <div className="flex items-center overflow-hidden rounded-xl border border-[#EDEDED] bg-[#F7E5E2]">
              {/* ✅ active tab (Saved Searches) */}
              <IconButton className="h-10 w-10" aria-label="Saved Searches">
                <Bookmark className="h-4 w-4 text-[#D66355]" />
              </IconButton>

              <div className="h-6 w-px bg-[#EDEDED]" />

              {/* ✅ go to favourites */}
              <IconButton
                className="h-10 w-10"
                aria-label="Favourites"
                onClick={() => navigate("/profile/favorites")}
              >
                <Heart className="h-4 w-4 text-[#D66355]" />
              </IconButton>
            </div>
          }
        />

        <div className="mt-5 rounded-2xl border border-[#EDEDED] bg-white p-5 sm:p-8">
          <div className="space-y-4">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-[72px] w-full rounded-2xl" />
                ))
              : items.map((it) => (
                  <ListRow
                    key={it.id}
                    title={it.title}
                    subtitle={`${it.results} Results`}
                    onClick={() => alert("Open search (dummy)")}
                  />
                ))}
          </div>
        </div>
      </PageShell>
    </div>
  );
}