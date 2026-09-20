import { NextRequest, NextResponse } from "next/server";
import { createMember } from "@/lib/members";
import { findCohort } from "@/lib/curriculum";
import { enroll } from "@/lib/enrollments";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "");
  const phone = String(body?.phone ?? "").trim();
  const cohortId = String(body?.cohortId ?? "");

  if (!name || !email || !password) {
    return NextResponse.json({ error: "이름·이메일·비밀번호를 모두 입력해주세요." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "비밀번호는 6자 이상으로 해주세요." }, { status: 400 });
  }
  const cohort = findCohort(cohortId);
  if (!cohort || !cohort.open) {
    return NextResponse.json({ error: "신청할 과정·기수를 선택해주세요." }, { status: 400 });
  }

  const result = createMember({ name, email, password, phone, cohortId });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 409 });

  // 신청한 기수를 첫 수강 기록으로 남깁니다. (나중에 운영자가 기수를 더 배정할 수 있어요)
  enroll(result.member.email, cohortId);

  return NextResponse.json({ ok: true, member: result.member }, { status: 201 });
}
