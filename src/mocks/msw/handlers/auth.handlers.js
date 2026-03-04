import { http, HttpResponse, delay } from "msw";
import { AUTH_FIXTURE } from "../../db/fixtures/auth";

// supports BOTH relative and full URLs
const LOGIN = /\/api\/auth\/login$/;
const REGISTER = /\/api\/auth\/register$/;
const SET_PASSWORD = /\/api\/auth\/set-password$/;
const VERIFY_CODE = /\/api\/auth\/verify-code$/;
const RESEND_CODE = /\/api\/auth\/resend-code$/;

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

// very small in-memory store for mock auth flow
const pendingChallenges = new Map(); // challengeId -> user
const usersByEmail = new Map(); // email -> user

function makeChallengeId() {
  return `ch_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export const authHandlers = [
  // ✅ LOGIN: accept ANY credentials (frontend dev mode)
  http.post(LOGIN, async ({ request }) => {
    await delay(300);
    const body = await request.json();

    const role = body.role === "seller" ? "seller" : "buyer";
    const email = String(body.email || "user@email.com").toLowerCase();

    const fixtureUser =
      AUTH_FIXTURE?.users?.find((u) => String(u.email).toLowerCase() === email) || null;

    const stored = usersByEmail.get(email) || null;

    const user = stored
      ? { ...stored, role }
      : fixtureUser
        ? { ...fixtureUser, role }
        : {
            id: `u_demo_${Math.random().toString(16).slice(2)}`,
            firstName: "Demo",
            lastName: "User",
            email,
            role,
            avatarUrl: "",
          };

    usersByEmail.set(email, user);

    return HttpResponse.json({ token: makeToken(user), user });
  }),

  // ✅ REGISTER: success BUT no auto-login (go to set-password flow)
  http.post(REGISTER, async ({ request }) => {
    await delay(350);
    const body = await request.json();

    const email = String(body.email || "user@email.com").toLowerCase();
    const role = body.role === "seller" ? "seller" : "buyer";

    const newUser = {
      id: `u_${Math.random().toString(16).slice(2)}`,
      firstName: body.firstName || "User",
      lastName: body.lastName || "",
      email,
      role,
      avatarUrl: "",
    };

    usersByEmail.set(email, newUser);

    const challengeId = makeChallengeId();
    pendingChallenges.set(challengeId, newUser);

    // ✅ IMPORTANT: no token here, so frontend continues to set-password
    return HttpResponse.json({ challengeId, email });
  }),

  // ✅ SET PASSWORD: accept anything, keep challenge alive
  http.post(SET_PASSWORD, async ({ request }) => {
    await delay(300);
    const body = await request.json();

    const email = String(body.email || "").toLowerCase();
    const challengeId = String(body.challengeId || "");

    const user =
      (challengeId && pendingChallenges.get(challengeId)) ||
      (email && usersByEmail.get(email)) ||
      null;

    if (!user) {
      return HttpResponse.json({ message: "Invalid signup flow" }, { status: 400 });
    }

    // keep challenge for verify step
    if (challengeId) pendingChallenges.set(challengeId, user);

    return HttpResponse.json({ ok: true, challengeId: challengeId || makeChallengeId() });
  }),

  // ✅ VERIFY CODE: accept any code; return token to auto-login
  http.post(VERIFY_CODE, async ({ request }) => {
    await delay(300);
    const body = await request.json();

    const email = String(body.email || "").toLowerCase();
    const role = body.role === "seller" ? "seller" : "buyer";
    const challengeId = String(body.challengeId || "");

    const user =
      (challengeId && pendingChallenges.get(challengeId)) ||
      (email && usersByEmail.get(email)) ||
      null;

    if (!user) {
      return HttpResponse.json({ message: "Invalid verification flow" }, { status: 400 });
    }

    const finalUser = { ...user, role };
    usersByEmail.set(finalUser.email, finalUser);

    // mark flow complete
    if (challengeId) pendingChallenges.delete(challengeId);

    return HttpResponse.json({ token: makeToken(finalUser), user: finalUser });
  }),

  // ✅ RESEND CODE: always ok
  http.post(RESEND_CODE, async () => {
    await delay(200);
    return HttpResponse.json({ ok: true });
  }),
];