import { seed } from "@/lib/seed";
import SubscribeButton from "@/components/SubscribeButton";

const catPill: Record<string, string> = { 뉴스: "sky", 매거진: "warm" };

export default function SubscriptionsPage() {
  return (
    <>
      <div className="phead">
        <div><h1>구독</h1><p>관심있는 언론사·매거진을 구독하면 새 글이 스크랩에 모여요.</p></div>
      </div>
      <div className="grid2">
        {seed.publishers.map((pub) => (
          <div className="card" style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }} key={pub.id}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <b style={{ fontSize: 14.5 }}>{pub.name}</b>
                <span className={"pill " + (catPill[pub.category] ?? "ghost")}>{pub.category}</span>
              </div>
              <small style={{ color: "var(--muted)" }}>{pub.desc}</small>
            </div>
            <SubscribeButton kind="publishers" id={pub.id} />
          </div>
        ))}
      </div>
    </>
  );
}
