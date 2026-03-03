import { http, HttpResponse, delay } from "msw";
import { AUTH_FIXTURE } from "../../db/fixtures/auth";

// supports BOTH relative and full URLs
const LOGIN = /\/api\/auth\/login$/;
const REGISTER = /\/api\/auth\/register$/;

function makeToken(user) {
  return btoa(JSON.stringify({ sub: user.id, email: user.email, role: user.role, iat: Date.now() }));
}

export const authHandlers = [
  http.post(LOGIN, async ({ request }) => {
    await delay(400);
    const body = await request.json();

    const user = AUTH_FIXTURE.users.find((u) => u.email === body.email);
    if (!user) return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 });
    if (body.password !== AUTH_FIXTURE.password)
      return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 });

    const role = body.role === "seller" ? "seller" : "buyer";
    const finalUser = { ...user, role };

    return HttpResponse.json({ token: makeToken(finalUser), user: finalUser });
  }),

  http.post(REGISTER, async ({ request }) => {
    await delay(450);
    const body = await request.json();

    const newUser = {
      id: `u_${Math.random().toString(16).slice(2)}`,
      firstName: body.firstName || "User",
      lastName: body.lastName || "",
      email: body.email || "user@email.com",
      role: body.role === "seller" ? "seller" : "buyer",
      avatarUrl: "",
    };

    return HttpResponse.json({ token: makeToken(newUser), user: newUser });
  }),
];