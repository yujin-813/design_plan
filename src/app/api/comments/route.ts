import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { addComment, listComments } from "@/lib/comments";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });

  const topicId = new URL(req.url).searchParams.get("topicId");
  if (!topicId) return NextResponse.json({ error: "topicId가 필요합니다." }, { status: 400 });

  return NextResponse.json({ comments: listComments(topicId, user.email) });
}

export async function POST(req: NextRequest) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  if (user.role !== "admin" && user.status !== "approved") {
    return NextResponse.json({ error: "운영팀 승인 후에 댓글을 쓸 수 있어요." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const topicId = String(body?.topicId ?? "");
  const text = String(body?.text ?? "").trim();
  if (!topicId || !text) return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });
  if (text.length > 1000) return NextResponse.json({ error: "댓글이 너무 길어요." }, { status: 400 });

  // 작성자는 클라이언트 값을 받지 않고 세션에서 채웁니다.
  const comment = addComment({
    topicId,
    author: user.name,
    authorEmail: user.email,
    cohort: user.role === "admin" ? "운영팀" : user.cohortLabel,
    text,
  });

  return NextResponse.json({ ok: true, comment }, { status: 201 });
}
