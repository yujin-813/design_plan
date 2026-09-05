import Link from "next/link";
import { notFound } from "next/navigation";
import { findCourseNotice } from "@/lib/courseNotices";
import CommentThread from "@/components/CommentThread";

export default function CourseNoticeDetailPage({ params }: { params: { id: string } }) {
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
