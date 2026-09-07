import { NextRequest, NextResponse } from "next/server";
import { checkCredentials, SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "");
  const password = String(body?.password ?? "");

  if (!checkCredentials(email, password)) {
    return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않아요." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
