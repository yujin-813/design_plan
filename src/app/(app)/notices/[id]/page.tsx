import Link from "next/link";
import { notFound } from "next/navigation";
import { seed } from "@/lib/seed";
import CommentThread from "@/components/CommentThread";
import { getCurrentUser, viewerOf } from "@/lib/currentUser";
import { canSee, cohortIdOf, findItem, shortDate } from "@/lib/content";
import { cohorts } from "@/lib/curriculum";

export const dynamic = "force-dynamic";

const catClass: Record<string, string> = { "운영 공지": "v", "커뮤니티 활동": "warm", "시스템": "sky" };

export default function NoticeDetailPage({ params }: { params: { id: string } }) {
  const user = getCurrentUser();
  const viewer = viewerOf(user);

  // 운영자가 올린 공지를 먼저 찾고, 없으면 기존 시드 공지를 찾습니다.
  const authored = findItem(params.id);
  if (authored && authored.kind === "notice") {
    // 다른 기수 전용 공지는 주소를 알아도 열리지 않습니다.
    if (!canSee(authored, viewer)) notFound();

    const cohortId = cohortIdOf(authored.scope);
    const cohortLabel = cohortId ? cohorts.find((c) => c.id === cohortId)?.label ?? cohortId : null;

    return (
      <>
        <div className="phead">
          <div>
            <Link className="more" href="/notices">‹ 공지사항</Link>
            <h1 style={{ marginTop: 8, fontSize: 22 }}>{authored.title}</h1>
          </div>
        </div>

        <div className="card" style={{ padding: 24, marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <span className={"pill " + (catClass[authored.category ?? ""] ?? "ghost")}>
              {authored.category ?? "운영 공지"}
            </span>
            {cohortLabel && <span className="pill v">{cohortLabel} 전용</span>}
            <small style={{ color: "var(--faint)" }}>
              {authored.createdBy} · {shortDate(authored.createdAt)}
              {authored.updatedAt ? " (수정됨)" : ""}
            </small>
          </div>
          <div style={{ fontSize: 14.5, lineHeight: 1.8, color: "var(--ink)", whiteSpace: "pre-line" }}>{authored.body}</div>
        </div>

        <CommentThread topicId={`notice:${authored.id}`} />
      </>
    );
  }

  const n = seed.notices.find((x) => String(x.id) === params.id);
  if (!n) notFound();

  return (
    <>
      <div className="phead">
        <div>
          <Link className="more" href="/notices">‹ 공지사항</Link>
          <h1 style={{ marginTop: 8, fontSize: 22 }}>{n.title}</h1>
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span className={"pill " + (catClass[n.category] ?? "ghost")}>{n.category}</span>
          <small style={{ color: "var(--faint)" }}>{n.by} · {n.date}</small>
        </div>
        <div style={{ fontSize: 14.5, lineHeight: 1.8, color: "var(--ink)", whiteSpace: "pre-line" }}>{n.body}</div>
      </div>

      <CommentThread topicId={`notice:${n.id}`} />
    </>
  );
}
