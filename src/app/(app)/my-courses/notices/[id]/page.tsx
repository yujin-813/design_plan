import Link from "next/link";
import { notFound } from "next/navigation";
import { findCourseNotice } from "@/lib/courseNotices";
import CommentThread from "@/components/CommentThread";
import { getCurrentUser, viewerOf } from "@/lib/currentUser";
import { canSee, cohortIdOf, findItem, shortDate } from "@/lib/content";
import { cohorts } from "@/lib/curriculum";

export const dynamic = "force-dynamic";

export default function CourseNoticeDetailPage({ params }: { params: { id: string } }) {
  const user = getCurrentUser();
  const viewer = viewerOf(user);

  // 운영자가 올린 기수 공지
  const authored = findItem(params.id);
  if (authored && authored.kind === "notice") {
    // 다른 기수 전용 공지는 주소를 알아도 열리지 않습니다.
    if (!canSee(authored, viewer)) notFound();

    const cohortId = cohortIdOf(authored.scope);
    const label = cohortId
      ? cohorts.find((c) => c.id === cohortId)?.label ?? cohortId
      : "전체 공개";

    return (
      <>
        <div className="phead">
          <div>
            <Link className="more" href="/my-courses/notices">‹ 공지보기</Link>
            <h1 style={{ marginTop: 8, fontSize: 22 }}>{authored.title}</h1>
          </div>
        </div>

        <div className="card" style={{ padding: 24, marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <span className="pill v">{label}</span>
            <small style={{ color: "var(--faint)" }}>
              {authored.createdBy} · {shortDate(authored.createdAt)}
              {authored.updatedAt ? " (수정됨)" : ""}
            </small>
          </div>
          <div style={{ fontSize: 14.5, lineHeight: 1.8, color: "var(--ink)", whiteSpace: "pre-line" }}>{authored.body}</div>
        </div>

        <CommentThread topicId={`coursenotice:${authored.id}`} />
      </>
    );
  }

  const found = findCourseNotice(params.id);
  if (!found) notFound();
  const { notice, program } = found;

  return (
    <>
      <div className="phead">
        <div>
          <Link className="more" href="/my-courses/notices">‹ 공지보기</Link>
          <h1 style={{ marginTop: 8, fontSize: 22 }}>{notice.title}</h1>
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span className="pill v">{program.title}</span>
          <small style={{ color: "var(--faint)" }}>{notice.date}</small>
        </div>
        <div style={{ fontSize: 14.5, lineHeight: 1.8, color: "var(--ink)", whiteSpace: "pre-line" }}>{notice.body}</div>
      </div>

      <CommentThread topicId={`coursenotice:${notice.id}`} />
    </>
  );
}
