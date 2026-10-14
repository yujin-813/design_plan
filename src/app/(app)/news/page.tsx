import Link from "next/link";
import { getCurrentUser, viewerOf } from "@/lib/currentUser";
import { getFeed, type FeedItem } from "@/lib/feed";

export const dynamic = "force-dynamic";

function Meta({ n }: { n: FeedItem }) {
  return (
    <small>
      {n.source} · {n.ago}
      {n.comments > 0 && <> · 💬 {n.comments}</>}
    </small>
  );
}

export default async function NewsPage() {
  const feed = await getFeed(viewerOf(getCurrentUser()));
  const [feat, ...rest] = feed;
  if (!feat) {
    return (
      <>
        <div className="phead">
          <div><h1>레터·뉴스</h1><p>운영팀이 골라 온 레터와 AI타임스 최신 소식. 읽고 생각을 댓글로 나눠 주세요.</p></div>
        </div>
        <div className="card" style={{ padding: 28, color: "var(--faint)", textAlign: "center" }}>
          소식을 불러오지 못했어요. 잠시 후 다시 확인해 주세요.
        </div>
      </>
    );
  }
  return (
    <>
      <div className="phead">
        <div><h1>레터·뉴스</h1><p>운영팀이 골라 온 레터와 AI타임스 최신 소식. 읽고 생각을 댓글로 나눠 주세요.</p></div>
      </div>
      <div className="newsfeat">
        <Link
          className="newshero"
          href={`/news/${feat.id}`}
          style={{ background: "linear-gradient(to top, rgba(14,13,10,.75), rgba(14,13,10,.15)), url(https://images.unsplash.com/photo-1674027444485-cec3da58eef4?auto=format&fit=crop&w=1200&q=70) center/cover no-repeat" }}
        >
          <div>
            <span className="pill" style={{ background: "rgba(255,255,255,.2)", color: "#fff" }}>오늘의 픽 · {feat.tk}</span>
            <h3>{feat.title}</h3>
            <p>{feat.summary}</p>
          </div>
        </Link>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {rest.slice(0, 2).map((n) => (
            <Link className="card newscard" href={`/news/${n.id}`} key={n.id}>
              <span className={"tk tk-" + n.cat}>{n.tk}</span>
              <div><h4>{n.title}</h4><p>{n.summary}</p><Meta n={n} /></div>
            </Link>
          ))}
        </div>
      </div>
      <div className="bh"><h3>최신 레터·뉴스</h3></div>
      <div className="card">
        {feed.map((n, i) => (
          <Link className="newscard" href={`/news/${n.id}`} key={n.id} style={i < feed.length - 1 ? { borderBottom: "1px solid var(--border)" } : undefined}>
            <span className={"tk tk-" + n.cat}>{n.tk}</span>
            <div><h4>{n.title}</h4><p>{n.summary}</p><Meta n={n} /></div>
          </Link>
        ))}
      </div>
    </>
  );
}
