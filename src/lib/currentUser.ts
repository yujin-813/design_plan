import { cookies } from "next/headers";
import { ADMIN_EMAIL, ADMIN_NAME, SESSION_COOKIE, readSessionValue } from "@/lib/auth";
import { findByEmail } from "@/lib/members";
import { findCohort } from "@/lib/curriculum";

export type CurrentUser = {
  name: string;
  email: string;
  role: "member" | "admin";
  status: "pending" | "approved" | "rejected";
  cohortId: string | null;
  cohortLabel: string;
  signedIn: true;
};

// 로그인한 사람의 정보. 승인 여부까지 함께 돌려줍니다.
export function getCurrentUser(): CurrentUser | null {
  const session = readSessionValue(cookies().get(SESSION_COOKIE)?.value);
  if (!session) return null;

  if (session.role === "admin" && session.email === ADMIN_EMAIL) {
    return {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      role: "admin",
      status: "approved",
      cohortId: null,
      cohortLabel: "운영자",
      signedIn: true,
    };
  }

  const member = findByEmail(session.email);
  if (!member) return null;

  return {
    name: member.name,
    email: member.email,
    role: member.role,
    status: member.status,
    cohortId: member.cohortId,
    cohortLabel: findCohort(member.cohortId)?.label ?? "미배정",
    signedIn: true,
  };
}
