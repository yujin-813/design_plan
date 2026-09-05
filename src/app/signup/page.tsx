"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient, supabaseEnabled } from "@/lib/supabase/client";
import Logo from "@/components/Logo";
import AuthBrandPanel from "@/components/AuthBrandPanel";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setMsg("");
    const supabase = createClient();
    if (!supabase) { router.push("/"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password: pw, options: { data: { name } },
    });
    setLoading(false);
    if (error) return setErr(error.message);
    setMsg("가입 완료! 이메일 인증 후 로그인해 주세요.");
  }

  return (
    <div className="authsplit">
      <AuthBrandPanel />
      <div className="authpanel">
        <form className="card authcard" onSubmit={onSubmit}>
          <Logo size={46} />
          <h1 style={{ marginTop: 18 }}>아르키 가입</h1>
          <p className="sub">AI 마케팅 수료생 커뮤니티에 함께하세요.</p>
          {err && <div className="err">{err}</div>}
          {msg && <div className="err" style={{ background: "var(--mint-soft)", color: "var(--mint)" }}>{msg}</div>}
          <div className="field">
            <label>이름</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="유진" required />
          </div>
          <div className="field">
            <label>이메일</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label>비밀번호</label>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="6자 이상" minLength={6} required />
          </div>
          <button className="btn v" style={{ width: "100%" }} disabled={loading}>
            {loading ? "가입 중…" : "가입하기"}
          </button>
          <p className="note">
            이미 계정이 있으신가요? <Link href="/login" style={{ color: "var(--violet-ink)", fontWeight: 600 }}>로그인</Link>
          </p>
          {!supabaseEnabled && <span className="demopill">데모 모드 · 아무 값이나 입력해도 가입이 진행돼요.</span>}
        </form>
      </div>
    </div>
  );
}
