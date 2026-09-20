import { getCurrentUser, isApproved } from "@/lib/currentUser";
import { listVisible, type ContentItem } from "@/lib/content";
import { cohorts, findCohort, type CohortInfo } from "@/lib/curriculum";
import { STATE_LABEL, type EnrollmentState } from "@/lib/enrollments";

// 강의실 하나 = 내가 듣는 기수 하나.
// 두 기수를 들으면 강의실이 두 개 나옵니다.
export type Room = {
  cohortId: string;
  cohort: CohortInfo;
  state: EnrollmentState;
  stateLabel: string;
  notices: ContentItem[];
  materials: ContentItem[];
  assignments: ContentItem[];
  /** 과제 제출을 묶는 키 */
  submitKey: string;
};

/**
 * 내가 듣는 강의실 전부. 수강 중인 것이 먼저, 그다음 수료·중도 종료 순입니다.
 * 운영자는 기수가 없으므로 전체 기수를 미리보기로 봅니다.
 */
export function getMyRooms(): Room[] {
  const user = getCurrentUser();
  // 승인 전에는 강의실을 만들지 않습니다. 서버 응답에도 내용이 담기지 않게.
  if (!isApproved(user) || !user) return [];

  const entries: Array<{ cohortId: string; state: EnrollmentState }> =
    user.role === "admin"
      ? cohorts.map((c) => ({ cohortId: c.id, state: "active" as EnrollmentState }))
      : user.enrollments.map((e) => ({ cohortId: e.cohortId, state: e.state }));

  // 전체 공개 콘텐츠는 어느 강의실에서나 보이도록 기수별로 각각 계산합니다.
  const rooms = entries.flatMap(({ cohortId, state }) => {
    const cohort = findCohort(cohortId);
    if (!cohort) return [];
    const viewer = { role: user.role, cohortIds: [cohortId] };
    return [{
      cohortId,
      cohort,
      state,
      stateLabel: STATE_LABEL[state],
      notices: listVisible("notice", viewer),
      materials: listVisible("material", viewer),
      assignments: listVisible("assignment", viewer),
      submitKey: cohortId,
    }];
  });

  const order: Record<EnrollmentState, number> = { active: 0, completed: 1, dropped: 2 };
  return rooms.sort(
    (a, b) => order[a.state] - order[b.state] || b.cohort.startDate.localeCompare(a.cohort.startDate)
  );
}
