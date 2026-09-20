import RoomFilter from "@/components/mycourses/RoomFilter";
import RoomItems from "@/components/RoomItems";
import SubscribedAssignments from "@/components/mycourses/SubscribedAssignments";
import { getMyRooms } from "@/lib/cohortRoom";
import { toSummary } from "@/lib/roomSummary";

export const dynamic = "force-dynamic";

export default function MyCoursesAssignmentsPage() {
  const rooms = getMyRooms().map((r) =>
    toSummary(r, <RoomItems kind="assignment" items={r.assignments} submitKey={r.submitKey} />)
  );

  return (
    <>
      <div className="phead">
        <div><h1>과제확인</h1><p>수강 중인 강의별로 과제를 확인하고 파일을 제출하세요.</p></div>
      </div>

      <RoomFilter rooms={rooms} />
      <SubscribedAssignments />
    </>
  );
}
