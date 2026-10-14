import RoomFilter from "@/components/mycourses/RoomFilter";
import RoomItems from "@/components/RoomItems";
import ClosedRoom from "@/components/mycourses/ClosedRoom";
import SubscribedNotices from "@/components/mycourses/SubscribedNotices";
import { getMyRooms } from "@/lib/cohortRoom";
import { toSummary } from "@/lib/roomSummary";

export const dynamic = "force-dynamic";

export default function MyCoursesNoticesPage() {
  const rooms = getMyRooms().map((r) =>
    toSummary(r, r.closed ? <ClosedRoom chat={r.chat} /> : <RoomItems kind="notice" items={r.notices} />)
  );

  return (
    <>
      <div className="phead">
        <div><h1>공지보기</h1><p>수강 중인 강의별 공지사항을 한곳에서 확인하세요.</p></div>
      </div>

      <RoomFilter rooms={rooms} />
      <SubscribedNotices />
    </>
  );
}
