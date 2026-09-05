import Link from "next/link";
import { notFound } from "next/navigation";
import { seed } from "@/lib/seed";
import CommentThread from "@/components/CommentThread";

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const n = seed.news.find((x) => String(x.id) === params.id);
  if (!n) notFound();

  return (
    <>
      <div className="phead">
        <div>
          <Link className="more" href="/news">‹ AI 뉴스</Link>
          <h1 style={{ marginTop: 8, fontSize: 22 }}>{n.title}</h1>
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span className={"tk tk-" + n.cat}>{n.tk}</span>
          <small style={{ color: "var(--faint)" }}>{n.source} · {n.ago}</small>
        </div>
        <div style={{ fontSize: 14.5, lineHeight: 1.8, color: "var(--ink)", whiteSpace: "pre-line" }}>{n.body}</div>
      </div>

      <CommentThread topicId={`news:${n.id}`} />
    </>
  );
}
