import { create } from "zustand";
import { ROLES } from "./shapes";

const KEYS = {
  token: "re_token",
  user: "re_user",
  remember: "re_remember",
  role: "re_role",
};

const safeParse = (v, fallback) => {
  try {
    return JSON.parse(v);
  } catch {
    return fallback;
  }
};

const isBrowser = typeof window !== "undefined";

function getStorage(remember) {
  if (!isBrowser) return null;
  return remember ? window.localStorage : window.sessionStorage;
}

function loadInitial() {
  if (!isBrowser) return { token: "", user: null, role: ROLES.BUYER, remember: true };

  const remember = safeParse(window.localStorage.getItem(KEYS.remember), true);
  const storage = getStorage(remember);

  const token = storage?.getItem(KEYS.token) || "";
  const user = safeParse(storage?.getItem(KEYS.user), null);

  // role preference: localStorage/sessionStorage OR user.role OR default buyer
  const role =
    window.localStorage.getItem(KEYS.role) ||
    window.sessionStorage.getItem(KEYS.role) ||
    user?.role ||
    ROLES.BUYER;

  return { token, user, role, remember };
}

export const useSessionStore = create((set, get) => ({
  ...loadInitial(),

  isAuthenticated: () => Boolean(get().token),

  setRole: (role) => {
    const r = role === ROLES.SELLER ? ROLES.SELLER : ROLES.BUYER;
    set({ role: r });
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(KEYS.role, r);
      window.sessionStorage.setItem(KEYS.role, r);
    } catch {}
  },

  setRemember: (remember) => {
    set({ remember: Boolean(remember) });
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(KEYS.remember, JSON.stringify(Boolean(remember)));
    } catch {}
  },

  setSession: ({ token, user }) => {
    const { remember, role } = get();
    const storage = getStorage(remember);

    const nextUser = user || null;
    const nextRole = nextUser?.role || role;

    set({ token: token || "", user: nextUser, role: nextRole });

    if (!storage) return;

    try {
      storage.setItem(KEYS.token, token || "");
      storage.setItem(KEYS.user, JSON.stringify(nextUser));
      storage.setItem(KEYS.role, nextRole);
    } catch {}
  },

  clearSession: () => {
    set({ token: "", user: null });

    if (!isBrowser) return;
    const remember = safeParse(window.localStorage.getItem(KEYS.remember), true);

    // clear token/user from both storages
    [window.localStorage, window.sessionStorage].forEach((s) => {
      try {
        s.removeItem(KEYS.token);
        s.removeItem(KEYS.user);
      } catch {}
    });

    // keep user preferences (role/remember)
    try {
      window.localStorage.setItem(KEYS.remember, JSON.stringify(remember));
    } catch {}
  },
}));