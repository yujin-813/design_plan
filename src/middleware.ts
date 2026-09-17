import { NextRequest, NextResponse } from "next/server";
import { REQUIRE_LOGIN, SESSION_COOKIE, parseSessionUnverified } from "@/lib/session";

// 로그인하지 않은 방문자가 볼 수 있는 곳: 로그인·가입 화면과 기획서뿐입니다.
const GUEST_ALLOWED = ["/login", "/signup", "/docs", "/api/auth", "/api/doc-comments", "/docs-assets", "/_next", "/favicon.ico"];

function isAllowed(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function middleware(req: NextRequest) {
  if (!REQUIRE_LOGIN) return NextResponse.next();

  const { pathname } = req.nextUrl;
  const session = parseSessionUnverified(req.cookies.get(SESSION_COOKIE)?.value);

  if (!session) {
    if (isAllowed(pathname, GUEST_ALLOWED)) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 운영자 전용 구역
  if (pathname.startsWith("/admin") && session.role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
