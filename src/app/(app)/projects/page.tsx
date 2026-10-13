import { getCurrentUser, isApproved, viewerOf } from "@/lib/currentUser";
import { listVisible, shortDate } from "@/lib/content";
import { appliedProjectIds, countByProject } from "@/lib/applications";
import ProjectApply from "@/components/ProjectApply";

export const dynamic = "force-dynamic";

export default function ProjectsPage() {
  const user = getCurrentUser();
  const projects = listVisible("project", viewerOf(user));
  // 모집 중인 것을 먼저 보여줍니다.
  const sorted = [...projects.filter((p) => !p.closed), ...projects.filter((p) => p.closed)];
  const applied = new Set(user ? appliedProjectIds(user.email) : []);
  const counts = user?.role === "admin" ? countByProject() : {};
  const canApply = Boolean(user && user.role !== "admin" && isApproved(user));

  return (
    <>
      <div className="phead">
        <div><h1>프로젝트</h1><p>운영팀이 외부에서 받아 온 프로젝트예요. 관심 있으면 지원해 주세요.</p></div>
      </div>

      {sorted.length === 0 && (
        <div className="card" style={{ padding: 28, color: "var(--faint)", textAlign: "center" }}>
          지금은 모집 중인 프로젝트가 없어요. 새 프로젝트가 올라오면 여기에 보여요.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {sorted.map((p) => (
          <div key={p.id} className="card" style={{ padding: 20, opacity: p.closed ? 0.7 : 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              <span className={"pill " + (p.closed ? "" : "v")}>{p.closed ? "마감" : "모집 중"}</span>
              {p.dueLabel && <small style={{ color: "var(--faint)" }}>{p.dueLabel}</small>}
              <small style={{ color: "var(--faint)" }}>· {shortDate(p.createdAt)} 등록</small>
              {user?.role === "admin" && <small style={{ color: "var(--violet-ink)", fontWeight: 700 }}>· 지원 {counts[p.id] ?? 0}명</small>}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 8px" }}>{p.title}</h3>
            {p.body && <p style={{ margin: "0 0 16px", fontSize: 14, lineHeight: 1.7, color: "var(--muted)", whiteSpace: "pre-line" }}>{p.body}</p>}
            <ProjectApply projectId={p.id} applied={applied.has(p.id)} closed={Boolean(p.closed)} canApply={canApply} />
          </div>
        ))}
      </div>
    </>
  );
}
