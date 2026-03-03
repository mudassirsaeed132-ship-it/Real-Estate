import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "leaflet/dist/leaflet.css";

async function enableMocks() {
  const { worker } = await import("./mocks/msw/browser");
  return worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
  });
}

(async () => {
  const forceEnable = import.meta.env.VITE_ENABLE_MSW === "true";
  const forceDisable = import.meta.env.VITE_DISABLE_MSW === "true";
  const shouldMock = forceEnable || (!forceDisable && !import.meta.env.VITE_API_BASE_URL);

  if (shouldMock) {
    try {
      await enableMocks();
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
