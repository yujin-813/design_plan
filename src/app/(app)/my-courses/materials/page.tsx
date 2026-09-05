"use client";
import { useMyPrograms } from "@/lib/useMyPrograms";
import EmptyMyCourses from "@/components/EmptyMyCourses";

export default function MyCoursesMaterialsPage() {
  const programs = useMyPrograms();

  return (
    <>
      <div className="phead">
        <div><h1>자료실</h1><p>담아둔 수업들의 강의 자료를 한곳에서 확인하세요.</p></div>
      </div>

      {programs && programs.length === 0 && <EmptyMyCourses />}

      {programs?.map((p) => (
        <div key={p.id} style={{ marginBottom: 26 }}>
          <div className="bh" style={{ marginTop: 0 }}><h3>{p.title}</h3><span className="pill v">{p.status}</span></div>
          <div className="card">
            {p.room.materials.length === 0 && (
              <p style={{ padding: 22, margin: 0, color: "var(--faint)", textAlign: "center" }}>공유된 자료가 없어요.</p>
            )}
            {p.room.materials.map((m, i) => (
              <div key={i} style={{ padding: "14px 18px", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13.5 }}>📎 {m.title}</p>
                <small style={{ color: "var(--faint)" }}>{m.date}</small>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
