"use client";
import Link from "next/link";
import { useMyPrograms } from "@/lib/useMyPrograms";
import EmptyMyCourses from "@/components/EmptyMyCourses";

export default function MyCoursesNoticesPage() {
  const programs = useMyPrograms();

  return (
    <>
      <div className="phead">
        <div><h1>공지보기</h1><p>담아둔 수업들의 공지사항을 한곳에서 확인하세요.</p></div>
      </div>

      {programs && programs.length === 0 && <EmptyMyCourses />}

      {programs?.map((p) => (
        <div key={p.id} style={{ marginBottom: 26 }}>
          <div className="bh" style={{ marginTop: 0 }}><h3>{p.title}</h3><span className="pill v">{p.status}</span></div>
          <div className="card">
            {p.room.notices.length === 0 && (
              <p style={{ padding: 22, margin: 0, color: "var(--faint)", textAlign: "center" }}>등록된 공지가 없어요.</p>
            )}
            {p.room.notices.map((n, i) => (
              "id" in n ? (
                <Link href={`/my-courses/notices/${n.id}`} key={n.id} style={{ display: "block", padding: "14px 18px", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 13.5 }}>{n.title}</p>
                  <small style={{ color: "var(--faint)" }}>{n.date}</small>
                </Link>
              ) : (
                <div key={i} style={{ padding: "14px 18px", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 13.5 }}>{n.title}</p>
                  <small style={{ color: "var(--faint)" }}>{n.date}</small>
                </div>
              )
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
