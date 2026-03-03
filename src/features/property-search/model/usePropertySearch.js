import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const DEFAULTS = {
  view: "grid",
  page: "1",
  pageSize: "20",
};

const NON_RESET_KEYS = new Set(["page", "pageSize", "view"]);

export function usePropertySearch() {
  const [sp, setSp] = useSearchParams();

  const params = useMemo(() => {
    const obj = { ...DEFAULTS };
    sp.forEach((v, k) => {
      obj[k] = v;
    });
    return obj;
  }, [sp]);

  /**
   * Production-ready setParam:
   * - deletes empty values
   * - resets page to 1 when a "filter" changes
   * - keeps view/pageSize unless explicitly changed
   */
  const setParam = useCallback(
    (key, value) => {
      const next = new URLSearchParams(sp);

      const isEmpty =
        value === undefined || value === null || String(value).trim() === "";
      if (isEmpty) next.delete(key);
      else next.set(key, String(value));

      if (!NON_RESET_KEYS.has(key)) {
        next.set("page", "1");
      }

      setSp(next, { replace: true });
    },
    [sp, setSp]
  );

  const setParams = useCallback(
    (patch = {}) => {
      const next = new URLSearchParams(sp);

      Object.entries(patch).forEach(([k, v]) => {
        const isEmpty =
          v === undefined || v === null || String(v).trim() === "";
        if (isEmpty) next.delete(k);
        else next.set(k, String(v));
      });

      // Reset paging if any "filter key" changed
      const changedKeys = Object.keys(patch);
      const shouldReset = changedKeys.some((k) => !NON_RESET_KEYS.has(k));
      if (shouldReset) next.set("page", "1");

      setSp(next, { replace: true });
    },
    [sp, setSp]
  );

  const clearAll = useCallback(() => {
    const next = new URLSearchParams();
    next.set("view", params.view || DEFAULTS.view);
    next.set("page", "1");
    next.set("pageSize", params.pageSize || DEFAULTS.pageSize);
    setSp(next, { replace: true });
  }, [params.pageSize, params.view, setSp]);

  return { params, setParam, setParams, clearAll };
}