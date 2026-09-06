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
  const wrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [comments, setComments] = useState<DocComment[]>([]);
  const [openAnchor, setOpenAnchor] = useState<string | null>(null);
  const [openPreview, setOpenPreview] = useState<string | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);

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

  // 댓글 개수 배지 + 활성 강조 표시
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
      el.classList.toggle("active", a === openAnchor);
    });
  }, [comments, openAnchor, html]);

  function closePopover() {
    setOpenAnchor(null);
    setOpenPreview(null);
    setPopoverPos(null);
    setDraft("");
    setEditingId(null);
    setReplyingId(null);
  }

  function onContentClick(e: React.MouseEvent) {
    const target = (e.target as HTMLElement).closest("[data-anchor]") as HTMLElement | null;
    if (!target || !contentRef.current?.contains(target)) return;
    const anchor = target.dataset.anchor!;

    if (openAnchor === anchor) {
      closePopover();
      return;
    }

    const preview = (target.tagName === "IMG" ? (target as HTMLImageElement).alt : target.textContent || "").slice(0, 60);
    const wrap = wrapRef.current;
    if (!wrap) return;

    const top = target.offsetTop + target.offsetHeight + 8;
    const maxLeft = Math.max(0, wrap.clientWidth - 360);
    const left = Math.min(target.offsetLeft, maxLeft);

    setOpenAnchor(anchor);
    setOpenPreview(preview);
    setPopoverPos({ top, left });
    setDraft("");
    setEditingId(null);
    setReplyingId(null);
  }

  // 팝오버 바깥 클릭하면 닫기
  useEffect(() => {
    if (!openAnchor) return;
    function onDocMouseDown(e: MouseEvent) {
      const pop = popoverRef.current;
      if (pop && pop.contains(e.target as Node)) return;
      const target = (e.target as HTMLElement).closest?.("[data-anchor]");
      if (target && target instanceof HTMLElement && target.dataset.anchor === openAnchor) return;
      closePopover();
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAnchor]);

  const anchorComments = useMemo(() => {
    const top = comments.filter((c) => c.anchor === openAnchor && !c.parentId);
    return top.map((c) => ({ ...c, replies: comments.filter((r) => r.parentId === c.id) }));
  }, [comments, openAnchor]);

  const allTopComments = useMemo(() => comments.filter((c) => !c.parentId), [comments]);

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
    if (!text || !openAnchor) return;
    if (await post({ text, anchor: openAnchor, anchorPreview: openPreview, parentId: null })) setDraft("");
  }

  async function submitReply(parentId: string) {
    const text = replyDraft.trim();
    if (!text) return;
    if (await post({ text, anchor: openAnchor, anchorPreview: openPreview, parentId })) {
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
      <div ref={wrapRef} style={{ position: "relative" }}>
        <div
          ref={contentRef}
          className="card doc-content"
          style={{ padding: 32, marginBottom: 22 }}
          onClick={onContentClick}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {openAnchor && popoverPos && (
          <div ref={popoverRef} className="doc-popover" style={{ top: popoverPos.top, left: popoverPos.left }}>
            <div className="doc-popover-head">
              <span>&ldquo;{openPreview}&hellip;&rdquo; 부분</span>
              <button onClick={closePopover} aria-label="닫기">✕</button>
            </div>

            {anchorComments.length === 0 && <p className="doc-popover-empty">아직 댓글이 없어요. 첫 댓글을 남겨보세요!</p>}

            {anchorComments.map((c) => (
              <div key={c.id}>
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

            <form onSubmit={submitNew} className="doc-popover-form">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="이 부분에 댓글 남기기…"
                autoFocus
              />
              <button className="btn sm v" type="submit">저장</button>
            </form>
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 8px" }}>전체 댓글 {allTopComments.length}</h3>
        <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--faint)" }}>
          💡 문서 안의 문장이나 이미지를 클릭하면 그 부분에 댓글 쓰는 창이 열려요. 같은 곳을 다시 누르면 닫혀요.
        </p>

        {allTopComments.length === 0 && <p style={{ margin: 0, fontSize: 13, color: "var(--faint)" }}>아직 댓글이 없어요.</p>}

        {allTopComments.map((c) => (
          <div key={c.id} style={{ marginBottom: 4 }}>
            {c.anchorPreview && <div style={{ fontSize: 11.5, color: "var(--violet-ink)", marginTop: 10 }}>&ldquo;{c.anchorPreview}&hellip;&rdquo; 부분</div>}
            <div className="cmt">
              <div className="row">
                <b>{c.author}</b>
                <span className="txt">
                  {c.text}
                  {c.editedAt && <span style={{ color: "var(--faint)" }}> (수정됨)</span>}
                </span>
                <span className="at">{formatAt(c.at)}</span>
              </div>
            </div>
            {comments
              .filter((r) => r.parentId === c.id)
              .map((r) => (
                <div className="cmt reply" key={r.id}>
                  <div className="row">
                    <b>{r.author}</b>
                    <span className="txt">{r.text}</span>
                    <span className="at">{formatAt(r.at)}</span>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </>
  );
}
