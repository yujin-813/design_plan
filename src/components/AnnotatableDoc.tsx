"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { seed } from "@/lib/seed";

type DocComment = {
  id: string;
  anchor: string | null;
  anchorPreview: string | null;
  parentId: string | null;
  author: string;
  text: string;
  at: string;
  editedAt?: string;
};

function formatAt(iso: string) {
  try {
    return new Date(iso).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export default function AnnotatableDoc({ slug, html }: { slug: string; html: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState<DocComment[]>([]);
  const [selectedAnchor, setSelectedAnchor] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");

  async function load() {
    const res = await fetch(`/api/doc-comments?slug=${encodeURIComponent(slug)}`);
    if (res.ok) setComments(await res.json());
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    const blocks = Array.from(root.querySelectorAll<HTMLElement>("[data-anchor]"));
    const counts = new Map<string, number>();
    comments.forEach((c) => {
      if (c.anchor) counts.set(c.anchor, (counts.get(c.anchor) || 0) + 1);
    });
    blocks.forEach((el) => {
      const a = el.dataset.anchor!;
      const n = counts.get(a) || 0;
      if (n > 0) el.dataset.count = String(n);
      else delete el.dataset.count;
      el.classList.toggle("active", a === selectedAnchor);
    });
  }, [comments, selectedAnchor, html]);

  function onContentClick(e: React.MouseEvent) {
    const target = (e.target as HTMLElement).closest("[data-anchor]") as HTMLElement | null;
    if (!target || !contentRef.current?.contains(target)) return;
    const anchor = target.dataset.anchor!;
    const preview = (target.tagName === "IMG" ? (target as HTMLImageElement).alt : target.textContent || "").slice(0, 60);
    setSelectedAnchor(anchor);
    setSelectedPreview(preview);
  }

  const visibleComments = useMemo(() => {
    const top = comments.filter((c) => !c.parentId && (selectedAnchor === null ? true : c.anchor === selectedAnchor));
    return top.map((c) => ({ ...c, replies: comments.filter((r) => r.parentId === c.id) }));
  }, [comments, selectedAnchor]);

  async function post(body: Record<string, unknown>) {
    const res = await fetch("/api/doc-comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, author: seed.me.name, ...body }),
    });
    if (res.ok) load();
    return res.ok;
  }

  async function submitNew(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    if (await post({ text, anchor: selectedAnchor, anchorPreview: selectedPreview, parentId: null })) setDraft("");
  }

  async function submitReply(parentId: string) {
    const text = replyDraft.trim();
    if (!text) return;
    if (await post({ text, anchor: selectedAnchor, anchorPreview: selectedPreview, parentId })) {
      setReplyDraft("");
      setReplyingId(null);
    }
  }

  async function submitEdit(id: string) {
    const text = editDraft.trim();
    if (!text) return;
    const res = await fetch("/api/doc-comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, id, text }),
    });
    if (res.ok) {
      setEditingId(null);
      load();
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/doc-comments?slug=${encodeURIComponent(slug)}&id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) load();
  }

  function CommentRow({ c, isReply }: { c: DocComment; isReply?: boolean }) {
    const mine = c.author === seed.me.name;
    return (
      <div className={"cmt" + (isReply ? " reply" : "")}>
        {editingId === c.id ? (
          <form
            className="cmt-editform"
            onSubmit={(e) => {
              e.preventDefault();
              submitEdit(c.id);
            }}
          >
            <input value={editDraft} onChange={(e) => setEditDraft(e.target.value)} autoFocus />
            <button className="btn sm v" type="submit">저장</button>
            <button className="btn sm" type="button" onClick={() => setEditingId(null)}>취소</button>
          </form>
        ) : (
          <div className="row">
            <b>{c.author}</b>
            <span className="txt">
              {c.text}
              {c.editedAt && <span style={{ color: "var(--faint)" }}> (수정됨)</span>}
            </span>
            <span className="at">{formatAt(c.at)}</span>
          </div>
        )}
        <div className="actions">
          {!isReply && <button onClick={() => setReplyingId(replyingId === c.id ? null : c.id)}>답글</button>}
          {mine && editingId !== c.id && (
            <>
              <button
                onClick={() => {
                  setEditingId(c.id);
                  setEditDraft(c.text);
                }}
              >
                수정
              </button>
              <button onClick={() => remove(c.id)}>삭제</button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={contentRef}
        className="card doc-content"
        style={{ padding: 32, marginBottom: 22 }}
        onClick={onContentClick}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>
            댓글 {comments.filter((c) => !c.parentId).length}
            {selectedAnchor && <span style={{ fontWeight: 500, color: "var(--muted)", fontSize: 12.5 }}> · &ldquo;{selectedPreview}&hellip;&rdquo; 부분</span>}
          </h3>
          {selectedAnchor && (
            <button
              className="more"
              onClick={() => {
                setSelectedAnchor(null);
                setSelectedPreview(null);
              }}
            >
              전체 댓글 보기
            </button>
          )}
        </div>

        {!selectedAnchor && (
          <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--faint)" }}>
            💡 문서 안의 문장이나 이미지를 클릭하면 그 부분에 댓글을 남길 수 있어요.
          </p>
        )}

        {visibleComments.length === 0 && (
          <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--faint)" }}>아직 댓글이 없어요. 첫 댓글을 남겨보세요!</p>
        )}

        {visibleComments.map((c) => (
          <div key={c.id} style={{ marginBottom: 4 }}>
            {!selectedAnchor && c.anchorPreview && (
              <div style={{ fontSize: 11.5, color: "var(--violet-ink)", marginTop: 10 }}>&ldquo;{c.anchorPreview}&hellip;&rdquo; 부분</div>
            )}
            <CommentRow c={c} />
            {c.replies.map((r) => (
              <CommentRow c={r} isReply key={r.id} />
            ))}
            {replyingId === c.id && (
              <form
                className="cmt-replyform reply"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitReply(c.id);
                }}
              >
                <input value={replyDraft} onChange={(e) => setReplyDraft(e.target.value)} placeholder="답글 남기기…" autoFocus />
                <button className="btn sm v" type="submit">등록</button>
              </form>
            )}
          </div>
        ))}

        <form onSubmit={submitNew} style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={selectedAnchor ? "이 부분에 댓글 남기기…" : "댓글을 남겨보세요…"}
            style={{ flex: 1, padding: "10px 13px", border: "1px solid var(--border-2)", borderRadius: 10, background: "var(--surface)", color: "var(--ink)", font: "inherit", fontSize: 13, outline: "none" }}
          />
          <button className="btn v" type="submit">등록</button>
        </form>
      </div>
    </>
  );
}
