import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "leaflet/dist/leaflet.css";

async function enableMocks() {
  const { worker } = await import("./mocks/msw/browser");
  await worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
  });

  // ✅ Ensure SW is ready
  if ("serviceWorker" in navigator) {
    await navigator.serviceWorker.ready;

    // If controller is still missing, MSW can't intercept yet.
    // Fallback: one-time reload to let SW take control.
    if (!navigator.serviceWorker.controller) {
      const key = "__msw_reload_once__";
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        window.location.reload();
      }
    }
  }
}

(async () => {
  const forceEnable = import.meta.env.VITE_ENABLE_MSW === "true";
  const forceDisable = import.meta.env.VITE_DISABLE_MSW === "true";

  const hasApiBase = Boolean(import.meta.env.VITE_API_BASE_URL);
  const isDev = import.meta.env.DEV;

  // ✅ Default behavior:
  // - DEV: MSW ON if API base not set (or force enable)
  // - PROD: MSW OFF unless explicitly forced
  const shouldMock = (isDev && !forceDisable && !hasApiBase) || (forceEnable && !forceDisable);

  if (shouldMock) {
    try {
      if (!("serviceWorker" in navigator)) {
        console.warn("MSW requires Service Worker support in this browser.");
      } else {
        await enableMocks();
      }
    } catch (e) {
      console.warn("MSW failed to start; falling back to real network requests.", e);
    }
  }

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})();