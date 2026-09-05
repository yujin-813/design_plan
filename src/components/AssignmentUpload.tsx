"use client";
import { useEffect, useRef, useState } from "react";

type Submission = { id: string; fileName: string; url: string; size: number; submittedBy: string; submittedAt: string };

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export default function AssignmentUpload({ programId, assignment, submittedBy }: { programId: string; assignment: string; submittedBy: string }) {
  const [subs, setSubs] = useState<Submission[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch(`/api/submissions?programId=${encodeURIComponent(programId)}&assignment=${encodeURIComponent(assignment)}`);
    if (res.ok) setSubs(await res.json());
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId, assignment]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setErr("파일을 선택해주세요.");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("programId", programId);
    fd.append("assignment", assignment);
    fd.append("submittedBy", submittedBy);
    setBusy(true);
    const res = await fetch("/api/submissions", { method: "POST", body: fd });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "업로드에 실패했어요.");
      return;
    }
    if (inputRef.current) inputRef.current.value = "";
    load();
  }

  return (
    <div style={{ marginTop: 8 }}>
      <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input ref={inputRef} type="file" style={{ fontSize: 12, maxWidth: 180 }} />
        <button className="btn sm v" disabled={busy} type="submit">{busy ? "업로드 중…" : "제출하기"}</button>
      </form>
      {err && <small style={{ color: "var(--danger)", display: "block", marginTop: 4 }}>{err}</small>}
      {subs.length > 0 && (
        <div style={{ marginTop: 8, borderTop: "1px solid var(--border)", paddingTop: 6 }}>
          {subs.map((s) => (
            <div key={s.id} style={{ fontSize: 12.5, padding: "4px 0", display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--violet-ink)", fontWeight: 600 }}>
                📎 {s.fileName} <span style={{ color: "var(--faint)", fontWeight: 400 }}>({formatSize(s.size)})</span>
              </a>
              <span style={{ color: "var(--faint)" }}>{s.submittedBy} · {new Date(s.submittedAt).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
