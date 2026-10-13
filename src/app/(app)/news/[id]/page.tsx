import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser, viewerOf } from "@/lib/currentUser";
import { findFeedItem } from "@/lib/feed";
import CommentThread from "@/components/CommentThread";

export const dynamic = "force-dynamic";

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const n = findFeedItem(params.id, viewerOf(getCurrentUser()));
  if (!n) notFound();

  return (
    <>
      <div className="phead">
        <div>
          <Link className="more" href="/news">‹ 레터·뉴스</Link>
          <h1 style={{ marginTop: 8, fontSize: 22 }}>{n.title}</h1>
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span className={"tk tk-" + n.cat}>{n.tk}</span>
          <small style={{ color: "var(--faint)" }}>{n.source} · {n.ago}</small>
        </div>

        {n.comment !== undefined ? (
          <>
            <p style={{ margin: "0 0 8px", fontSize: 12.5, fontWeight: 700, color: "var(--violet-ink)" }}>운영팀 코멘트</p>
            <div style={{ fontSize: 14.5, lineHeight: 1.8, color: "var(--ink)", whiteSpace: "pre-line", marginBottom: n.url ? 18 : 0 }}>
              {n.comment || "코멘트 없이 공유된 글이에요."}
            </div>
            {n.url && (
              <a className="btn v" href={n.url} target="_blank" rel="noopener noreferrer">원문 보기 ↗</a>
            )}
          </>
        ) : (
          <div style={{ fontSize: 14.5, lineHeight: 1.8, color: "var(--ink)", whiteSpace: "pre-line" }}>{n.body}</div>
        )}
      </div>

      <CommentThread topicId={`news:${n.id}`} />
    </>
  );
}
