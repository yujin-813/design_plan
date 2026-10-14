import Link from "next/link";
import { seed } from "@/lib/seed";
import { getCurrentUser, viewerOf } from "@/lib/currentUser";
import { cohortIdOf, listVisible, shortDate } from "@/lib/content";
import { cohorts } from "@/lib/curriculum";

export const dynamic = "force-dynamic";

const catClass: Record<string, string> = { "운영 공지": "v", "커뮤니티 활동": "warm", "시스템": "sky" };

type Row = {
  id: string;
  href: string;
  category: string;
  pinned: boolean;
  title: string;
  by: string;
  date: string;
  /** 특정 기수 전용이면 그 기수 이름 */
  cohortLabel?: string;
};

function cohortLabelOf(scope: Parameters<typeof cohortIdOf>[0]) {
  const id = cohortIdOf(scope);
  if (!id) return undefined;
  return cohorts.find((c) => c.id === id)?.label ?? "기수 전용";
}

function NoticeRow({ n, isLast }: { n: Row; isLast: boolean }) {
  return (
    <Link
      href={n.href}
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
          {n.cohortLabel && <span className="pill v" style={{ marginLeft: 8 }}>{n.cohortLabel}</span>}
        </p>
        <small style={{ color: "var(--faint)" }}>{n.by} · {n.date}</small>
      </div>
    </Link>
  );
}

export default function NoticesPage() {
  const user = getCurrentUser();
  const viewer = viewerOf(user);

  // 운영자가 올린 공지 + 기존 시드 공지를 함께 보여줍니다.
  const authored: Row[] = listVisible("notice", viewer).map((c) => ({
    id: c.id,
    href: `/notices/${c.id}`,
    category: c.category ?? "운영 공지",
    pinned: Boolean(c.pinned),
    title: c.title,
    by: c.createdBy,
    date: shortDate(c.createdAt),
    cohortLabel: cohortLabelOf(c.scope),
  }));

  const seeded: Row[] = seed.notices.map((n) => ({
    id: String(n.id),
    href: `/notices/${n.id}`,
    category: n.category,
    pinned: Boolean(n.pinned),
    title: n.title,
    by: n.by,
    date: n.date,
  }));

  const all = [...authored, ...seeded];
  const pinned = all.filter((n) => n.pinned);
  const groups = seed.noticeCategories.filter((c) => c !== "전체").map((cat) => ({
    cat,
    items: all.filter((n) => n.category === cat && !n.pinned),
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
