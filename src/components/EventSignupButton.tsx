"use client";
import { useEffect, useState } from "react";

type State = { mine: string[]; counts: Record<string, number> };
let cache: Promise<State> | null = null;

// 카드마다 따로 부르지 않도록 한 번만 받아 둡니다.
function load(): Promise<State> {
  if (!cache) {
    cache = fetch("/api/event-signups")
      .then((r) => (r.ok ? r.json() : { mine: [], counts: {} }))
      .catch(() => ({ mine: [], counts: {} }));
  }
  return cache;
}

export default function EventSignupButton({ eventId, label }: { eventId: string; label: string }) {
  const [on, setOn] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    load().then((s) => {
      setOn(s.mine.includes(eventId));
      if (eventId in s.counts || Object.keys(s.counts).length > 0) setCount(s.counts[eventId] ?? 0);
    });
  }, [eventId]);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    setErr("");
    const res = await fetch("/api/event-signups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });
    setBusy(false);
    // 비회원은 로그인 화면으로 보냅니다.
    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(j.error ?? "신청하지 못했어요.");
      return;
    }
    cache = null;
    setOn(Boolean(j.on));
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
      <button className={"btn" + (on ? "" : " v")} onClick={toggle} disabled={busy} type="button">
        {busy ? "…" : on ? "✓ 신청 완료 (취소)" : label}
      </button>
      {count !== null && <small style={{ color: "var(--faint)", fontSize: 11 }}>신청 {count}명</small>}
      {err && <small style={{ color: "var(--danger)", fontSize: 11 }}>{err}</small>}
    </div>
  );
}
