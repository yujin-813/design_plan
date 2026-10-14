import Link from "next/link";
import { getCurrentUser } from "@/lib/currentUser";
import { getStore } from "@/lib/subscriptions";
import { findPublisher } from "@/lib/publishers";
import { getArticlesFor } from "@/lib/rss";
import { ago } from "@/lib/comments";
import ScrapArticle, { type ScrapItem } from "@/components/ScrapArticle";

export const dynamic = "force-dynamic";

const CAT: Record<string, { tk: string; cat: string }> = {
  뉴스: { tk: "뉴스", cat: "model" },
  마케팅: { tk: "마케팅", cat: "mkt" },
  매거진: { tk: "매거진", cat: "tool" },
};

function clip(text: string, n: number) {
  return text.length > n ? text.slice(0, n) + "…" : text;
}

// 구독한 매체의 RSS 기사만 모아 최신순으로 보여줍니다.
export default async function ScrapPage() {
  const user = getCurrentUser();
  const ids = (user ? getStore(user.email).publishers : []).filter((id) => findPublisher(id));
  const articles = (await getArticlesFor(ids)).slice(0, 60);

  const items: ScrapItem[] = articles.map((a) => {
    const pub = findPublisher(a.publisherId)!;
    return {
      // AI타임스 기사는 레터·뉴스와 같은 댓글 스레드를 씁니다.
      topicKey: a.publisherId === "aitimes" ? `ait-${a.id}` : `${a.publisherId}-${a.id}`,
      title: a.title,
      summary: clip(a.summary, 120),
      source: a.author ? `${a.publisherName} · ${a.author}` : a.publisherName,
      ago: ago(a.publishedAt),
      url: a.link,
      ...CAT[pub.category],
    };
  });

  return (
    <>
      <div className="phead">
        <div><h1>스크랩</h1><p>구독한 매체의 새 기사만 모아서 보여드려요. 제목을 누르면 원문이 열리고, 줄을 누르면 댓글을 남길 수 있어요.</p></div>
      </div>

      {ids.length === 0 && (
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <p style={{ margin: "0 0 14px", color: "var(--muted)" }}>아직 구독한 매체가 없어요.</p>
          <Link className="btn v" href="/subscriptions">구독하러 가기 ›</Link>
        </div>
      )}

      {ids.length > 0 && items.length === 0 && (
        <div className="card" style={{ padding: 22, color: "var(--faint)", textAlign: "center" }}>
          기사를 불러오지 못했어요. 잠시 후 다시 확인해 주세요.
        </div>
      )}

      {items.length > 0 && (
        <div className="card">
          {items.map((n, i) => (
            <ScrapArticle n={n} isLast={i === items.length - 1} key={n.topicKey} />
          ))}
        </div>
      )}
    </>
  );
}
