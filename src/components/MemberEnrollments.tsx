"use client";
import { useEffect, useState } from "react";
import { cohorts } from "@/lib/curriculum";

export type EnrollmentView = {
  cohortId: string;
  label: string;
  course: string;
  period: string;
  state: "active" | "completed" | "dropped";
  manual: boolean;
};

const STATE_PILL: Record<EnrollmentView["state"], string> = {
  active: "mint",
  completed: "v",
  dropped: "ghost",
};

const STATE_LABEL: Record<EnrollmentView["state"], string> = {
  active: "수강 중",
  completed: "수료",
  dropped: "중도 종료",
};

// 한 회원이 듣는 기수를 추가·변경·해제합니다. 한 명이 여러 기수를 들을 수 있습니다.
export default function MemberEnrollments({ email }: { email: string }) {
  const [list, setList] = useState<EnrollmentView[] | null>(null);
  const [adding, setAdding] = useState(cohorts[0]?.id ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch(`/api/admin/enrollments?email=${encodeURIComponent(email)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j && setList(j.enrollments))
      .catch(() => setList([]));
  }, [email]);

  async function call(init: RequestInit, url = "/api/admin/enrollments") {
    setBusy(true);
    setErr("");
    const res = await fetch(url, init);
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "처리하지 못했어요.");
      return;
    }
    const j = await res.json();
    setList(j.enrollments);
  }

  const add = () =>
    call({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, cohortId: adding }),
    });

  const change = (cohortId: string, state: string) =>
    call({
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, cohortId, state: state || null }),
    });

  const drop = (cohortId: string, label: string) => {
    if (!window.confirm(`${label} 배정을 해제할까요? 해당 기수 자료가 더 이상 보이지 않습니다.`)) return;
    call({ method: "DELETE" }, `/api/admin/enrollments?email=${encodeURIComponent(email)}&cohortId=${encodeURIComponent(cohortId)}`);
  };

  if (!list) return <small style={{ color: "var(--faint)" }}>수강 기수 불러오는 중…</small>;

  const assigned = new Set(list.map((e) => e.cohortId));
  const addable = cohorts.filter((c) => !assigned.has(c.id));

  return (
    <div style={{ padding: "4px 0 10px" }}>
      {err && <small style={{ color: "var(--danger)", display: "block", marginBottom: 6 }}>{err}</small>}

      {list.length === 0 && (
        <small style={{ color: "var(--faint)", display: "block", marginBottom: 8 }}>배정된 기수가 없어요.</small>
      )}

      {list.map((e) => (
        <div key={e.cohortId} style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", padding: "6px 0" }}>
          <span className="pill v">{e.label}</span>
          <span className={"pill " + STATE_PILL[e.state]}>{STATE_LABEL[e.state]}</span>
          {!e.manual && <small style={{ color: "var(--faint)" }}>기간 기준 자동</small>}

          <select
            value={e.manual ? e.state : ""}
            disabled={busy}
            onChange={(ev) => change(e.cohortId, ev.target.value)}
            style={{ padding: "5px 8px", border: "1px solid var(--border-2)", borderRadius: 8, background: "var(--surface)", color: "var(--ink)", font: "inherit", fontSize: 12 }}
          >
            <option value="">자동 (기간 기준)</option>
            <option value="active">수강 중으로 고정</option>
            <option value="completed">수료로 고정</option>
            <option value="dropped">중도 종료</option>
          </select>

          <button type="button" className="btn sm" disabled={busy} onClick={() => drop(e.cohortId, e.label)}>
            해제
          </button>
        </div>
      ))}

      {addable.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <select
            value={adding}
            disabled={busy}
            onChange={(ev) => setAdding(ev.target.value)}
            style={{ padding: "5px 8px", border: "1px solid var(--border-2)", borderRadius: 8, background: "var(--surface)", color: "var(--ink)", font: "inherit", fontSize: 12 }}
          >
            {addable.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <button type="button" className="btn sm v" disabled={busy} onClick={add}>+ 기수 배정</button>
        </div>
      )}
    </div>
  );
}
