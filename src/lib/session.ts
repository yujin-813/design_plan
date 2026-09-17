// 미들웨어(엣지 런타임)와 클라이언트 컴포넌트에서도 쓰는 값들.
// Node 전용 모듈(crypto 등)을 절대 여기서 import 하지 마세요.

// 로그인 게이트. 켜두면 로그인해야 커뮤니티가 보입니다.
export const REQUIRE_LOGIN = true;

export const SESSION_COOKIE = "arki_session";

export type SessionRole = "member" | "admin";
export type Session = { email: string; role: SessionRole };

// 서명 검증 없이 쿠키 모양만 읽습니다. 라우팅 판단용이고,
// 실제 권한 확인은 서버(getCurrentUser)에서 서명까지 검증합니다.
export function parseSessionUnverified(raw: string | undefined): Session | null {
  if (!raw) return null;
  const parts = raw.split("|");
  if (parts.length !== 3) return null;
  const [email, role] = parts;
  if (role !== "member" && role !== "admin") return null;
  if (!email) return null;
  return { email, role };
}
