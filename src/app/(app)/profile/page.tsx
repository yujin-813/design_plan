import MySubscriptions from "@/components/MySubscriptions";
import { getCurrentUser } from "@/lib/currentUser";
import { findByEmail } from "@/lib/members";
import { readPosts } from "@/lib/posts";
import { countCommentsBy } from "@/lib/comments";
import { readSubmissions } from "@/lib/submissions";
import { findCohort } from "@/lib/curriculum";
import { shortDate } from "@/lib/content";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  const user = getCurrentUser();
  const member = user && user.role !== "admin" ? findByEmail(user.email) : null;
  const joined = member ? new Date(member.joinedAt) : null;
  const postCount = user ? readPosts().filter((x) => x.authorEmail === user.email).length : 0;
  const commentCount = user ? countCommentsBy(user.email) : 0;
  // 수료 후에도 남는 포트폴리오. 프로젝트 지원 때 운영팀이 함께 봅니다.
  const works = user ? readSubmissions().filter((s) => s.submittedByEmail === user.email) : [];
  return (
    <>
      <div className="phead">
        <div><h1>프로필</h1><p>커뮤니티 안에서의 나를 보여주는 페이지.</p></div>
        <button className="btn">프로필 편집</button>
      </div>
      <div className="ptop card">
        <div className="big">{(user?.name || "?").slice(0, 1)}</div>
        <div style={{ flex: 1 }}>
          <h2>{user?.name ?? "게스트"} <span className="pill v" style={{ verticalAlign: "middle" }}>{user?.cohortLabel ?? "게스트"}</span></h2>
          <p>
            {user?.role === "admin"
              ? "운영팀 계정"
              : joined
                ? `${joined.getFullYear()}.${String(joined.getMonth() + 1).padStart(2, "0")} 합류`
                : ""}
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <span className="pill mint">글 {postCount} · 댓글 {commentCount}</span>
            <span className="pill sky">과제 {works.length}건 제출</span>
          </div>
        </div>
      </div>
      <div className="grid2">
        <MySubscriptions />
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>최근 활동</h3>
          <div className="evi"><div className="d" style={{ background: "var(--violet-soft)", borderColor: "transparent" }}><b style={{ color: "var(--violet-ink)" }}>Q</b></div><div><p>프리랜서 전향 질문에 댓글 남김</p><small>#질문 · 어제</small></div></div>
          <div className="evi"><div className="d" style={{ background: "var(--mint-soft)", borderColor: "transparent" }}><b style={{ color: "var(--violet-ink)" }}>📅</b></div><div><p>가을맞이 오프라인 밋업 신청 완료</p><small>10.09(목) · 강남 라운지</small></div></div>
          <div className="evi"><div className="d" style={{ background: "var(--warm-soft)", borderColor: "transparent" }}><b style={{ color: "var(--warm-ink)" }}>✎</b></div><div><p>자유수다에 새 글 작성</p><small>3일 전</small></div></div>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginTop: 18 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>내 과제 결과물</h3>
        <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "var(--faint)" }}>수료 후에도 남아 있고, 프로젝트에 지원하면 운영팀이 함께 봐요.</p>
        {works.length === 0 && <small style={{ color: "var(--faint)" }}>아직 제출한 과제가 없어요.</small>}
        {works.map((w, i) => (
          <div key={w.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", borderTop: i > 0 ? "1px solid var(--border)" : undefined, flexWrap: "wrap" }}>
            <div>
              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600 }}>{w.assignment}</p>
              <small style={{ color: "var(--faint)" }}>
                {(w.cohortId && findCohort(w.cohortId)?.label) || "기수 미지정"} · {shortDate(w.submittedAt)}
              </small>
            </div>
            <a className="more" href={w.url} target="_blank" rel="noopener noreferrer">{w.fileName} ↗</a>
          </div>
        ))}
      </div>
    </>
  );
}
