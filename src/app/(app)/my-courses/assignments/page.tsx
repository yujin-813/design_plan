"use client";
import { useMyPrograms } from "@/lib/useMyPrograms";
import EmptyMyCourses from "@/components/EmptyMyCourses";
import AssignmentUpload from "@/components/AssignmentUpload";
import { seed } from "@/lib/seed";

export default function MyCoursesAssignmentsPage() {
  const programs = useMyPrograms();

  return (
    <>
      <div className="phead">
        <div><h1>과제확인</h1><p>담아둔 수업들의 과제를 확인하고 파일을 제출하세요.</p></div>
      </div>

      {programs && programs.length === 0 && <EmptyMyCourses />}

      {programs?.map((p) => (
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
                <AssignmentUpload programId={p.id} assignment={a.title} submittedBy={seed.me.name} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
