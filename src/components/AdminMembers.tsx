"use client";
import { useMemo, useState } from "react";
import { cohorts } from "@/lib/curriculum";
import type { PublicMember } from "@/lib/members";

type Counts = { total: number; pending: number; approved: number; rejected: number };

const STATUS_LABEL: Record<string, string> = {
  pending: "승인 대기",
  approved: "승인 완료",
  rejected: "반려",
};

const TABS = [
  { key: "pending", label: "승인 대기" },
  { key: "approved", label: "승인 완료" },
  { key: "rejected", label: "반려" },
  { key: "all", label: "전체" },
] as const;

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export default function AdminMembers({
  initialMembers,
  initialCounts,
}: {
  initialMembers: PublicMember[];
  initialCounts: Counts;
}) {
  const [members, setMembers] = useState(initialMembers);
  const [stat, setStat] = useState(initialCounts);
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("pending");
  const [busy, setBusy] = useState<string | null>(null);

  const shown = useMemo(
    () => (tab === "all" ? members : members.filter((m) => m.status === tab)),
    [members, tab]
  );

  async function decide(id: string, status: "approved" | "rejected" | "pending") {
    setBusy(id);
    const res = await fetch("/api/admin/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setBusy(null);
    if (!res.ok) return;
    const data = await res.json();
    setMembers((list) => list.map((m) => (m.id === id ? data.member : m)));
    setStat(data.counts);
  }

  function cohortLabel(id: string) {
    return cohorts.find((c) => c.id === id)?.label ?? id;
  }

  return (
    <>
      <div className="phead">
        <div>
          <h1>가입자 관리</h1>
          <p>가입 신청을 확인하고 승인하면 해당 기수의 수업·일정·자료가 열립니다.</p>
        </div>
      </div>

      <div className="grid3" style={{ marginBottom: 22 }}>
        <div className="card" style={{ padding: 18 }}>
          <div className="eyebrow">승인 대기</div>
          <b style={{ fontSize: 26, color: "var(--warm-ink)" }}>{stat.pending}</b>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div className="eyebrow">승인 완료</div>
          <b style={{ fontSize: 26, color: "var(--violet-ink)" }}>{stat.approved}</b>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div className="eyebrow">전체 신청</div>
          <b style={{ fontSize: 26 }}>{stat.total}</b>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={"btn sm" + (tab === t.key ? " v" : "")}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            {t.key === "pending" && stat.pending > 0 && ` (${stat.pending})`}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {shown.length === 0 && (
          <p style={{ padding: 28, margin: 0, color: "var(--faint)", fontSize: 13.5 }}>
            해당하는 가입자가 없어요.
          </p>
        )}

        {shown.map((m) => (
          <div className="mrow" key={m.id}>
            <div className="mrow-av">{m.name.slice(0, 2)}</div>
            <div className="mrow-main">
              <b>{m.name}</b>
              <small>{m.email}{m.phone ? ` · ${m.phone}` : ""}</small>
            </div>
            <div className="mrow-cohort">
              <span className="pill v">{cohortLabel(m.cohortId)}</span>
              <small>{fmt(m.joinedAt)} 신청</small>
            </div>
            <div className="mrow-actions">
              <span className={"pill " + (m.status === "approved" ? "mint" : m.status === "pending" ? "warm" : "ghost")}>
                {STATUS_LABEL[m.status]}
              </span>
              {m.status !== "approved" && (
                <button className="btn sm v" disabled={busy === m.id} onClick={() => decide(m.id, "approved")}>
                  승인
                </button>
              )}
              {m.status === "pending" && (
                <button className="btn sm" disabled={busy === m.id} onClick={() => decide(m.id, "rejected")}>
                  반려
                </button>
              )}
              {m.status === "approved" && (
                <button className="btn sm" disabled={busy === m.id} onClick={() => decide(m.id, "pending")}>
                  승인 취소
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
