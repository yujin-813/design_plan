import { NextRequest, NextResponse } from "next/server";
import { REQUIRE_LOGIN, SESSION_COOKIE } from "@/lib/auth";

// 로그인하지 않은 방문자는 기획서·로그인 화면만 볼 수 있고,
// test@test.com / test123 으로 로그인해야 나머지 대시보드 메뉴가 열립니다.
// (회원가입 페이지는 아예 없습니다.)
const GUEST_ALLOWED = ["/docs", "/login", "/api/doc-comments", "/api/auth", "/docs-assets", "/_next", "/favicon.ico"];

function isAllowed(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function redirectToDocs(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/docs/arki-spec";
  return NextResponse.redirect(url);
}

export function middleware(req: NextRequest) {
  if (!REQUIRE_LOGIN) return NextResponse.next();

  const { pathname } = req.nextUrl;
  const signedIn = req.cookies.get(SESSION_COOKIE)?.value === "1";

  if (signedIn) return NextResponse.next();

  if (!isAllowed(pathname, GUEST_ALLOWED)) return redirectToDocs(req);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
