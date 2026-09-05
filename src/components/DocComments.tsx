"use client";
import { useEffect, useState } from "react";
import { seed } from "@/lib/seed";

type DocComment = { author: string; text: string; at: string };

function formatAt(iso: string) {
  try {
    return new Date(iso).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export default function DocComments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<DocComment[] | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  async function load() {
    const res = await fetch(`/api/doc-comments?slug=${encodeURIComponent(slug)}`);
    if (res.ok) setComments(await res.json());
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setSending(true);
    const res = await fetch("/api/doc-comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, author: seed.me.name, text }),
    });
    setSending(false);
    if (res.ok) {
      setDraft("");
      load();
    }
  }

  return (
    <div className="card" style={{ padding: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>댓글 {comments?.length ?? ""}</h3>
      {comments?.length === 0 && <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--faint)" }}>아직 댓글이 없어요. 첫 댓글을 남겨보세요!</p>}
      {comments?.map((c, i) => (
        <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderTop: i > 0 ? "1px solid var(--border)" : undefined, fontSize: 13 }}>
          <b style={{ flex: "none" }}>{c.author}</b>
          <span style={{ color: "var(--muted)", flex: 1 }}>{c.text}</span>
          <span style={{ color: "var(--faint)", flex: "none", fontSize: 12 }}>{formatAt(c.at)}</span>
        </div>
      ))}
      <form onSubmit={submit} style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="댓글을 남겨보세요…"
          style={{ flex: 1, padding: "10px 13px", border: "1px solid var(--border-2)", borderRadius: 10, background: "var(--surface)", color: "var(--ink)", font: "inherit", fontSize: 13, outline: "none" }}
        />
        <button className="btn v" type="submit" disabled={sending}>{sending ? "등록 중…" : "등록"}</button>
      </form>
    </div>
  );
}
