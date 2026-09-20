import { NextRequest, NextResponse } from "next/server";
import { REQUIRE_LOGIN, SESSION_COOKIE, parseSessionUnverified } from "@/lib/session";

// 로그인하지 않은 방문자가 볼 수 있는 곳: 로그인·가입 화면과 기획서뿐입니다.
const GUEST_ALLOWED = ["/login", "/signup", "/docs", "/api/auth", "/api/doc-comments", "/docs-assets", "/_next", "/favicon.ico", "/icon.svg"];

function isAllowed(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function middleware(req: NextRequest) {
  if (!REQUIRE_LOGIN) return NextResponse.next();

  const { pathname } = req.nextUrl;
  const session = parseSessionUnverified(req.cookies.get(SESSION_COOKIE)?.value);

  if (!session) {
    if (isAllowed(pathname, GUEST_ALLOWED)) return NextResponse.next();
    // API는 화면으로 돌려보내지 않고 401을 돌려줍니다.
    // (fetch 응답으로 로그인 HTML이 오면 화면이 깨집니다.)
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
    }
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
