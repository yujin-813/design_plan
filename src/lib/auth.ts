import crypto from "crypto";
import { SESSION_COOKIE, parseSessionUnverified, type Session } from "@/lib/session";

// 이 파일은 Node 런타임(서버 컴포넌트·route handler) 전용입니다.
// 미들웨어/클라이언트에서는 @/lib/session 을 쓰세요.
export { SESSION_COOKIE, REQUIRE_LOGIN } from "@/lib/session";
export type { Session } from "@/lib/session";

// 운영자 계정 (환경변수로 덮어쓸 수 있습니다)
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@altera.kr").toLowerCase();
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "altera2026!";
export const ADMIN_NAME = "운영팀";

const SECRET = process.env.SESSION_SECRET || "altera-dev-secret";

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex").slice(0, 32);
}

export function createSessionValue(session: Session) {
  const body = `${session.email}|${session.role}`;
  return `${body}|${sign(body)}`;
}

export function readSessionValue(raw: string | undefined): Session | null {
  const parsed = parseSessionUnverified(raw);
  if (!parsed) return null;
  const mac = raw!.split("|")[2];
  if (sign(`${parsed.email}|${parsed.role}`) !== mac) return null;
  return parsed;
}

export function isAdminCredentials(email: string, password: string) {
  return email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export { SESSION_COOKIE as COOKIE_NAME };
