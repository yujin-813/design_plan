"use client";
import { useEffect, useState } from "react";
import { seed } from "@/lib/seed";
import { getComments, addComment, markRead } from "@/lib/interactionStore";

export default function CommentThread({ topicId }: { topicId: string }) {
  const [comments, setComments] = useState<ReturnType<typeof getComments>>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setComments(getComments(topicId));
    markRead(topicId);
  }, [topicId]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const c = { author: seed.me.name, text, at: "방금 전" };
    addComment(topicId, c);
    setComments((cs) => [...cs, c]);
    setDraft("");
  }

  return (
    <div className="card" style={{ padding: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>댓글 {comments.length}</h3>
      {comments.length === 0 && <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--faint)" }}>아직 댓글이 없어요. 첫 댓글을 남겨보세요!</p>}
      {comments.map((c, i) => (
        <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderTop: i > 0 ? "1px solid var(--border)" : undefined, fontSize: 13 }}>
          <b style={{ flex: "none" }}>{c.author}</b>
          <span style={{ color: "var(--muted)", flex: 1 }}>{c.text}</span>
          <span style={{ color: "var(--faint)", flex: "none", fontSize: 12 }}>{c.at}</span>
        </div>
      ))}
      <form onSubmit={submit} style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="댓글을 남겨보세요…"
          style={{ flex: 1, padding: "10px 13px", border: "1px solid var(--border-2)", borderRadius: 10, background: "var(--surface)", color: "var(--ink)", font: "inherit", fontSize: 13, outline: "none" }}
        />
        <button className="btn v" type="submit">등록</button>
      </form>
    </div>
  );
}
