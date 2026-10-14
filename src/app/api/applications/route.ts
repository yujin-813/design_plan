import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, isApproved, viewerOf } from "@/lib/currentUser";
import { canSee, findItem } from "@/lib/content";
import { apply, listForProject, withdraw } from "@/lib/applications";
import { readSubmissions } from "@/lib/submissions";

export const runtime = "nodejs";

// 운영자용 — 한 프로젝트의 지원자와, 판단 근거가 되는 과제 제출 기록
export async function GET(req: NextRequest) {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "운영자만 볼 수 있어요." }, { status: 403 });

  const projectId = new URL(req.url).searchParams.get("projectId");
  if (!projectId) return NextResponse.json({ error: "projectId가 필요합니다." }, { status: 400 });

  const submissions = readSubmissions();
  const applicants = listForProject(projectId).map((a) => ({
    id: a.id,
    name: a.name,
    cohortLabel: a.cohortLabel,
    message: a.message,
    createdAt: a.createdAt,
    submissions: submissions
      .filter((s) => s.submittedByEmail === a.email)
      .map((s) => ({ assignment: s.assignment, fileName: s.fileName, url: s.url, submittedAt: s.submittedAt })),
  }));
  return NextResponse.json({ applicants });
}

export async function POST(req: NextRequest) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  if (user.role === "admin" || !isApproved(user)) {
    return NextResponse.json({ error: "승인된 수강생만 지원할 수 있어요." }, { status: 403 });
  }

  const b = await req.json().catch(() => null);
  const projectId = String(b?.projectId ?? "");
  const message = String(b?.message ?? "").trim();
  if (message.length > 1000) return NextResponse.json({ error: "한마디가 너무 길어요." }, { status: 400 });

  const project = findItem(projectId);
  if (!project || project.kind !== "project" || !canSee(project, viewerOf(user))) {
    return NextResponse.json({ error: "프로젝트를 찾을 수 없어요." }, { status: 404 });
  }
  if (project.closed) return NextResponse.json({ error: "지원이 마감된 프로젝트예요." }, { status: 400 });

  const app = apply({ projectId, name: user.name, email: user.email, cohortLabel: user.cohortLabel, message });
  if (!app) return NextResponse.json({ error: "이미 지원한 프로젝트예요." }, { status: 409 });
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });

  const projectId = new URL(req.url).searchParams.get("projectId");
  if (!projectId) return NextResponse.json({ error: "projectId가 필요합니다." }, { status: 400 });
  if (!withdraw(projectId, user.email)) return NextResponse.json({ error: "지원 내역이 없어요." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
