import Link from "next/link";
import { seed } from "@/lib/seed";
import AssignmentUpload from "@/components/AssignmentUpload";

type Program = (typeof seed.programs)[number];

export default function ProgramRoom({ p }: { p: Program }) {
  const hasRoom = p.room.notices.length + p.room.materials.length + p.room.assignments.length > 0;
  if (!hasRoom) {
    return (
      <div className="card" style={{ padding: 22, color: "var(--faint)", textAlign: "center" }}>
        {p.status === "오픈 예정" || p.status === "모집 중" ? "개강 후 공지·자료·과제 공간이 열려요." : "이 과정의 활동 기록이 아직 없어요."}
      </div>
    );
  }
  return (
    <div className="grid3">
      <div className="card" style={{ padding: 18 }}>
        <h3 style={{ fontSize: 14.5, fontWeight: 800, marginBottom: 10 }}>공지사항</h3>
        {p.room.notices.length === 0 && <small style={{ color: "var(--faint)" }}>등록된 공지가 없어요.</small>}
        {p.room.notices.map((n, i) =>
          "id" in n ? (
            <Link href={`/my-courses/notices/${n.id}`} key={n.id} className="dash-row" style={{ display: "block", padding: "8px 0", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{n.title}</p>
              <small style={{ color: "var(--faint)" }}>{n.date}</small>
            </Link>
          ) : (
            <div key={i} style={{ padding: "8px 0", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{n.title}</p>
              <small style={{ color: "var(--faint)" }}>{n.date}</small>
            </div>
          )
        )}
      </div>
      <div className="card" style={{ padding: 18 }}>
        <h3 style={{ fontSize: 14.5, fontWeight: 800, marginBottom: 10 }}>자료공유</h3>
        {p.room.materials.length === 0 && <small style={{ color: "var(--faint)" }}>공유된 자료가 없어요.</small>}
        {p.room.materials.map((m, i) => (
          <div key={i} style={{ padding: "8px 0", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>📎 {m.title}</p>
            <small style={{ color: "var(--faint)" }}>{m.date}</small>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 18 }}>
        <h3 style={{ fontSize: 14.5, fontWeight: 800, marginBottom: 10 }}>과제 제출</h3>
        {p.room.assignments.length === 0 && <small style={{ color: "var(--faint)" }}>등록된 과제가 없어요.</small>}
        {p.room.assignments.map((a, i) => (
          <div key={i} style={{ padding: "10px 0", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{a.title}</p>
            <small style={{ color: "var(--faint)" }}>{a.due}</small>
            <AssignmentUpload programId={p.id} assignment={a.title} submittedBy={seed.me.name} />
          </div>
        ))}
      </div>
    </div>
  );
}
