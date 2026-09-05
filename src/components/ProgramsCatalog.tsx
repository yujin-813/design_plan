"use client";
import { useState } from "react";
import Link from "next/link";
import { seed } from "@/lib/seed";
import SubscribeButton from "./SubscribeButton";

const statusPill: Record<string, string> = { "모집 중": "mint", "진행 중": "v", "수료": "ghost", "오픈 예정": "sky" };
const tabs = ["모집중 강의", "모집이 끝난 강의", "특별 강의"] as const;

function matchesTab(p: (typeof seed.programs)[number], tab: (typeof tabs)[number]) {
  if (tab === "특별 강의") return p.kind === "특별";
  if (p.kind === "특별") return false;
  if (tab === "모집중 강의") return p.status !== "수료";
  return p.status === "수료";
}

export default function ProgramsCatalog() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<(typeof tabs)[number]>("모집중 강의");

  const filtered = seed.programs
    .filter((p) => matchesTab(p, tab))
    .filter((p) => (p.title + p.summary).toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <div className="ask" style={{ marginBottom: 16 }}>
        <span className="orb" />
        <input placeholder="과정 이름으로 검색…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="chtabs">
        {tabs.map((t) => (
          <div className={"chtab" + (t === tab ? " on" : "")} key={t} onClick={() => setTab(t)}>{t}</div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card" style={{ padding: 22, color: "var(--faint)", textAlign: "center" }}>
          조건에 맞는 과정이 없어요.
        </div>
      )}

      <div className="grid3">
        {filtered.map((p) => (
          <div className="evcard card" style={{ padding: 0, opacity: p.status === "수료" ? 0.8 : 1 }} key={p.id}>
            <div className="top" style={{ background: p.color }}>
              <span className="lv">{p.status}{p.kind === "특별" && " · 특별강의"}</span>
              <h4>{p.title}</h4>
            </div>
            <div className="bd">
              <div className="dt"><svg className="ico" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18" /></svg>{p.format}</div>
              <p style={{ margin: "0 0 10px", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>{p.summary}</p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--muted)", marginBottom: 12 }}>
                <span>{p.schedule}</span>
                <b style={{ color: "var(--ink)" }}>{p.price}</b>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Link className="btn v" style={{ flex: 1 }} href={`/programs/${p.id}`}>자세히 보기</Link>
                <SubscribeButton kind="programs" id={p.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
