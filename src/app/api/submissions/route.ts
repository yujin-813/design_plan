import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { addSubmission, readSubmissions } from "@/lib/submissions";

export const runtime = "nodejs";

const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const programId = searchParams.get("programId");
  const assignment = searchParams.get("assignment");
  let all = readSubmissions();
  if (programId) all = all.filter((s) => s.programId === programId);
  if (assignment) all = all.filter((s) => s.assignment === assignment);
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const programId = String(form.get("programId") ?? "");
  const assignment = String(form.get("assignment") ?? "");
  const submittedBy = String(form.get("submittedBy") ?? "익명") || "익명";

  if (!file || !programId || !assignment) {
    return NextResponse.json({ error: "파일과 과제 정보가 필요합니다." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "파일은 20MB 이하만 업로드할 수 있어요." }, { status: 400 });
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
    submittedBy,
    submittedAt: new Date().toISOString(),
  };
  addSubmission(submission);
  return NextResponse.json(submission, { status: 201 });
}
