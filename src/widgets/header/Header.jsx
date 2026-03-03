import PageShell from "../../app/layout/PageShell";
import HeaderSearch from "./HeaderSearch";
import UserMenu from "./UserMenu";
import logo from "../../assets/images/logo/real-estate-logo.png";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EDEDED] bg-white">
      <PageShell className="py-3">
        {/* Row 1: Logo + Desktop Search + UserMenu */}
        <div className="flex items-center gap-3 min-w-0">
          <a href="/" className="flex items-center gap-2 shrink-0">
            <img
              src={logo}
              alt="Real Estate"
              className="h-9 sm:h-10 w-auto max-w-[160px] object-contain"
            />
          </a>

          {/* Desktop search: grows/shrinks properly, never overflows */}
          <div className="hidden lg:flex flex-1 min-w-0 items-center">
            <div className="w-full min-w-0 max-w-[760px]">
              <HeaderSearch showCta />
            </div>
          </div>

          {/* Right icons/menu (never shrink) */}
          <div className="ml-auto shrink-0">
            <UserMenu />
          </div>
        </div>

        {/* Row 2: Mobile/Tablet search */}
        <div className="mt-3 lg:hidden min-w-0">
          <HeaderSearch />
        </div>
      </PageShell>
    </header>
  );
}