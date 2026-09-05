"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { seed } from "@/lib/seed";
import { getComments, addComment, markRead, isRead } from "@/lib/interactionStore";

type Article = (typeof seed.news)[number];

export default function ScrapArticle({ n, isLast }: { n: Article; isLast: boolean }) {
  const topicId = `news:${n.id}`;
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState(false);
  const [comments, setComments] = useState(() => getComments(topicId));
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setRead(isRead(topicId));
  }, [topicId]);

  function toggle() {
    if (!open && !read) {
      markRead(topicId);
      setRead(true);
    }
    setOpen((o) => !o);
  }

  function submitComment(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const c = { author: seed.me.name, text, at: "방금 전" };
    addComment(topicId, c);
    setComments((cs) => [...cs, c]);
    setDraft("");
  }

  return (
    <div className="newscard" style={{ flexDirection: "column", alignItems: "stretch", cursor: "pointer", ...(isLast ? {} : { borderBottom: "1px solid var(--border)" }) }}>
      <div style={{ display: "flex", gap: 14 }} onClick={toggle}>
        <span className={"tk tk-" + n.cat}>{n.tk}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href={`/news/${n.id}`} onClick={(e) => e.stopPropagation()} style={{ textDecoration: "none" }}>
              <h4 style={{ margin: 0 }}>{n.title}</h4>
            </Link>
            {read && <span className="pill ghost" style={{ fontSize: 10 }}>읽음</span>}
          </div>
          <p>{n.summary}</p>
          <small>{n.source} · {n.ago} · 댓글 {comments.length}</small>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }} onClick={(e) => e.stopPropagation()}>
          {comments.length === 0 && <p style={{ margin: "0 0 10px", fontSize: 12.5, color: "var(--faint)" }}>아직 댓글이 없어요. 첫 댓글을 남겨보세요!</p>}
          {comments.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", fontSize: 12.5 }}>
              <b style={{ flex: "none" }}>{c.author}</b>
              <span style={{ color: "var(--muted)" }}>{c.text}</span>
              <span style={{ marginLeft: "auto", color: "var(--faint)", flex: "none" }}>{c.at}</span>
            </div>
          ))}
          <form onSubmit={submitComment} style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="댓글을 남겨보세요…"
              style={{ flex: 1, padding: "8px 12px", border: "1px solid var(--border-2)", borderRadius: 10, background: "var(--surface)", color: "var(--ink)", font: "inherit", fontSize: 12.5, outline: "none" }}
            />
            <button className="btn sm v" type="submit">등록</button>
          </form>
        </div>
      )}
    </div>
  );
}
