"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pw }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErr(data?.error || "로그인에 실패했어요.");
      return;
    }
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
        </form>
      </div>
    </div>
  );
}
