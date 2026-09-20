"use client";
import { useMyPrograms } from "@/lib/useMyPrograms";
import AssignmentUpload from "@/components/AssignmentUpload";

// 강의목록에서 직접 담아둔 '관심 수업'의 과제입니다. (내 기수 과제와 별개)
export default function SubscribedAssignments() {
  const programs = useMyPrograms();
  if (!programs || programs.length === 0) return null;

  return (
    <>
      <div className="bh"><h3>담아둔 관심 수업</h3></div>
      {programs.map((p) => (
        <div key={p.id} style={{ marginBottom: 26 }}>
          <div className="bh" style={{ marginTop: 0 }}><h3>{p.title}</h3><span className="pill v">{p.status}</span></div>
          <div className="card">
            {p.room.assignments.length === 0 && (
              <p style={{ padding: 22, margin: 0, color: "var(--faint)", textAlign: "center" }}>등록된 과제가 없어요.</p>
            )}
            {p.room.assignments.map((a, i) => (
              <div key={i} style={{ padding: "14px 18px", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13.5 }}>{a.title}</p>
                <small style={{ color: "var(--faint)" }}>{a.due}</small>
                <AssignmentUpload programId={p.id} assignment={a.title} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
