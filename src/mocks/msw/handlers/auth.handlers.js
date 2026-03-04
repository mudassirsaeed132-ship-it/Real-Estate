import { http, HttpResponse, delay } from "msw";
import { AUTH_FIXTURE } from "../../db/fixtures/auth";

// supports BOTH relative and full URLs
const LOGIN = /\/api\/auth\/login$/;
const REGISTER = /\/api\/auth\/register$/;

function makeToken(user) {
  return btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Date.now(),
    })
  );
}

export const authHandlers = [
  // ✅ LOGIN: accept ANY credentials (frontend dev mode)
  http.post(LOGIN, async ({ request }) => {
    await delay(300);
    const body = await request.json();

    const role = body.role === "seller" ? "seller" : "buyer";
    const email = String(body.email || "user@email.com").toLowerCase();

    // If email matches fixture user, use it (nice for consistent avatar/name),
    // otherwise create a demo user on the fly.
    const fixtureUser =
      AUTH_FIXTURE?.users?.find((u) => String(u.email).toLowerCase() === email) || null;

    const user = fixtureUser
      ? { ...fixtureUser, role }
      : {
          id: `u_demo_${Math.random().toString(16).slice(2)}`,
          firstName: "Demo",
          lastName: "User",
          email,
          role,
          avatarUrl: "",
        };

    return HttpResponse.json({ token: makeToken(user), user });
  }),

  // ✅ REGISTER: always success + auto-login
  http.post(REGISTER, async ({ request }) => {
    await delay(350);
    const body = await request.json();

    const newUser = {
      id: `u_${Math.random().toString(16).slice(2)}`,
      firstName: body.firstName || "User",
      lastName: body.lastName || "",
      email: String(body.email || "user@email.com").toLowerCase(),
      role: body.role === "seller" ? "seller" : "buyer",
      avatarUrl: "",
    };

    return HttpResponse.json({ token: makeToken(newUser), user: newUser });
  }),
];