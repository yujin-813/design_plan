import { NextRequest, NextResponse } from "next/server";
import { canJoinCohortChat, getCurrentUser, type CurrentUser } from "@/lib/currentUser";
import { addComment, listComments } from "@/lib/comments";

export const runtime = "nodejs";

// 동기 대화방(cohort:<기수 id>)은 그 기수 사람과 운영자만 읽고 쓸 수 있습니다.
function blockedFromTopic(user: CurrentUser, topicId: string) {
  if (!topicId.startsWith("cohort:")) return false;
  return !canJoinCohortChat(user, topicId.slice("cohort:".length));
}

export async function GET(req: NextRequest) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });

  const topicId = new URL(req.url).searchParams.get("topicId");
  if (!topicId) return NextResponse.json({ error: "topicId가 필요합니다." }, { status: 400 });
  if (blockedFromTopic(user, topicId)) return NextResponse.json({ error: "이 대화방에 들어갈 수 없어요." }, { status: 403 });

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
  if (blockedFromTopic(user, topicId)) return NextResponse.json({ error: "이 대화방에 들어갈 수 없어요." }, { status: 403 });
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
