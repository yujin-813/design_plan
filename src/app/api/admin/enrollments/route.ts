import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { findByEmail } from "@/lib/members";
import { enroll, listFor, setState, unenroll, type EnrollmentState } from "@/lib/enrollments";

export const runtime = "nodejs";

const STATES: EnrollmentState[] = ["active", "completed", "dropped"];

function requireAdmin() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

/** 화면에 돌려줄 형태 (CohortInfo 통째로 보내지 않습니다) */
function viewFor(email: string) {
  return listFor(email).map((e) => ({
    cohortId: e.cohortId,
    label: e.cohort.label,
    course: e.cohort.course,
    period: e.cohort.period,
    state: e.state,
    manual: e.manual,
  }));
}

export async function GET(req: NextRequest) {
  if (!requireAdmin()) return NextResponse.json({ error: "운영자만 볼 수 있어요." }, { status: 403 });
  const email = new URL(req.url).searchParams.get("email");
  if (!email) return NextResponse.json({ error: "email이 필요합니다." }, { status: 400 });
  return NextResponse.json({ enrollments: viewFor(email) });
}

/** 수강 기수 배정 */
export async function POST(req: NextRequest) {
  if (!requireAdmin()) return NextResponse.json({ error: "운영자만 배정할 수 있어요." }, { status: 403 });

  const b = await req.json().catch(() => null);
  const email = String(b?.email ?? "").trim().toLowerCase();
  const cohortId = String(b?.cohortId ?? "");
  if (!email || !cohortId) return NextResponse.json({ error: "email과 cohortId가 필요합니다." }, { status: 400 });
  if (!findByEmail(email)) return NextResponse.json({ error: "가입자를 찾을 수 없어요." }, { status: 404 });

  if (!enroll(email, cohortId)) {
    return NextResponse.json({ error: "이미 배정됐거나 없는 기수예요." }, { status: 409 });
  }
  return NextResponse.json({ ok: true, enrollments: viewFor(email) }, { status: 201 });
}

/** 수강 상태 변경. state 를 비우면 기수 기간 기준 자동 판단으로 되돌립니다. */
export async function PATCH(req: NextRequest) {
  if (!requireAdmin()) return NextResponse.json({ error: "운영자만 변경할 수 있어요." }, { status: 403 });

  const b = await req.json().catch(() => null);
  const email = String(b?.email ?? "").trim().toLowerCase();
  const cohortId = String(b?.cohortId ?? "");
  const raw = b?.state;
  const state = raw === null || raw === "" || raw === undefined ? null : (String(raw) as EnrollmentState);

  if (!email || !cohortId) return NextResponse.json({ error: "email과 cohortId가 필요합니다." }, { status: 400 });
  if (state !== null && !STATES.includes(state)) {
    return NextResponse.json({ error: "상태 값이 올바르지 않아요." }, { status: 400 });
  }
  if (!setState(email, cohortId, state)) {
    return NextResponse.json({ error: "수강 기록을 찾을 수 없어요." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, enrollments: viewFor(email) });
}

/** 수강 기수 배정 해제 */
export async function DELETE(req: NextRequest) {
  if (!requireAdmin()) return NextResponse.json({ error: "운영자만 해제할 수 있어요." }, { status: 403 });

  const url = new URL(req.url);
  const email = (url.searchParams.get("email") ?? "").trim().toLowerCase();
  const cohortId = url.searchParams.get("cohortId") ?? "";
  if (!email || !cohortId) return NextResponse.json({ error: "email과 cohortId가 필요합니다." }, { status: 400 });
  if (!unenroll(email, cohortId)) {
    return NextResponse.json({ error: "수강 기록을 찾을 수 없어요." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, enrollments: viewFor(email) });
}
