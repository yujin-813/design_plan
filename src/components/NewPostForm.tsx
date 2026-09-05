"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient, supabaseEnabled } from "@/lib/supabase/client";

export default function NewPostForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const supabase = createClient();
    if (!supabase) {
      setMsg("데모 모드입니다 — Supabase를 연결하면 실제로 저장됩니다.");
      return;
    }
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) { setMsg("로그인이 필요합니다."); return; }
    setLoading(true);
    const { error } = await supabase.from("posts").insert({ title, body, author_id: auth.user.id });
    setLoading(false);
    if (error) { setMsg(error.message); return; }
    setTitle(""); setBody(""); setOpen(false);
    router.refresh();
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
