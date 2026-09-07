// 데모 로그인 정보 (회원가입 없이 이 계정 하나만 사용)
export const SESSION_COOKIE = "arki_session";
const VALID_EMAIL = "test@test.com";
const VALID_PASSWORD = "test123";

export function checkCredentials(email: string, password: string) {
  return email.trim().toLowerCase() === VALID_EMAIL && password === VALID_PASSWORD;
}
