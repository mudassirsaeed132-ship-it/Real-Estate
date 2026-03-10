import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../widgets/header/Header";
import Footer from "../../widgets/footer/Footer";
import { compareActions } from "../../features/property-compare/model/compareStore";

export default function RootLayout({ children }) {
  const { pathname } = useLocation();

  //  auth screens should be clean (no header/footer)
  const isAuthRoute = (pathname || "").startsWith("/auth");

  useEffect(() => {
    const p = pathname || "";
    const allowCompare = p.startsWith("/properties") || p.startsWith("/compare");
    if (!allowCompare) compareActions.stop({ clear: true });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white text-[#111827] overflow-x-hidden flex flex-col">
      {!isAuthRoute && <Header />}

      <main className="min-w-0 flex-1">{children ?? <Outlet />}</main>

      {!isAuthRoute && <Footer />}
    </div>
  );
}