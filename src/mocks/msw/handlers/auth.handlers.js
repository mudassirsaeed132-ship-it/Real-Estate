import { http, HttpResponse, delay } from "msw";
import { AUTH_FIXTURE } from "../../db/fixtures/auth";

// supports BOTH relative and full URLs
const LOGIN = /\/api\/auth\/login$/;
const REGISTER = /\/api\/auth\/register$/;
const FORGOT_PASSWORD = /\/api\/auth\/forgot-password$/;
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

const pendingChallenges = new Map(); // challengeId -> { type, user/email }
const usersByEmail = new Map(); // email -> user

function makeChallengeId() {
  return `ch_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export const authHandlers = [
  //  LOGIN
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

  //  REGISTER: returns challengeId (no token) for signup flow
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
    pendingChallenges.set(challengeId, { type: "signup", user: newUser });

    return HttpResponse.json({ challengeId, email });
  }),

  //  FORGOT PASSWORD: returns challengeId for reset flow
  http.post(FORGOT_PASSWORD, async ({ request }) => {
    await delay(300);
    const body = await request.json();

    const email = String(body.email || "user@email.com").toLowerCase();
    const role = body.role === "seller" ? "seller" : "buyer";

    const existing = usersByEmail.get(email) || {
      id: `u_${Math.random().toString(16).slice(2)}`,
      firstName: "User",
      lastName: "",
      email,
      role,
      avatarUrl: "",
    };

    usersByEmail.set(email, existing);

    const challengeId = makeChallengeId();
    pendingChallenges.set(challengeId, { type: "forgot", user: existing });

    return HttpResponse.json({ challengeId, email });
  }),

  //  SET PASSWORD (works for both signup/forgot)
  http.post(SET_PASSWORD, async ({ request }) => {
    await delay(300);
    const body = await request.json();

    const email = String(body.email || "").toLowerCase();
    const challengeId = String(body.challengeId || "");
    const mode = String(body.mode || "");

    const record = challengeId ? pendingChallenges.get(challengeId) : null;
    const user = record?.user || (email ? usersByEmail.get(email) : null);

    if (!user) return HttpResponse.json({ message: "Invalid flow" }, { status: 400 });

    // keep record alive
    if (challengeId && record) pendingChallenges.set(challengeId, record);

    return HttpResponse.json({ ok: true, mode: mode || record?.type || "unknown" });
  }),

  //  VERIFY CODE
  http.post(VERIFY_CODE, async ({ request }) => {
    await delay(300);
    const body = await request.json();

    const email = String(body.email || "").toLowerCase();
    const role = body.role === "seller" ? "seller" : "buyer";
    const challengeId = String(body.challengeId || "");
    const mode = String(body.mode || "");

    const record = challengeId ? pendingChallenges.get(challengeId) : null;
    const user = record?.user || (email ? usersByEmail.get(email) : null);

    if (!user) return HttpResponse.json({ message: "Invalid verification flow" }, { status: 400 });

    // forgot flow: no token needed (go set-password)
    const effectiveType = mode || record?.type || "signup";
    if (effectiveType === "forgot") {
      return HttpResponse.json({ ok: true });
    }

    // signup flow: return token to auto-login
    const finalUser = { ...user, role };
    usersByEmail.set(finalUser.email, finalUser);

    if (challengeId) pendingChallenges.delete(challengeId);

    return HttpResponse.json({ token: makeToken(finalUser), user: finalUser });
  }),

  //  RESEND CODE
  http.post(RESEND_CODE, async () => {
    await delay(200);
    return HttpResponse.json({ ok: true });
  }),
];