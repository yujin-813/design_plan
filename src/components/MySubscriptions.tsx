"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { seed } from "@/lib/seed";
import { getSubscriptions } from "./SubscribeButton";
import SubscribeButton from "./SubscribeButton";

export default function MySubscriptions() {
  const [subs, setSubs] = useState<{ programs: string[]; events: string[] } | null>(null);

  useEffect(() => {
    const load = () => setSubs(getSubscriptions());
    load();
    window.addEventListener("arki-subscriptions-change", load);
    return () => window.removeEventListener("arki-subscriptions-change", load);
  }, []);

  if (!subs) return null;

  const programs = seed.programs.filter((p) => subs.programs.includes(p.id));
  const events = seed.events.filter((e) => subs.events.includes(e.id));

  if (programs.length === 0 && events.length === 0) {
    return (
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>구독한 것</h3>
        <p style={{ margin: 0, fontSize: 13, color: "var(--faint)" }}>
          아직 구독한 이벤트·수업이 없어요. <Link className="more" href="/programs">강의목록</Link> · <Link className="more" href="/events">이벤트</Link>에서 구독해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>구독한 것</h3>
      {programs.map((p) => (
        <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)", gap: 10 }}>
          <div><Link href={`/programs/${p.id}`} style={{ fontWeight: 600, fontSize: 13.5 }}>{p.title}</Link><small style={{ display: "block", color: "var(--faint)" }}>{p.status}</small></div>
          <SubscribeButton kind="programs" id={p.id} />
        </div>
      ))}
      {events.map((e) => (
        <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
          <div><span style={{ fontWeight: 600, fontSize: 13.5 }}>{e.title}</span><small style={{ display: "block", color: "var(--faint)" }}>{e.date}</small></div>
          <SubscribeButton kind="events" id={e.id} />
        </div>
      ))}
    </div>
  );
}
