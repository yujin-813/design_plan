// 로그인 게이트를 잠깐 꺼둡니다. true로 바꾸면 다시 로그인해야
// 전체 메뉴가 보이는 구조로 돌아갑니다.
export const REQUIRE_LOGIN = false;

// 데모 로그인 정보 (회원가입 없이 이 계정 하나만 사용)
export const SESSION_COOKIE = "arki_session";
const VALID_EMAIL = "test@test.com";
const VALID_PASSWORD = "test123";

export function checkCredentials(email: string, password: string) {
  return email.trim().toLowerCase() === VALID_EMAIL && password === VALID_PASSWORD;
}
