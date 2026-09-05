"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { seed } from "@/lib/seed";
import { getSubscriptions } from "@/components/SubscribeButton";
import ScrapArticle from "@/components/ScrapArticle";

export default function ScrapPage() {
  const [subs, setSubs] = useState<{ publishers: string[] } | null>(null);

  useEffect(() => {
    const load = () => setSubs(getSubscriptions());
    load();
    window.addEventListener("arki-subscriptions-change", load);
    return () => window.removeEventListener("arki-subscriptions-change", load);
  }, []);

  if (!subs) return null;

  const subscribedNames = seed.publishers.filter((p) => subs.publishers.includes(p.id)).map((p) => p.name);
  const articles = seed.news.filter((n) => subscribedNames.includes(n.source));

  return (
    <>
      <div className="phead">
        <div><h1>스크랩</h1><p>구독한 언론사·매거진의 글만 모아서 보여드려요. 클릭하면 댓글도 남길 수 있어요.</p></div>
      </div>

      {subs.publishers.length === 0 && (
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <p style={{ margin: "0 0 14px", color: "var(--muted)" }}>아직 구독한 곳이 없어요.</p>
          <Link className="btn v" href="/subscriptions">구독하러 가기 ›</Link>
        </div>
      )}

      {subs.publishers.length > 0 && articles.length === 0 && (
        <div className="card" style={{ padding: 22, color: "var(--faint)", textAlign: "center" }}>
          구독한 곳의 새 글이 아직 없어요.
        </div>
      )}

      {articles.length > 0 && (
        <div className="card">
          {articles.map((n, i) => (
            <ScrapArticle n={n} isLast={i === articles.length - 1} key={n.id} />
          ))}
        </div>
      )}
    </>
  );
}
