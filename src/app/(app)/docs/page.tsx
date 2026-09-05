import Link from "next/link";
import { docs } from "@/lib/docs";

export default function DocsPage() {
  return (
    <>
      <div className="phead">
        <div><h1>문서</h1><p>팀이 함께 보는 기획 문서. 댓글을 남기거나 이전 버전을 확인할 수 있어요.</p></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {docs.map((d) => (
          <Link key={d.slug} href={`/docs/${d.slug}`} className="card" style={{ padding: 18, display: "block" }}>
            <b style={{ fontSize: 15 }}>{d.title}</b>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--muted)" }}>{d.desc}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
