import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth gate (Next 16's renamed `middleware`). The login screen is the front
 * door: any request without an `orbit_session` cookie is sent to `/login`, and
 * the workspace only opens once that cookie is set. It's a session cookie (no
 * expiry), so a fresh browser session always lands on login first.
 *
 * Demo only — this is presence-of-cookie gating, not real authentication.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = request.cookies.get("orbit_session")?.value === "1";

  // The gate itself is always reachable.
  if (pathname === "/login") return NextResponse.next();

  if (!authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals, the icon, and static assets.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
