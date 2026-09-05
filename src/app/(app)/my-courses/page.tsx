"use client";
import Link from "next/link";
import { useMyPrograms } from "@/lib/useMyPrograms";
import EmptyMyCourses from "@/components/EmptyMyCourses";
import MyCoursesCalendar from "@/components/MyCoursesCalendar";

export default function MyCoursesPage() {
  const programs = useMyPrograms();

  if (programs && programs.length === 0) {
    return (
      <>
        <div className="phead"><div><h1>내 수업</h1><p>담아둔 수업들의 현황을 한눈에 확인하세요.</p></div></div>
        <EmptyMyCourses />
      </>
    );
  }

  const notices = programs?.flatMap((p) => p.room.notices.map((n) => ({ ...n, course: p.title }))) ?? [];
  const materials = programs?.flatMap((p) => p.room.materials.map((m) => ({ ...m, course: p.title }))) ?? [];
  const dueItems = programs?.flatMap((p) => p.room.assignments.filter((a) => a.due.startsWith("마감")).map((a) => ({ ...a, course: p.title }))) ?? [];

  return (
    <>
      <div className="phead">
        <div><h1>내 수업</h1><p>담아둔 수업 {programs?.length ?? 0}개의 현황판이에요.</p></div>
      </div>

      <div className="kpis" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <div className="kpi card"><b>{programs?.length ?? 0}</b><small>담아둔 수업</small></div>
        <div className="kpi card"><b>{notices.length}</b><small>공지</small></div>
        <div className="kpi card"><b>{materials.length}</b><small>공유된 자료</small></div>
        <div className="kpi card"><b>{dueItems.length}</b><small>마감 임박 과제</small></div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
        {programs?.map((p) => (
          <Link key={p.id} href={`/programs/${p.id}`} className="pill v">{p.title} · {p.status}</Link>
        ))}
      </div>

      {/* 중요도 상위: 마감 임박 과제 + 일정 */}
      <div className="grid2" style={{ marginBottom: 16, alignItems: "start" }}>
        <div
          className="card"
          style={{
            padding: 18,
            borderColor: dueItems.length > 0 ? "var(--warm)" : undefined,
            background: dueItems.length > 0 ? "var(--warm-soft)" : undefined,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <b style={{ fontSize: 14.5 }}>⚠️ 마감 임박 과제</b>
            <Link className="more" href="/my-courses/assignments">전체 ›</Link>
          </div>
          {dueItems.length === 0 && <small style={{ color: "var(--faint)" }}>마감 임박한 과제가 없어요.</small>}
          {dueItems.slice(0, 3).map((a, i) => (
            <Link
              href="/my-courses/assignments"
              key={i}
              className="dash-row"
              style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "8px 0", borderTop: i > 0 ? "1px solid rgba(0,0,0,.06)" : undefined }}
            >
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{a.title}</p>
                <small style={{ color: "var(--faint)" }}>{a.course}</small>
              </div>
              <span className="pill warm" style={{ flex: "none", height: "fit-content" }}>{a.due}</span>
            </Link>
          ))}
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <b style={{ fontSize: 14.5 }}>일정확인</b>
            <Link className="more" href="/my-courses/schedule">전체 ›</Link>
          </div>
          {programs && <MyCoursesCalendar programs={programs} />}
        </div>
      </div>

      {/* 참고용 정보: 공지 + 자료 */}
      <div className="grid2">
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <b style={{ fontSize: 14.5 }}>공지사항</b>
            <Link className="more" href="/my-courses/notices">전체 ›</Link>
          </div>
          {notices.length === 0 && <small style={{ color: "var(--faint)" }}>등록된 공지가 없어요.</small>}
          {notices.slice(0, 3).map((n, i) => (
            "id" in n ? (
              <Link href={`/my-courses/notices/${n.id}`} key={n.id} className="dash-row" style={{ display: "block", padding: "8px 0", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
                <p style={{ margin: 0, fontSize: 13 }}>{n.title}</p>
                <small style={{ color: "var(--faint)" }}>{n.course} · {n.date}</small>
              </Link>
            ) : (
              <div key={i} style={{ padding: "8px 0", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
                <p style={{ margin: 0, fontSize: 13 }}>{n.title}</p>
                <small style={{ color: "var(--faint)" }}>{n.course} · {n.date}</small>
              </div>
            )
          ))}
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <b style={{ fontSize: 14.5 }}>자료실</b>
            <Link className="more" href="/my-courses/materials">전체 ›</Link>
          </div>
          {materials.length === 0 && <small style={{ color: "var(--faint)" }}>공유된 자료가 없어요.</small>}
          {materials.slice(0, 2).map((m, i) => (
            <div key={i} style={{ padding: "8px 0", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
              <p style={{ margin: 0, fontSize: 13 }}>📎 {m.title}</p>
              <small style={{ color: "var(--faint)" }}>{m.course} · {m.date}</small>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
