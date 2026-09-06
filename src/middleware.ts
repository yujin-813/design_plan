import { NextRequest, NextResponse } from "next/server";

// DOCS_ONLY=1 로 배포하면 /docs(기획서)와 그 API·정적 자산만 열리고
// 나머지 커뮤니티 라우트(홈, 자유수다, 이벤트 등)는 전부 /docs로 리다이렉트됩니다.
// 커뮤니티 앱을 별도로 배포할 땐 이 환경변수를 빼거나 0으로 두면 원래대로 전체가 열립니다.
const ALLOWED_PREFIXES = [
  "/docs",
  "/api/doc-comments",
  "/docs-assets",
  "/_next",
  "/favicon.ico",
];

export function middleware(req: NextRequest) {
  if (process.env.DOCS_ONLY !== "1") return NextResponse.next();

  const { pathname } = req.nextUrl;
  const isAllowed = ALLOWED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p));
  if (isAllowed) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/docs/arki-spec";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
