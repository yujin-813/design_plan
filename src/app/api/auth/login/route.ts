import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, createSessionValue, isAdminCredentials } from "@/lib/auth";
import { findByEmail, verifyPassword } from "@/lib/members";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  // 1) 운영자 계정
  if (isAdminCredentials(email, password)) {
    const res = NextResponse.json({ ok: true, role: "admin", status: "approved" });
    res.cookies.set(SESSION_COOKIE, createSessionValue({ email, role: "admin" }), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  // 2) 가입 회원
  const member = findByEmail(email);
  if (!member || !verifyPassword(password, member.passwordHash)) {
    return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않아요." }, { status: 401 });
  }
  if (member.status === "rejected") {
    return NextResponse.json({ error: "가입이 반려된 계정이에요. 운영팀에 문의해주세요." }, { status: 403 });
  }

  // 승인 대기 상태여도 로그인은 되고, 안내 화면만 보이게 합니다.
  const res = NextResponse.json({ ok: true, role: member.role, status: member.status });
  res.cookies.set(SESSION_COOKIE, createSessionValue({ email: member.email, role: member.role }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
