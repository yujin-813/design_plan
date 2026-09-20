import Link from "next/link";
import { shortDate } from "@/lib/content";
import type { Room } from "@/lib/cohortRoom";

// 강의실 하나의 요약 — 공지 몇 건, 과제 몇 건인지 한눈에.
export default function RoomOverview({ room }: { room: Room }) {
  return (
    <div className="grid2" style={{ alignItems: "start" }}>
      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <b style={{ fontSize: 14.5 }}>공지</b>
          <Link className="more" href="/my-courses/notices">전체 ›</Link>
        </div>
        {room.notices.length === 0 && <small style={{ color: "var(--faint)" }}>아직 올라온 공지가 없어요.</small>}
        {room.notices.slice(0, 3).map((n, i) => (
          <Link
            key={n.id}
            href={`/my-courses/notices/${n.id}`}
            className="dash-row"
            style={{ display: "block", padding: "8px 0", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}
          >
            <p style={{ margin: 0, fontSize: 13 }}>{n.title}</p>
            <small style={{ color: "var(--faint)" }}>{n.createdBy} · {shortDate(n.createdAt)}</small>
          </Link>
        ))}
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <b style={{ fontSize: 14.5 }}>과제</b>
          <Link className="more" href="/my-courses/assignments">전체 ›</Link>
        </div>
        {room.assignments.length === 0 && <small style={{ color: "var(--faint)" }}>아직 등록된 과제가 없어요.</small>}
        {room.assignments.slice(0, 3).map((a, i) => (
          <div key={a.id} style={{ padding: "8px 0", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{a.title}</p>
            <small style={{ color: "var(--faint)" }}>{a.dueLabel || shortDate(a.createdAt)}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
