import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { getStore, toggle, type SubKind } from "@/lib/subscriptions";

export const runtime = "nodejs";

const KINDS: SubKind[] = ["programs", "events", "publishers"];

export async function GET() {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  return NextResponse.json(getStore(user.email));
}

export async function POST(req: NextRequest) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const kind = String(body?.kind ?? "") as SubKind;
  const id = String(body?.id ?? "");
  if (!KINDS.includes(kind) || !id) {
    return NextResponse.json({ error: "kind와 id가 필요합니다." }, { status: 400 });
  }

  return NextResponse.json(toggle(user.email, kind, id));
}
