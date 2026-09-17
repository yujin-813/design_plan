"use client";
import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/Logo";
import AuthBrandPanel from "@/components/AuthBrandPanel";
import { cohorts } from "@/lib/curriculum";

export default function SignupPage() {
  const openCohorts = cohorts.filter((c) => c.open);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [cohortId, setCohortId] = useState(openCohorts[0]?.id ?? "");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: pw, phone, cohortId }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErr(data?.error || "가입에 실패했어요.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="authsplit">
        <AuthBrandPanel />
        <div className="authpanel">
          <div className="card authcard">
            <Logo size={46} />
            <h1 style={{ marginTop: 18 }}>가입 신청이 접수됐어요</h1>
            <p className="sub">
              운영팀이 수강생 명단과 대조한 뒤 승인해드립니다. 승인되면 바로 과정 자료와 일정을 보실 수 있어요.
            </p>
            <div className="signup-done">
              <div><span>신청 과정</span><b>{openCohorts.find((c) => c.id === cohortId)?.label}</b></div>
              <div><span>이메일</span><b>{email}</b></div>
              <div><span>상태</span><b style={{ color: "var(--warm-ink)" }}>승인 대기</b></div>
            </div>
            <Link className="btn v" style={{ width: "100%" }} href="/login">로그인 화면으로</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="authsplit">
      <AuthBrandPanel />
      <div className="authpanel">
        <form className="card authcard" onSubmit={onSubmit}>
          <Logo size={46} />
          <h1 style={{ marginTop: 18 }}>수강생 가입</h1>
          <p className="sub">과정과 기수를 선택해 신청하면 운영팀 승인 후 이용할 수 있어요.</p>
          {err && <div className="err">{err}</div>}

          <div className="field">
            <label>신청 과정 · 기수</label>
            <div className="cohort-pick">
              {openCohorts.map((c) => (
                <label key={c.id} className={"cohort-opt" + (cohortId === c.id ? " on" : "")}>
                  <input
                    type="radio"
                    name="cohort"
                    value={c.id}
                    checked={cohortId === c.id}
                    onChange={() => setCohortId(c.id)}
                  />
                  <span>
                    <b>{c.label}</b>
                    <small>{c.org} · {c.period}</small>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label>이름</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" required />
          </div>
          <div className="field">
            <label>이메일</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label>연락처 <span style={{ color: "var(--faint)", fontWeight: 400 }}>(선택)</span></label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" />
          </div>
          <div className="field">
            <label>비밀번호</label>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="6자 이상" minLength={6} required />
          </div>

          <button className="btn v" style={{ width: "100%" }} disabled={loading}>
            {loading ? "신청 중…" : "가입 신청하기"}
          </button>
          <p className="note">
            이미 계정이 있으신가요? <Link href="/login" style={{ color: "var(--violet-ink)", fontWeight: 600 }}>로그인</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
