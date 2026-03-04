import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function getHeaderOffset() {
  const cssVal = getComputedStyle(document.documentElement).getPropertyValue("--app-header-h").trim();
  const n = Number.parseFloat(cssVal);
  if (Number.isFinite(n)) return n;
  const header = document.getElementById("app-header");
  return header?.offsetHeight || 0;
}

function scrollToHash(hash) {
  const id = decodeURIComponent(hash.replace("#", ""));
  if (!id) return false;

  const el = document.getElementById(id) || document.querySelector(`[name="${CSS.escape(id)}"]`);
  if (!el) return false;

  const header = getHeaderOffset();
  const y = el.getBoundingClientRect().top + window.scrollY - header - 12;

  window.scrollTo({ top: Math.max(0, y), left: 0, behavior: "smooth" });
  return true;
}

export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    //  if hash exists, wait for lazy content then scroll
    if (hash) {
      let tries = 0;
      const maxTries = 30;

      const tick = () => {
        tries += 1;
        const ok = scrollToHash(hash);
        if (!ok && tries < maxTries) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
      return;
    }

    //  route change => instant top (no jank / no long smooth)
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}