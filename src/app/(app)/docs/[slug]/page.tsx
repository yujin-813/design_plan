import Link from "next/link";
import { notFound } from "next/navigation";
import { docs, getDocContent, getDocHistory } from "@/lib/docs";
import DocComments from "@/components/DocComments";

export default function DocDetailPage({ params }: { params: { slug: string } }) {
  const meta = docs.find((d) => d.slug === params.slug);
  const html = getDocContent(params.slug);
  if (!meta || html === null) notFound();

  const history = getDocHistory(params.slug);

  return (
    <>
      <div className="phead">
        <div>
          <Link className="more" href="/docs">‹ 문서</Link>
        </div>
        <Link className="btn" href={`/docs/${params.slug}/history`}>
          <svg className="ico" viewBox="0 0 24 24"><path d="M3 12a9 9 0 109-9" /><path d="M3 4v5h5M12 7v5l4 2" /></svg>
          버전 기록 {history.length > 0 && `(${history.length})`}
        </Link>
      </div>

      <div className="card doc-content" style={{ padding: 32, marginBottom: 22 }} dangerouslySetInnerHTML={{ __html: html }} />

      <DocComments slug={params.slug} />
    </>
  );
}
