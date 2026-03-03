// src/app/layout/RootLayout.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../widgets/header/Header";
import Footer from "../../widgets/footer/Footer";
import { compareActions } from "../../features/property-compare/model/compareStore";

export default function RootLayout({ children }) {
  const location = useLocation();

  useEffect(() => {
    const p = location.pathname || "";

    // ✅ allow compare only on /properties and /compare
    const allowCompare = p.startsWith("/properties") || p.startsWith("/compare");

    if (!allowCompare) {
      compareActions.stop({ clear: true });
    }
  }, [location.pathname]);

  return (
  <div className="min-h-screen bg-white text-[#111827] overflow-x-hidden">
    <Header />
    <main className="min-w-0">{children}</main>
    <Footer />
  </div>
);
}