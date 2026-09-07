import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

// DOCS_ONLY=1 로 배포하면 /docs(기획서)와 그 API·정적 자산만 열리고
// 나머지 커뮤니티 라우트(홈, 자유수다, 이벤트 등)는 전부 /docs로 리다이렉트됩니다.
// 커뮤니티 앱을 별도로 배포할 땐 이 환경변수를 빼거나 0으로 두면 원래대로 전체가 열립니다.
const DOCS_ONLY_ALLOWED = ["/docs", "/api/doc-comments", "/docs-assets", "/_next", "/favicon.ico"];

// 로그인하지 않은 방문자는 기획서·로그인 화면만 볼 수 있고,
// test@test.com / test123 으로 로그인해야 나머지 대시보드 메뉴가 열립니다.
// (회원가입 페이지는 아예 없습니다.)
const AUTH_ALLOWED = ["/docs", "/login", "/api/doc-comments", "/api/auth", "/docs-assets", "/_next", "/favicon.ico"];

function isAllowed(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function redirectToDocs(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/docs/arki-spec";
  return NextResponse.redirect(url);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (process.env.DOCS_ONLY === "1") {
    if (isAllowed(pathname, DOCS_ONLY_ALLOWED)) return NextResponse.next();
    return redirectToDocs(req);
  }

  const signedIn = req.cookies.get(SESSION_COOKIE)?.value === "1";
  if (!signedIn && !isAllowed(pathname, AUTH_ALLOWED)) {
    return redirectToDocs(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
