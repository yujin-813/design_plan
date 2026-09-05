"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { seed } from "@/lib/seed";
import { getSubscriptions } from "./SubscribeButton";

function extractDate(s: string) {
  const m = s.match(/(\d{2})\.(\d{2})/);
  return m ? { month: m[1], day: m[2] } : null;
}

export default function MyAgenda() {
  const [subs, setSubs] = useState<{ programs: string[]; events: string[] } | null>(null);

  useEffect(() => {
    const load = () => setSubs(getSubscriptions());
    load();
    window.addEventListener("arki-subscriptions-change", load);
    return () => window.removeEventListener("arki-subscriptions-change", load);
  }, []);

  if (!subs) return <div style={{ minHeight: 120 }} />;

  const items = [
    ...seed.events.filter((e) => subs.events.includes(e.id)).map((e) => ({
      id: e.id, title: e.title, date: extractDate(e.date), meta: e.date, href: "/events",
    })),
    ...seed.programs.filter((p) => subs.programs.includes(p.id)).map((p) => ({
      id: p.id, title: p.title, date: extractDate(p.schedule), meta: p.status, href: `/programs/${p.id}`,
    })),
  ];

  if (items.length === 0) {
    return (
      <div>
        <span className="eyebrow">오늘의 아르키</span>
        <h2 style={{ marginTop: 8 }}>아직 챙길 일정이 없어요</h2>
        <p>관심있는 이벤트나 수업을 담아두면 여기 모아서 보여드려요.</p>
        <div className="qchips" style={{ marginTop: 12 }}>
          <Link className="qchip" href="/events">이벤트 둘러보기</Link>
          <Link className="qchip" href="/programs">강의목록</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <span className="eyebrow">오늘의 아르키 · 내가 구독한 것</span>
      <h2 style={{ marginTop: 8 }}>챙겨야 할 일정이 {items.length}개 있어요</h2>
      <div className="qchips" style={{ marginTop: 14 }}>
        {items.map((it) => (
          <Link key={it.id} href={it.href} className="qchip">
            {it.date && <b>{it.date.month}/{it.date.day}</b>}
            {it.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
