import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Heart, MessageSquareText, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import IconButton from "../../shared/ui/IconButton";
import Button from "../../shared/ui/Button";
import avatarTom from "../../assets/images/avatars/agent-tom.jpg";
import NotificationsPopover from "../../features/notifications/ui/NotificationsPopover";

import { useSessionStore } from "../../entities/session/model/sessionStore";
import { ROLES } from "../../entities/session/model/shapes";

export default function UserMenu() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const wrapRef = useRef(null);

  // ✅ IMPORTANT: do NOT return objects from zustand selector
  const token = useSessionStore((s) => s.token);
  const user = useSessionStore((s) => s.user);
  const role = useSessionStore((s) => s.role);
  const clearSession = useSessionStore((s) => s.clearSession);

  const isAuthed = Boolean(token);

  // buyer/renter only app? then keep this false
  const showSell = isAuthed && role === ROLES.SELLER;

  const uiUser = useMemo(() => {
    const name = user?.firstName || user?.name || "User";
    const avatar = user?.avatarUrl || user?.avatar || avatarTom;
    return { name, avatar };
  }, [user]);

  useEffect(() => {
    if (!menuOpen && !notifOpen) return;

    const onDown = (e) => {
      const el = wrapRef.current;
      if (!el) return;
      if (!el.contains(e.target)) {
        setMenuOpen(false);
        setNotifOpen(false);
      }
    };

    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, notifOpen]);

  const goAuth = (nextPath) => {
    const next = encodeURIComponent(nextPath || "/");
    navigate(`/auth/role?next=${next}`);
  };

  const go = (path) => {
    setMenuOpen(false);
    setNotifOpen(false);
    navigate(path);
  };

  return (
    <div className="flex items-center gap-2" ref={wrapRef}>
      {!isAuthed ? (
        <Button onClick={() => goAuth("/")} className="h-10 rounded-full px-5">
          Login
        </Button>
      ) : (
        <>
          <IconButton
            className="h-9 w-9 sm:h-10 sm:w-10"
            aria-label="Favorites"
            onClick={() => go("/profile/favorites")}
          >
            <Heart className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-[#6B7280]" />
          </IconButton>

          <IconButton
            className="h-9 w-9 sm:h-10 sm:w-10"
            aria-label="Chats"
            onClick={() => go("/inbox")}
          >
            <MessageSquareText className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-[#6B7280]" />
          </IconButton>

          <IconButton
            className="h-9 w-9 sm:h-10 sm:w-10"
            aria-label="Notifications"
            onClick={() => {
              setMenuOpen(false);
              setNotifOpen((v) => !v);
            }}
          >
            <Bell className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-[#6B7280]" />
          </IconButton>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotifOpen(false);
                setMenuOpen((v) => !v);
              }}
              className="ml-1 inline-flex items-center gap-2 rounded-full border border-transparent p-1 pr-2 transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D66355] focus-visible:ring-offset-2"
              aria-label="User menu"
              aria-expanded={menuOpen}
            >
              <span className="relative inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full">
                <img
                  src={uiUser.avatar}
                  alt="User"
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover"
                  draggable={false}
                />
                <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-[#D66355]" />
              </span>

              <ChevronDown className="h-4 w-4 text-[#6B7280]" />
            </button>

            {menuOpen ? (
              <div
                className={[
                  "absolute right-0 top-full mt-2 z-50",
                  "w-[320px] max-w-[92vw]",
                  "max-sm:fixed max-sm:right-3 max-sm:top-16 max-sm:mt-0",
                  "overflow-hidden rounded-2xl border border-[#EDEDED] bg-white shadow-xl",
                ].join(" ")}
                role="menu"
              >
                <div className="flex items-center gap-3 px-4 py-4">
                  <img src={uiUser.avatar} alt="" className="h-11 w-11 rounded-full object-cover" draggable={false} />

                  <div className="min-w-0">
                    <div className="truncate text-[16px] sm:text-[18px] font-semibold text-[#111827] leading-tight">
                      {uiUser.name}
                    </div>

                    <button
                      type="button"
                      onClick={() => go("/profile")}
                      className="mt-1 text-[13px] sm:text-[14px] font-semibold text-[#D66355] underline underline-offset-4"
                    >
                      View Public Profile
                    </button>
                  </div>
                </div>

                <div className="h-px bg-[#EDEDED]" />

                <button
                  type="button"
                  onClick={() => go("/settings/privacy-controls")}
                  className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-black/[0.02]"
                  role="menuitem"
                >
                  <span className="text-[15px] sm:text-[16px] font-semibold text-[#111827]">
                    Privacy controls
                  </span>
                  <ChevronRight className="h-5 w-5 text-[#9CA3AF]" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setNotifOpen(false);
                    clearSession();
                    navigate("/", { replace: true });
                  }}
                  className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-black/[0.02]"
                  role="menuitem"
                >
                  <span className="text-[15px] sm:text-[16px] font-semibold text-[#111827]">
                    Logout
                  </span>
                  <ChevronRight className="h-5 w-5 text-[#9CA3AF]" />
                </button>
              </div>
            ) : null}
          </div>

          {showSell ? (
            <Button
              variant="outline"
              onClick={() => go("/sell")}
              className="hidden sm:inline-flex h-10 rounded-full border-[#D66355] text-[#D66355] hover:bg-[#D66355]/10 px-4"
            >
              <span className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                SELL
              </span>
            </Button>
          ) : null}

          <NotificationsPopover open={notifOpen} onClose={() => setNotifOpen(false)} />
        </>
      )}
    </div>
  );
}