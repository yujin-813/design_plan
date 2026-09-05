"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient, supabaseEnabled } from "@/lib/supabase/client";
import Logo from "@/components/Logo";
import AuthBrandPanel from "@/components/AuthBrandPanel";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const supabase = createClient();
    if (!supabase) {
      // 데모 모드: Supabase 미설정 → 바로 홈으로
      router.push("/");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setLoading(false);
    if (error) return setErr(error.message);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="authsplit">
      <AuthBrandPanel />
      <div className="authpanel">
        <form className="card authcard" onSubmit={onSubmit}>
          <Logo size={46} />
          <h1 style={{ marginTop: 18 }}>다시 오신 걸 환영해요</h1>
          <p className="sub">아르키에 로그인하세요.</p>
          {err && <div className="err">{err}</div>}
          <div className="field">
            <label>이메일</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label>비밀번호</label>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" required />
          </div>
          <button className="btn v" style={{ width: "100%" }} disabled={loading}>
            {loading ? "로그인 중…" : "로그인"}
          </button>
          <p className="note">
            계정이 없으신가요? <Link href="/signup" style={{ color: "var(--violet-ink)", fontWeight: 600 }}>회원가입</Link>
          </p>
          {!supabaseEnabled && (
            <span className="demopill">데모 모드 · 아무 값이나 입력하고 로그인하면 홈으로 이동해요.</span>
          )}
        </form>
      </div>
    </div>
  );
}
