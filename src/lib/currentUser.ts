import { cookies } from "next/headers";
import { ADMIN_EMAIL, ADMIN_NAME, SESSION_COOKIE, readSessionValue } from "@/lib/auth";
import { findByEmail } from "@/lib/members";
import { listFor, type EnrolledCohort } from "@/lib/enrollments";

export type CurrentUser = {
  name: string;
  email: string;
  role: "member" | "admin";
  status: "pending" | "approved" | "rejected";
  /** 듣는 기수 전부 (수강 중 + 수료) */
  enrollments: EnrolledCohort[];
  /** 듣는 기수 id 목록 — 콘텐츠 공개 범위 판단에 씁니다 */
  cohortIds: string[];
  /** 지금 수강 중인 기수 — 수업 공간(공지·자료·과제)은 이 기수만 열립니다 */
  activeCohortIds: string[];
  /** 동기 대화방에 들어갈 수 있는 기수 — 수강 중 + 수료 (중도 종료 제외) */
  chatCohortIds: string[];
  /** 대표 기수 — 지금 수강 중인 것 우선. 사이드바 표기·기본 화면용 */
  cohortId: string | null;
  cohortLabel: string;
  signedIn: true;
};

// 여러 기수를 들으면 "AI 마케팅 3기 외 1개" 처럼 보여줍니다.
function summarize(enrollments: EnrolledCohort[]): { primary: string | null; label: string } {
  if (enrollments.length === 0) return { primary: null, label: "미배정" };
  const active = enrollments.find((e) => e.state === "active") ?? enrollments[0];
  const rest = enrollments.length - 1;
  return {
    primary: active.cohortId,
    label: rest > 0 ? `${active.cohort.label} 외 ${rest}개` : active.cohort.label,
  };
}

/** 과정 콘텐츠를 볼 자격이 있는가 (운영자이거나 승인된 수강생) */
export function isApproved(user: CurrentUser | null): boolean {
  if (!user) return false;
  return user.role === "admin" || user.status === "approved";
}

/**
 * 콘텐츠 공개 범위를 판단할 때 쓰는 값.
 * 승인 전이면 기수를 비워서, 화면뿐 아니라 서버 응답에서도 기수 콘텐츠가 빠집니다.
 * (레이아웃에서 화면만 가리면 RSC 페이로드에 내용이 그대로 실려 나갑니다.)
 */
export function viewerOf(user: CurrentUser | null): { role: string; cohortIds: string[]; activeCohortIds: string[] } {
  if (!user) return { role: "guest", cohortIds: [], activeCohortIds: [] };
  const ok = isApproved(user);
  return {
    role: user.role,
    cohortIds: ok ? user.cohortIds : [],
    activeCohortIds: ok ? user.activeCohortIds : [],
  };
}

/** 이 기수의 동기 대화방에 들어갈 수 있는가 */
export function canJoinCohortChat(user: CurrentUser | null, cohortId: string): boolean {
  if (!user || !isApproved(user)) return false;
  return user.role === "admin" || user.chatCohortIds.includes(cohortId);
}

// 로그인한 사람의 정보. 승인 여부와 수강 기수까지 함께 돌려줍니다.
export function getCurrentUser(): CurrentUser | null {
  const session = readSessionValue(cookies().get(SESSION_COOKIE)?.value);
  if (!session) return null;

  if (session.role === "admin" && session.email === ADMIN_EMAIL) {
    return {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      role: "admin",
      status: "approved",
      enrollments: [],
      cohortIds: [],
      activeCohortIds: [],
      chatCohortIds: [],
      cohortId: null,
      cohortLabel: "운영자",
      signedIn: true,
    };
  }

  const member = findByEmail(session.email);
  if (!member) return null;

  const enrollments = listFor(member.email);
  const { primary, label } = summarize(enrollments);

  return {
    name: member.name,
    email: member.email,
    role: member.role,
    status: member.status,
    enrollments,
    cohortIds: enrollments.map((e) => e.cohortId),
    activeCohortIds: enrollments.filter((e) => e.state === "active").map((e) => e.cohortId),
    chatCohortIds: enrollments.filter((e) => e.state !== "dropped").map((e) => e.cohortId),
    cohortId: primary,
    cohortLabel: label,
    signedIn: true,
  };
}
