import Link from "next/link";
import { seed } from "@/lib/seed";

const catClass: Record<string, string> = { "운영 공지": "v", "커뮤니티 활동": "warm", "시스템": "sky" };

function NoticeRow({ n, isLast }: { n: (typeof seed.notices)[number]; isLast: boolean }) {
  return (
    <Link
      href={`/notices/${n.id}`}
      style={{
        display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
        borderBottom: isLast ? "none" : "1px solid var(--border)",
      }}
    >
      <span className={"pill " + (catClass[n.category] ?? "ghost")}>{n.category}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>
          {n.pinned && <span style={{ color: "var(--warm-ink)", marginRight: 6 }}>📌</span>}
          {n.title}
        </p>
        <small style={{ color: "var(--faint)" }}>{n.by} · {n.date}</small>
      </div>
    </Link>
  );
}

export default function NoticesPage() {
  const pinned = seed.notices.filter((n) => n.pinned);
  const groups = seed.noticeCategories.filter((c) => c !== "전체").map((cat) => ({
    cat,
    items: seed.notices.filter((n) => n.category === cat && !n.pinned),
  }));

  return (
    <>
      <div className="phead">
        <div><h1>공지사항</h1><p>운영 공지 · 커뮤니티 활동 · 시스템 소식을 구분해서 모아뒀어요.</p></div>
      </div>

      {pinned.length > 0 && (
        <>
          <div className="bh" style={{ marginTop: 0 }}><h3>📌 고정된 공지</h3></div>
          <div className="card" style={{ marginBottom: 26 }}>
            {pinned.map((n, i) => <NoticeRow n={n} isLast={i === pinned.length - 1} key={n.id} />)}
          </div>
        </>
      )}

      {groups.map(({ cat, items }) => items.length > 0 && (
        <div key={cat}>
          <div className="bh"><h3>{cat}</h3></div>
          <div className="card" style={{ marginBottom: 26 }}>
            {items.map((n, i) => <NoticeRow n={n} isLast={i === items.length - 1} key={n.id} />)}
          </div>
        </div>
      ))}
    </>
  );
}
