import type { Room } from "@/lib/cohortRoom";
import type { RoomSummary } from "@/components/mycourses/RoomFilter";

// 강의실 하나를 필터 화면이 쓰는 형태로 바꿔줍니다.
export function toSummary(room: Room, content: React.ReactNode): RoomSummary {
  return {
    cohortId: room.cohortId,
    content,
    course: room.cohort.course,
    cohortLabel: room.cohort.cohort,
    label: room.cohort.label,
    period: room.cohort.period,
    org: room.cohort.org,
    state: room.state,
    stateLabel: room.stateLabel,
    counts: {
      notices: room.notices.length,
      materials: room.materials.length,
      assignments: room.assignments.length,
    },
  };
}
