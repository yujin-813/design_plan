"use client";
import { useState } from "react";
import { seed } from "@/lib/seed";
import SubscribeButton from "./SubscribeButton";

export default function EventsFeed() {
  const [active, setActive] = useState<(typeof seed.eventTypes)[number]>("전체");
  const filtered = active === "전체" ? seed.events : seed.events.filter((e) => e.type === active);

  return (
    <>
      <div className="chtabs">
        {seed.eventTypes.map((t) => (
          <div className={"chtab" + (t === active ? " on" : "")} key={t} onClick={() => setActive(t)}>
            {t}
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="card" style={{ padding: 22, color: "var(--faint)", textAlign: "center" }}>
          아직 {active} 이벤트가 없어요.
        </div>
      )}
      <div className="grid3">
        {filtered.map((e) => (
          <div className="evcard card" style={{ padding: 0 }} key={e.id}>
            <div className="top" style={{ background: `linear-gradient(to top, rgba(15,10,5,.72), rgba(15,10,5,.08)), url(${e.image}) center/cover no-repeat` }}>
              <span className="lv">{e.type} · {e.level}</span>
              <h4>{e.title}</h4>
            </div>
            <div className="bd">
              <div className="dt"><svg className="ico" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18" /></svg>{e.date}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn v" style={{ flex: 1 }}>{e.price}</button>
                <SubscribeButton kind="events" id={e.id} label="+ 구독" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
