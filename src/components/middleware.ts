import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_COOKIE = "accessToken";
const LOGIN_PATH = "/login";
const DASH_PATH = "/dashboard";

/**
 * Règles:
 * - Si route protégée (dashboard, etc.) et pas de token => redirect /login
 * - Si route auth (/login) et token présent => redirect /dashboard
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const isAuthed = Boolean(token);

  const isAuthRoute =
    pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`);
  const isProtectedRoute =
    pathname === DASH_PATH || pathname.startsWith(`${DASH_PATH}/`);

  // 1) Pas connecté => interdit sur routes protégées
  if (isProtectedRoute && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    // option: pour revenir après login
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 2) Connecté => interdit sur login
  if (isAuthRoute && isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = DASH_PATH;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * Matcher: évite de matcher _next, assets, api, etc.
 * Ajuste selon tes routes.
 */
export const config = {
  matcher: [
    "/((?!api|_next|_vercel|public|.*\\..*).*)",
    "/dashboard/:path*",
    "/login",
    "/login/:path*",
  ],
};
