import RoomFilter from "@/components/mycourses/RoomFilter";
import RoomItems from "@/components/RoomItems";
import ClosedRoom from "@/components/mycourses/ClosedRoom";
import SubscribedMaterials from "@/components/mycourses/SubscribedMaterials";
import { getMyRooms } from "@/lib/cohortRoom";
import { toSummary } from "@/lib/roomSummary";

export const dynamic = "force-dynamic";

export default function MyCoursesMaterialsPage() {
  const rooms = getMyRooms().map((r) =>
    toSummary(r, r.closed ? <ClosedRoom chat={r.chat} /> : <RoomItems kind="material" items={r.materials} />)
  );

  return (
    <>
      <div className="phead">
        <div><h1>자료실</h1><p>수강 중인 강의별 자료를 한곳에서 확인하세요.</p></div>
      </div>

      <RoomFilter rooms={rooms} />
      <SubscribedMaterials />
    </>
  );
}
