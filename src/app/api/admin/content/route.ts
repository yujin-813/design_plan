import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import {
  CONTENT_KINDS,
  createItem,
  deleteItem,
  listAll,
  updateItem,
  type ContentKind,
  type Scope,
} from "@/lib/content";
import { findCohort } from "@/lib/curriculum";

export const runtime = "nodejs";

function requireAdmin() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

// 대상 범위를 검증합니다. 존재하지 않는 기수는 받지 않습니다.
function parseScope(raw: unknown): Scope | null {
  const s = raw as { type?: string; cohortId?: string } | null;
  if (!s || s.type === "all") return { type: "all" };
  if (s.type === "cohort") {
    const id = String(s.cohortId ?? "");
    if (!findCohort(id)) return null;
    return { type: "cohort", cohortId: id };
  }
  return null;
}

export async function GET(req: NextRequest) {
  if (!requireAdmin()) return NextResponse.json({ error: "운영자만 볼 수 있어요." }, { status: 403 });
  const kind = new URL(req.url).searchParams.get("kind") as ContentKind | null;
  const valid = kind && CONTENT_KINDS.includes(kind) ? kind : undefined;
  return NextResponse.json({ items: listAll(valid) });
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "운영자만 작성할 수 있어요." }, { status: 403 });

  const b = await req.json().catch(() => null);
  const kind = String(b?.kind ?? "") as ContentKind;
  if (!CONTENT_KINDS.includes(kind)) {
    return NextResponse.json({ error: "종류(kind)가 올바르지 않아요." }, { status: 400 });
  }

  const scope = parseScope(b?.scope);
  if (!scope) return NextResponse.json({ error: "대상 기수가 올바르지 않아요." }, { status: 400 });

  const title = String(b?.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });

  const item = createItem({
    kind,
    scope,
    title,
    body: String(b?.body ?? "").trim(),
    category: b?.category ? String(b.category) : undefined,
    pinned: Boolean(b?.pinned),
    dueLabel: b?.dueLabel ? String(b.dueLabel).trim() : undefined,
    url: b?.url ? String(b.url).trim() : undefined,
    createdBy: admin.name,
  });

  return NextResponse.json({ ok: true, item }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  if (!requireAdmin()) return NextResponse.json({ error: "운영자만 수정할 수 있어요." }, { status: 403 });

  const b = await req.json().catch(() => null);
  const id = String(b?.id ?? "");
  if (!id) return NextResponse.json({ error: "id가 필요합니다." }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (b?.scope !== undefined) {
    const scope = parseScope(b.scope);
    if (!scope) return NextResponse.json({ error: "대상 기수가 올바르지 않아요." }, { status: 400 });
    patch.scope = scope;
  }
  if (b?.title !== undefined) {
    const title = String(b.title).trim();
    if (!title) return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });
    patch.title = title;
  }
  if (b?.body !== undefined) patch.body = String(b.body).trim();
  if (b?.category !== undefined) patch.category = String(b.category);
  if (b?.pinned !== undefined) patch.pinned = Boolean(b.pinned);
  if (b?.dueLabel !== undefined) patch.dueLabel = String(b.dueLabel).trim();
  if (b?.url !== undefined) patch.url = String(b.url).trim();

  const item = updateItem(id, patch);
  if (!item) return NextResponse.json({ error: "항목을 찾을 수 없어요." }, { status: 404 });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(req: NextRequest) {
  if (!requireAdmin()) return NextResponse.json({ error: "운영자만 삭제할 수 있어요." }, { status: 403 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id가 필요합니다." }, { status: 400 });
  if (!deleteItem(id)) return NextResponse.json({ error: "항목을 찾을 수 없어요." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
