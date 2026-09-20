import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { addPost } from "@/lib/posts";
import { seed } from "@/lib/seed";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  if (user.role !== "admin" && user.status !== "approved") {
    return NextResponse.json({ error: "운영팀 승인 후에 글을 쓸 수 있어요." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const title = String(body?.title ?? "").trim();
  const text = String(body?.body ?? "").trim();
  const catInput = String(body?.cat ?? "자유");
  // 카테고리는 정해진 목록 안에서만 받습니다. ("전체"는 필터용이라 제외)
  const cat = seed.categories.includes(catInput) && catInput !== "전체" ? catInput : "자유";

  if (!title) return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });

  const post = addPost({
    author: user.name,
    authorEmail: user.email,
    cohort: user.role === "admin" ? "운영팀" : user.cohortLabel,
    cat,
    title,
    body: text,
  });

  return NextResponse.json({ ok: true, post }, { status: 201 });
}
