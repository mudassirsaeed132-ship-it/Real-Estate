import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PageShell from "../../app/layout/PageShell";
import HeaderSearch from "./HeaderSearch";
import UserMenu from "./UserMenu";
import logo from "../../assets/images/logo/real-estate-logo.png";
import Applogo from "../../assets/images/logo/logo.png";

export default function Header() {
  const headerRef = useRef(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const setVar = () => {
      const h = el.offsetHeight || 0;
      document.documentElement.style.setProperty("--app-header-h", `${h}px`);
    };

    setVar();

    //  auto update on resize / content change
    const ro = new ResizeObserver(() => setVar());
    ro.observe(el);

    window.addEventListener("resize", setVar);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      id="app-header"
      className="sticky top-0 z-40 w-full border-b border-[#EDEDED] bg-white"
    >
      <PageShell className="py-3">
        {/* Row 1 */}
        <div className="flex items-center gap-3 min-w-0">
          {/*  SPA friendly (no full reload) */}
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Home">
            <img
              src={Applogo}
              alt="Real Estate"
              className="h-9 sm:h-10 w-auto max-w-40 object-contain"
            />
          </Link>

          <div className="hidden lg:flex flex-1 min-w-0 items-center">
            <div className="w-full min-w-0 max-w-190">
              <HeaderSearch showCta />
            </div>
          </div>

          <div className="ml-auto shrink-0">
            <UserMenu />
          </div>
        </div>

        {/* Row 2 */}
        <div className="mt-3 lg:hidden min-w-0">
          <HeaderSearch />
        </div>
      </PageShell>
    </header>
  );
}