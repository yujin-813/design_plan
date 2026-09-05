import Link from "next/link";
import { seed } from "@/lib/seed";

export default function NewsPage() {
  const [feat, ...rest] = seed.news;
  return (
    <>
      <div className="phead">
        <div><h1>AI 뉴스</h1><p>마케터를 위해 큐레이션한 최신 AI 소식.</p></div>
      </div>
      <div className="newsfeat">
        <Link
          className="newshero"
          href={`/news/${feat.id}`}
          style={{ background: "linear-gradient(to top, rgba(14,13,10,.75), rgba(14,13,10,.15)), url(https://images.unsplash.com/photo-1674027444485-cec3da58eef4?auto=format&fit=crop&w=1200&q=70) center/cover no-repeat" }}
        >
          <div>
            <span className="pill" style={{ background: "rgba(255,255,255,.2)", color: "#fff" }}>오늘의 픽</span>
            <h3>{feat.title}</h3>
            <p>{feat.summary}</p>
          </div>
        </Link>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {rest.slice(0, 2).map((n) => (
            <Link className="card newscard" href={`/news/${n.id}`} key={n.id}>
              <span className={"tk tk-" + n.cat}>{n.tk}</span>
              <div><h4>{n.title}</h4><p>{n.summary}</p><small>{n.source} · {n.ago}</small></div>
            </Link>
          ))}
        </div>
      </div>
      <div className="bh"><h3>최신 소식</h3></div>
      <div className="card">
        {seed.news.map((n, i) => (
          <Link className="newscard" href={`/news/${n.id}`} key={n.id} style={i < seed.news.length - 1 ? { borderBottom: "1px solid var(--border)" } : undefined}>
            <span className={"tk tk-" + n.cat}>{n.tk}</span>
            <div><h4>{n.title}</h4><p>{n.summary}</p><small>{n.source} · {n.ago}</small></div>
          </Link>
        ))}
      </div>
    </>
  );
}
