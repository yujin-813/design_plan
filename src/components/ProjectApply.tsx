"use client";
import { useState } from "react";

export default function ProjectApply({
  projectId,
  applied: initialApplied,
  closed,
  canApply,
}: {
  projectId: string;
  applied: boolean;
  closed: boolean;
  canApply: boolean;
}) {
  const [applied, setApplied] = useState(initialApplied);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, message }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "지원하지 못했어요.");
      return;
    }
    setApplied(true);
    setOpen(false);
  }

  async function cancel() {
    if (!window.confirm("지원을 취소할까요?")) return;
    const res = await fetch(`/api/applications?projectId=${encodeURIComponent(projectId)}`, { method: "DELETE" });
    if (res.ok) setApplied(false);
  }

  if (applied) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span className="pill mint">지원 완료 · 운영팀이 확인 후 연락드려요</span>
        {!closed && <button type="button" className="btn sm" onClick={cancel}>지원 취소</button>}
      </div>
    );
  }
  if (closed) return <span className="pill">지원 마감</span>;
  if (!canApply) return null;

  if (!open) {
    return <button type="button" className="btn v sm" onClick={() => setOpen(true)}>지원하기</button>;
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {err && <div className="err">{err}</div>}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder="관련 경험이나 하고 싶은 이유를 짧게 남겨 주세요. (선택)"
        style={{ padding: "11px 13px", border: "1px solid var(--border-2)", borderRadius: 11, background: "var(--surface)", color: "var(--ink)", font: "inherit", fontSize: 14, resize: "vertical" }}
      />
      <p style={{ margin: 0, fontSize: 12, color: "var(--faint)" }}>운영팀은 기수와 제출했던 과제 결과물을 함께 보고 연락드려요.</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn v sm" disabled={busy}>{busy ? "보내는 중…" : "지원서 보내기"}</button>
        <button type="button" className="btn sm" onClick={() => setOpen(false)}>취소</button>
      </div>
    </form>
  );
}
