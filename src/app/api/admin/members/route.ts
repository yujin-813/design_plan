import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { counts, decideMember, findById, listMembers, removeMember } from "@/lib/members";
import { removeStore } from "@/lib/subscriptions";
import { removeAllFor } from "@/lib/enrollments";

export const runtime = "nodejs";

function requireAdmin() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET() {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "운영자만 볼 수 있어요." }, { status: 403 });
  return NextResponse.json({ members: listMembers(), counts: counts() });
}

export async function PATCH(req: NextRequest) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "운영자만 변경할 수 있어요." }, { status: 403 });

  const body = await req.json().catch(() => null);
  const id = String(body?.id ?? "");
  const status = String(body?.status ?? "");
  if (!id || (status !== "approved" && status !== "rejected" && status !== "pending")) {
    return NextResponse.json({ error: "id와 status가 필요합니다." }, { status: 400 });
  }

  const updated = decideMember(id, status, admin.name);
  if (!updated) return NextResponse.json({ error: "가입자를 찾을 수 없어요." }, { status: 404 });
  return NextResponse.json({ ok: true, member: updated, counts: counts() });
}

export async function DELETE(req: NextRequest) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "운영자만 삭제할 수 있어요." }, { status: 403 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id가 필요합니다." }, { status: 400 });

  const target = findById(id);
  if (!target || !removeMember(id)) {
    return NextResponse.json({ error: "가입자를 찾을 수 없어요." }, { status: 404 });
  }
  // 회원이 사라지면 구독·수강 기록도 남겨둘 이유가 없습니다.
  removeStore(target.email);
  removeAllFor(target.email);

  return NextResponse.json({ ok: true, counts: counts() });
}
