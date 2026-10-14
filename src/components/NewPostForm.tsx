"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { seed } from "@/lib/seed";

// 글쓰기 — 작성자는 서버가 로그인 세션에서 채웁니다.
const CATEGORIES = seed.categories.filter((c) => c !== "전체");

export default function NewPostForm({ writer = "ok" }: { writer?: "ok" | "guest" | "pending" }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [cat, setCat] = useState(CATEGORIES[0] ?? "자유");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, cat }),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setMsg(j.error ?? "글을 저장하지 못했어요.");
      return;
    }
    setTitle(""); setBody(""); setOpen(false);
    router.refresh();
  }

  // 비회원은 로그인 화면으로, 승인 대기 중이면 안내만 합니다.
  if (writer === "pending") {
    return <span className="pill">운영팀 승인 후 글을 쓸 수 있어요</span>;
  }
  if (writer === "guest") {
    return (
      <a className="btn v" href="/login">
        <svg className="ico" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>로그인하고 글쓰기
      </a>
    );
  }

  if (!open) {
    return (
      <button className="btn v" onClick={() => setOpen(true)}>
        <svg className="ico" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>글쓰기
      </button>
    );
  }
  return (
    <form className="card" style={{ padding: 18, marginBottom: 18, width: "100%" }} onSubmit={submit}>
      {msg && <div className="err">{msg}</div>}
      <div className="field"><label>카테고리</label>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          style={{ padding: "11px 13px", border: "1px solid var(--border-2)", borderRadius: 11, background: "var(--surface)", color: "var(--ink)", font: "inherit", fontSize: 14 }}
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="field"><label>제목</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="무엇이 궁금하세요?" required />
      </div>
      <div className="field"><label>내용</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4}
          style={{ padding: "11px 13px", border: "1px solid var(--border-2)", borderRadius: 11, background: "var(--surface)", color: "var(--ink)", font: "inherit", fontSize: 14, resize: "vertical" }} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn v" disabled={loading}>{loading ? "저장 중…" : "등록"}</button>
        <button type="button" className="btn" onClick={() => setOpen(false)}>취소</button>
      </div>
    </form>
  );
}
