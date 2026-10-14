import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");

export type Submission = {
  id: string;
  programId: string;
  assignment: string;
  fileName: string;
  url: string;
  size: number;
  submittedBy: string;      // 표시용 이름 (서버가 세션에서 채웁니다)
  submittedByEmail: string; // 실제 주인. 이 값이 소유권의 기준입니다.
  cohortId: string | null;  // 제출 당시 기수
  submittedAt: string;
};

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");
}

export function readSubmissions(): Submission[] {
  ensure();
  try {
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function addSubmission(s: Submission) {
  ensure();
  const all = readSubmissions();
  all.unshift(s);
  fs.writeFileSync(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
}
