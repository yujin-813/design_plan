import Link from "next/link";
import { seed } from "@/lib/seed";

type Program = (typeof seed.programs)[number];

export default function ProgramAlumni({ p }: { p: Program }) {
  const hasAlumni = p.alumni.jobs.length + p.alumni.nextSessions.length > 0;
  if (!hasAlumni) {
    return (
      <div className="card" style={{ padding: 22, color: "var(--faint)", textAlign: "center" }}>
        아직 채용·후속 세션 소식이 없어요. 구독해두면 새 소식이 올라올 때 홈에서 볼 수 있어요.
      </div>
    );
  }
  return (
    <div className="grid2">
      <div className="card" style={{ padding: 18 }}>
        <h3 style={{ fontSize: 14.5, fontWeight: 800, marginBottom: 10 }}>취업 · 채용 연결</h3>
        {p.alumni.jobs.length === 0 && <small style={{ color: "var(--faint)" }}>등록된 채용 소식이 없어요.</small>}
        {p.alumni.jobs.map((j, i) => (
          <div key={i} style={{ padding: "8px 0", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{j.title}</p>
            <small style={{ color: "var(--faint)" }}>{j.date}</small>
          </div>
        ))}
        <Link className="more" href="/community?cat=구인구직" style={{ display: "inline-block", marginTop: 10 }}>자유수다 #구인구직 전체 보기 ›</Link>
      </div>
      <div className="card" style={{ padding: 18 }}>
        <h3 style={{ fontSize: 14.5, fontWeight: 800, marginBottom: 10 }}>향후 열리는 세션</h3>
        {p.alumni.nextSessions.length === 0 && <small style={{ color: "var(--faint)" }}>예정된 세션이 없어요.</small>}
        {p.alumni.nextSessions.map((s, i) => (
          <div key={i} style={{ padding: "8px 0", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{s.title}</p>
            <small style={{ color: "var(--faint)" }}>{s.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
