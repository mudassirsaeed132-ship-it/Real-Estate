import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";

export function useNotifications(type = "all", { enabled = true } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({ today: [], older: [] });

  useEffect(() => {
    if (!enabled) return;

    let alive = true;
    setLoading(true);
    setError("");

    apiGet(`${ENDPOINTS.notifications}?type=${encodeURIComponent(type || "all")}`)
      .then((d) => {
        if (!alive) return;
        const groups = d?.groups || d?.data?.groups || {};
        setData({
          today: Array.isArray(groups.today) ? groups.today : [],
          older: Array.isArray(groups.older) ? groups.older : [],
        });
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Failed to load notifications");
        setData({ today: [], older: [] });
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [type, enabled]);

  return useMemo(() => ({ ...data, loading, error }), [data, loading, error]);
}