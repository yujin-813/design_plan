// 로그인하지 않아도 읽을 수 있는 커뮤니티 화면.
// 글쓰기·댓글·구독은 각 API에서 따로 로그인을 확인합니다.
// (미들웨어에서도 쓰므로 fs 같은 Node 전용 모듈을 가져오지 마세요.)
export const PUBLIC_PAGES = ["/", "/notices", "/events", "/community", "/news"];

export function isPublicPage(pathname: string) {
  return PUBLIC_PAGES.some((p) => pathname === p || (p !== "/" && pathname.startsWith(p + "/")));
}
