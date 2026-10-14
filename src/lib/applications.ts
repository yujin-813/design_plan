import fs from "fs";
import path from "path";

// 운영자가 올린 프로젝트(content.json의 project)에 수료생이 낸 지원서.
const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "applications.json");

export type Application = {
  id: string;
  projectId: string;
  name: string;
  /** 지원자 본인. 소유권의 기준입니다. */
  email: string;
  cohortLabel: string;
  message: string;
  createdAt: string;
};

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf-8");
}

function readAll(): Application[] {
  ensure();
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writeAll(list: Application[]) {
  ensure();
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2), "utf-8");
}

/** 운영자용 — 한 프로젝트의 지원자, 먼저 지원한 순 */
export function listForProject(projectId: string): Application[] {
  return readAll()
    .filter((a) => a.projectId === projectId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/** 내가 낸 지원서 전부 */
export function listByEmail(email: string): Application[] {
  return readAll().filter((a) => a.email === email);
}

/** 내가 지원한 프로젝트 id 목록 */
export function appliedProjectIds(email: string): string[] {
  return readAll().filter((a) => a.email === email).map((a) => a.projectId);
}

export function countByProject(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const a of readAll()) counts[a.projectId] = (counts[a.projectId] ?? 0) + 1;
  return counts;
}

/** 같은 프로젝트에 두 번 지원하면 null */
export function apply(input: Omit<Application, "id" | "createdAt">): Application | null {
  const all = readAll();
  if (all.some((a) => a.projectId === input.projectId && a.email === input.email)) return null;
  const app: Application = {
    ...input,
    id: `a${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  all.push(app);
  writeAll(all);
  return app;
}

/** 본인 지원 취소 */
export function withdraw(projectId: string, email: string): boolean {
  const all = readAll();
  const next = all.filter((a) => !(a.projectId === projectId && a.email === email));
  if (next.length === all.length) return false;
  writeAll(next);
  return true;
}
