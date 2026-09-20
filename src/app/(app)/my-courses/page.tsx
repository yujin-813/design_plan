import RoomFilter from "@/components/mycourses/RoomFilter";
import RoomOverview from "@/components/mycourses/RoomOverview";
import SubscribedDashboard from "@/components/mycourses/SubscribedDashboard";
import { getMyRooms } from "@/lib/cohortRoom";
import { toSummary } from "@/lib/roomSummary";

export const dynamic = "force-dynamic";

export default function MyCoursesPage() {
  const rooms = getMyRooms().map((r) => toSummary(r, <RoomOverview room={r} />));

  return (
    <>
      <div className="phead">
        <div>
          <h1>내 수업</h1>
          <p>수강 중인 강의와 수료한 강의를 강의·기수별로 확인하세요.</p>
        </div>
      </div>

      <RoomFilter rooms={rooms} />
      <SubscribedDashboard />
    </>
  );
}
