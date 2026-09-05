import { NextRequest, NextResponse } from "next/server";
import { addDocComment, getDocComments } from "@/lib/docComments";

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
  if (!slug || !text) return NextResponse.json({ error: "slug와 text가 필요합니다." }, { status: 400 });

  const comment = { author, text, at: new Date().toISOString() };
  addDocComment(slug, comment);
  return NextResponse.json(comment, { status: 201 });
}
