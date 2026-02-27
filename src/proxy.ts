import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_COOKIE = "accessToken";
const LOGIN_PATH = "/login";
const DASH_PATH = "/dashboard";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const isAuthed = Boolean(token);

  const isAuthRoute = pathname === LOGIN_PATH;
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/users") ||
    pathname.startsWith("/finances") ||
    pathname.startsWith("/commissions") ||
    pathname.startsWith("/configuration") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings");

  // Redirect to login if not authenticated and trying to access protected route
  if (isProtectedRoute && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if authenticated and trying to access login
  if (isAuthRoute && isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = DASH_PATH;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|public|.*\\..*).*)"],
};
