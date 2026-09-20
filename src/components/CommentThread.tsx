"use client";
import { useCallback, useEffect, useState } from "react";
import { markRead } from "@/lib/interactionStore";

type CommentView = { id: string; author: string; cohort: string; text: string; at: string; mine: boolean };

// 댓글은 서버에 저장됩니다. 작성자는 로그인한 사람으로 서버가 채웁니다.
export default function CommentThread({ topicId }: { topicId: string }) {
  const [comments, setComments] = useState<CommentView[]>([]);
  const [draft, setDraft] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/comments?topicId=${encodeURIComponent(topicId)}`);
    if (!res.ok) return;
    const j = await res.json();
    setComments(j.comments ?? []);
  }, [topicId]);

  useEffect(() => {
    load();
    markRead(topicId);
  }, [topicId, load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    setErr("");
    setBusy(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId, text }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "댓글을 저장하지 못했어요.");
      return;
    }
    const j = await res.json();
    setComments((cs) => [...cs, j.comment]);
    setDraft("");
  }

  return (
    <div className="card" style={{ padding: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>댓글 {comments.length}</h3>
      {comments.length === 0 && <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--faint)" }}>아직 댓글이 없어요. 첫 댓글을 남겨보세요!</p>}
      {comments.map((c, i) => (
        <div key={c.id} style={{ display: "flex", gap: 10, padding: "10px 0", borderTop: i > 0 ? "1px solid var(--border)" : undefined, fontSize: 13 }}>
          <b style={{ flex: "none" }}>{c.author}</b>
          {c.cohort && <span className="pill v" style={{ flex: "none" }}>{c.cohort}</span>}
          <span style={{ color: "var(--muted)", flex: 1 }}>{c.text}</span>
          <span style={{ color: "var(--faint)", flex: "none", fontSize: 12 }}>{c.at}</span>
        </div>
      ))}
      {err && <small style={{ color: "var(--danger)", display: "block", marginTop: 10 }}>{err}</small>}
      <form onSubmit={submit} style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="댓글을 남겨보세요…"
          style={{ flex: 1, padding: "10px 13px", border: "1px solid var(--border-2)", borderRadius: 10, background: "var(--surface)", color: "var(--ink)", font: "inherit", fontSize: 13, outline: "none" }}
        />
        <button className="btn v" type="submit" disabled={busy}>{busy ? "…" : "등록"}</button>
      </form>
    </div>
  );
}
