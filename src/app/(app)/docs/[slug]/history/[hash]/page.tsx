import Link from "next/link";
import { notFound } from "next/navigation";
import { docs, getDocHistory, getDocRevisionContent } from "@/lib/docs";

export default function DocRevisionPage({ params }: { params: { slug: string; hash: string } }) {
  const meta = docs.find((d) => d.slug === params.slug);
  if (!meta) notFound();
  const history = getDocHistory(params.slug);
  const rev = history.find((r) => r.hash === params.hash);
  const html = getDocRevisionContent(params.slug, params.hash);
  if (!rev || html === null) notFound();

  return (
    <>
      <div className="phead">
        <div>
          <Link className="more" href={`/docs/${params.slug}/history`}>‹ 버전 기록</Link>
          <h1 style={{ marginTop: 8 }}>{rev.message}</h1>
          <p>{rev.date} · <code className="mono">{rev.hash.slice(0, 7)}</code> 시점의 내용이에요. 읽기 전용입니다.</p>
        </div>
      </div>

      <div className="card" style={{ padding: "10px 18px", marginBottom: 18, background: "var(--warm-soft)", color: "var(--warm-ink)", fontSize: 13 }}>
        지난 버전을 보고 있어요. 최신 내용은 <Link href={`/docs/${params.slug}`} style={{ textDecoration: "underline" }}>여기서</Link> 확인하세요.
      </div>

      <div className="card doc-content" style={{ padding: 32 }} dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
