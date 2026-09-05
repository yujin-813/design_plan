import Link from "next/link";
import { notFound } from "next/navigation";
import { seed } from "@/lib/seed";
import SubscribeButton from "@/components/SubscribeButton";
import ProgramRoom from "@/components/ProgramRoom";
import ProgramAlumni from "@/components/ProgramAlumni";

const statusPill: Record<string, string> = { "모집 중": "mint", "진행 중": "v", "수료": "ghost", "오픈 예정": "sky" };

export default function ProgramDetailPage({ params }: { params: { id: string } }) {
  const p = seed.programs.find((x) => x.id === params.id);
  if (!p) notFound();

  return (
    <>
      <div className="phead">
        <div>
          <Link className="more" href="/programs">‹ 강의목록</Link>
          <h1 style={{ marginTop: 8 }}>{p.title}</h1>
          <p>{p.summary}</p>
        </div>
        <SubscribeButton kind="programs" id={p.id} label="+ 내 수업에 담기" />
      </div>

      <div className="card" style={{ padding: 22, marginBottom: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span className={"pill " + (statusPill[p.status] ?? "ghost")}>{p.status}</span>
          <div style={{ display: "flex", gap: 20, fontSize: 13, color: "var(--muted)", flexWrap: "wrap" }}>
            <span><b style={{ color: "var(--ink)" }}>형식</b> · {p.format}</span>
            <span><b style={{ color: "var(--ink)" }}>일정</b> · {p.schedule}</span>
            <span><b style={{ color: "var(--ink)" }}>참가비</b> · {p.price}</span>
            {p.students > 0 && <span><b style={{ color: "var(--ink)" }}>수강생</b> · {p.students}명</span>}
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", marginTop: 16, paddingTop: 14 }}>
          {p.curriculum.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, padding: "5px 0", color: "var(--muted)" }}>
              <span style={{ color: "var(--violet-2)" }}>•</span>{c}
            </div>
          ))}
        </div>
      </div>

      <div className="bh" style={{ marginTop: 0 }}><h3>수강 중 활동 공간</h3><Link className="more" href="/my-courses">내 수업에서 관리 ›</Link></div>
      <div style={{ marginBottom: 26 }}><ProgramRoom p={p} /></div>

      <div className="bh"><h3>수료 후에도 계속 보이는 정보</h3></div>
      <ProgramAlumni p={p} />
    </>
  );
}
