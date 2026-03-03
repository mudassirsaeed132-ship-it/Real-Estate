// PATH: src/pages/profile/ViewedPropertiesPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, KeyRound } from "lucide-react";
import PageShell from "../../app/layout/PageShell";
import PageHeaderBar from "../../shared/ui/PageHeaderBar";
import ListRow from "../../shared/ui/ListRow";
import Skeleton from "../../shared/ui/Skeleton";
import { apiGet } from "../../services/api/client";
import { ENDPOINTS } from "../../services/api/endpoints";

export default function ViewedPropertiesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    apiGet(ENDPOINTS.profileViewed)
      .then((d) => alive && setGroups(d?.groups || []))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="bg-[#FAFAFA]">
      <PageShell className="py-8">
        <PageHeaderBar
          title="Viewed Properties"
          onBack={() => navigate("/profile")}
        />

        <div className="mt-5 rounded-2xl border border-[#EDEDED] bg-white p-5 sm:p-8">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[72px] w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {groups.map((g) => (
                <div key={g.label}>
                  <div className="text-[14px] text-[#6B7280]">{g.label}</div>
                  <div className="mt-3 space-y-4">
                    {g.items.map((it) => (
                      <ListRow
                        key={it.id}
                        left={
                          <img
                            src={it.thumb}
                            alt=""
                            className="h-10 w-12 rounded-lg object-cover"
                            draggable={false}
                          />
                        }
                        title={it.title}
                        subtitle={it.price}
                        right={
                          <span className="inline-flex items-center gap-2 text-[#111827]">
                            {it.purpose === "sale" ? (
                              <Tag className="h-4 w-4 text-[#D66355]" />
                            ) : (
                              <KeyRound className="h-4 w-4 text-[#D66355]" />
                            )}
                            {it.purpose === "sale" ? "For Sale" : "For Rent"}
                          </span>
                        }
                        onClick={() => navigate(`/properties/${it.id}`)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageShell>
    </div>
  );
}