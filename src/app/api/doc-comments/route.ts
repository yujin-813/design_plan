import { NextRequest, NextResponse } from "next/server";
import { addDocComment, deleteDocComment, getDocComments, updateDocComment } from "@/lib/docComments";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug가 필요합니다." }, { status: 400 });
  return NextResponse.json(getDocComments(slug));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const slug = body?.slug;
  const author = String(body?.author ?? "익명") || "익명";
  const text = String(body?.text ?? "").trim();
  const anchor = body?.anchor ? String(body.anchor) : null;
  const anchorPreview = body?.anchorPreview ? String(body.anchorPreview) : null;
  const parentId = body?.parentId ? String(body.parentId) : null;
  if (!slug || !text) return NextResponse.json({ error: "slug와 text가 필요합니다." }, { status: 400 });

  const comment = addDocComment(slug, { anchor, anchorPreview, parentId, author, text, at: new Date().toISOString() });
  return NextResponse.json(comment, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const slug = body?.slug;
  const id = body?.id;
  const text = String(body?.text ?? "").trim();
  if (!slug || !id || !text) return NextResponse.json({ error: "slug, id, text가 필요합니다." }, { status: 400 });

  const updated = updateDocComment(slug, id, text);
  if (!updated) return NextResponse.json({ error: "댓글을 찾을 수 없어요." }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const id = searchParams.get("id");
  if (!slug || !id) return NextResponse.json({ error: "slug와 id가 필요합니다." }, { status: 400 });

  deleteDocComment(slug, id);
  return NextResponse.json({ ok: true });
}
