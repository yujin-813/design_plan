import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { addSubmission, readSubmissions } from "@/lib/submissions";
import { getCurrentUser } from "@/lib/currentUser";

export const runtime = "nodejs";

const MAX_SIZE = 20 * 1024 * 1024; // 20MB

// 과제는 승인된 수강생과 운영자만 다룰 수 있습니다.
function requireApproved() {
  const user = getCurrentUser();
  if (!user) return null;
  if (user.role !== "admin" && user.status !== "approved") return null;
  return user;
}

export async function GET(req: NextRequest) {
  const user = requireApproved();
  if (!user) return NextResponse.json({ error: "승인된 수강생만 볼 수 있어요." }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const programId = searchParams.get("programId");
  const assignment = searchParams.get("assignment");

  let all = readSubmissions();
  if (programId) all = all.filter((s) => s.programId === programId);
  if (assignment) all = all.filter((s) => s.assignment === assignment);

  // 운영자는 전부, 수강생은 자기가 듣는 기수 것만 봅니다.
  // (기수 정보가 없던 예전 제출물은 본인 것만 보이게 둡니다.)
  if (user.role !== "admin") {
    all = all.filter((s) =>
      s.cohortId ? user.cohortIds.includes(s.cohortId) : s.submittedByEmail === user.email
    );
  }

  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const user = requireApproved();
  if (!user) return NextResponse.json({ error: "승인된 수강생만 제출할 수 있어요." }, { status: 403 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const programId = String(form.get("programId") ?? "");
  const assignment = String(form.get("assignment") ?? "");

  if (!file || !programId || !assignment) {
    return NextResponse.json({ error: "파일과 과제 정보가 필요합니다." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "파일은 20MB 이하만 업로드할 수 있어요." }, { status: 400 });
  }

  // 수료한 기수의 과제는 더 받지 않습니다. (수업 공간이 닫혔습니다)
  if (user.role !== "admin" && user.cohortIds.includes(programId) && !user.activeCohortIds.includes(programId)) {
    return NextResponse.json({ error: "수업이 끝나 과제 제출이 닫혔어요." }, { status: 403 });
  }

  const safeProgramId = programId.replace(/[^\w-]/g, "_");
  const safeName = file.name.replace(/[/\\]/g, "_").slice(-120);
  const dir = path.join(process.cwd(), "public", "uploads", safeProgramId);
  fs.mkdirSync(dir, { recursive: true });
  const stamped = `${Date.now()}-${safeName}`;

  const bytes = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, stamped), bytes);

  const submission = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    programId,
    assignment,
    fileName: file.name,
    url: `/uploads/${safeProgramId}/${stamped}`,
    size: file.size,
    // 제출자는 클라이언트 값을 받지 않고 세션에서 채웁니다.
    submittedBy: user.name,
    submittedByEmail: user.email,
    // 내 기수 강의실에서 낸 과제면 그 기수로, 아니면 대표 기수로 기록합니다.
    cohortId: user.cohortIds.includes(programId) ? programId : user.cohortId,
    submittedAt: new Date().toISOString(),
  };
  addSubmission(submission);
  return NextResponse.json(submission, { status: 201 });
}
