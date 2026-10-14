import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, isApproved, viewerOf } from "@/lib/currentUser";
import { canSee, findItem } from "@/lib/content";
import { seed } from "@/lib/seed";
import { countByEvent, signedUpEventIds, toggleSignup } from "@/lib/eventSignups";

export const runtime = "nodejs";

// 내가 신청한 이벤트 (운영자에게는 이벤트별 신청 인원도)
export async function GET() {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ mine: [], counts: {} });
  return NextResponse.json({
    mine: signedUpEventIds(user.email),
    counts: user.role === "admin" ? countByEvent() : {},
  });
}

// 신청 / 취소
export async function POST(req: NextRequest) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  if (user.role === "admin" || !isApproved(user)) {
    return NextResponse.json({ error: "승인된 수강생만 신청할 수 있어요." }, { status: 403 });
  }

  const b = await req.json().catch(() => null);
  const eventId = String(b?.eventId ?? "");
  const authored = findItem(eventId);
  const exists =
    seed.events.some((e) => e.id === eventId) ||
    (authored?.kind === "event" && canSee(authored, viewerOf(user)));
  if (!exists) return NextResponse.json({ error: "이벤트를 찾을 수 없어요." }, { status: 404 });

  const on = toggleSignup({ eventId, email: user.email, name: user.name, cohortLabel: user.cohortLabel });
  return NextResponse.json({ ok: true, on });
}
