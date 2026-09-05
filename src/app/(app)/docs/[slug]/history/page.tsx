import Link from "next/link";
import { notFound } from "next/navigation";
import { docs, getDocHistory } from "@/lib/docs";

export default function DocHistoryPage({ params }: { params: { slug: string } }) {
  const meta = docs.find((d) => d.slug === params.slug);
  if (!meta) notFound();
  const history = getDocHistory(params.slug);

  return (
    <>
      <div className="phead">
        <div>
          <Link className="more" href={`/docs/${params.slug}`}>‹ {meta.title}</Link>
          <h1 style={{ marginTop: 8 }}>버전 기록</h1>
          <p>git 커밋 이력으로 관리되는 문서 버전이에요. 클릭하면 그 시점의 내용을 볼 수 있어요.</p>
        </div>
      </div>

      {history.length === 0 && (
        <div className="card" style={{ padding: 22, color: "var(--faint)", textAlign: "center" }}>
          아직 커밋된 버전이 없어요. 문서를 수정하고 git commit을 남기면 여기 쌓입니다.
        </div>
      )}

      <div className="card">
        {history.map((rev, i) => (
          <Link
            key={rev.hash}
            href={`/docs/${params.slug}/history/${rev.hash}`}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, padding: "14px 18px", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}
          >
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 13.5 }}>{rev.message}</p>
              <small style={{ color: "var(--faint)" }}>{rev.date}</small>
            </div>
            {i === 0 && <span className="pill v">최신</span>}
            <code className="mono" style={{ fontSize: 11, color: "var(--faint)" }}>{rev.hash.slice(0, 7)}</code>
          </Link>
        ))}
      </div>
    </>
  );
}
