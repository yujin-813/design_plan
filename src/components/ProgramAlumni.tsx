import Link from "next/link";
import { seed } from "@/lib/seed";
import type { ContentItem } from "@/lib/content";

type Program = (typeof seed.programs)[number];

export default function ProgramAlumni({ p, projects }: { p: Program; projects: ContentItem[] }) {
  return (
    <div className="grid2">
      <div className="card" style={{ padding: 18 }}>
        <h3 style={{ fontSize: 14.5, fontWeight: 800, marginBottom: 10 }}>모집 중인 프로젝트</h3>
        {projects.length === 0 && <small style={{ color: "var(--faint)" }}>지금은 모집 중인 프로젝트가 없어요.</small>}
        {projects.map((j, i) => (
          <div key={j.id} style={{ padding: "8px 0", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{j.title}</p>
            {j.dueLabel && <small style={{ color: "var(--faint)" }}>{j.dueLabel}</small>}
          </div>
        ))}
        <Link className="more" href="/projects" style={{ display: "inline-block", marginTop: 10 }}>프로젝트 전체 보기 ›</Link>
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
