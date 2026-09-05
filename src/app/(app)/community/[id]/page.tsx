import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/data";
import CommentThread from "@/components/CommentThread";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const p = await getPost(params.id);
  if (!p) notFound();

  return (
    <>
      <div className="phead">
        <div>
          <Link className="more" href="/community">‹ 자유수다</Link>
          <h1 style={{ marginTop: 8, fontSize: 22 }}>{p.title}</h1>
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 22 }}>
        <div className="m" style={{ marginBottom: 16 }}>
          <span className="av" style={{ width: 36, height: 36, borderRadius: "50%", background: p.color, display: "grid", placeItems: "center", color: "#fff", fontWeight: 700, flex: "none" }}>{p.author.slice(0, 1)}</span>
          <b>{p.author}</b>{p.cohort && <span className="pill v">{p.cohort}</span>}· #{p.cat} · {p.ago}
        </div>
        <div style={{ fontSize: 14.5, lineHeight: 1.8, color: "var(--ink)", whiteSpace: "pre-line" }}>{p.body || p.excerpt}</div>
        <div className="rx" style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <span><svg className="ico" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 00-6 0v4H4l1 11h14l1-11z" /></svg>{p.likes}</span>
          <span>조회 {p.views}</span>
        </div>
      </div>

      <CommentThread topicId={`post:${p.id}`} />
    </>
  );
}
