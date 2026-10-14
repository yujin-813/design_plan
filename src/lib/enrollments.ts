import fs from "fs";
import path from "path";
import { cohortPhase, findCohort, type CohortInfo } from "@/lib/curriculum";

// 한 사람이 여러 기수를 들을 수 있습니다. (3기 수강 중 + 1기 수료 같은 경우)
// 예전에는 회원 레코드에 cohortId 하나뿐이라 표현이 안 됐습니다.
const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "enrollments.json");
const MEMBERS_FILE = path.join(DATA_DIR, "members.json");

/** 수강 상태. 보통은 기수 기간으로 자동 판단하고, override 로 손수 바꿀 수 있습니다. */
export type EnrollmentState = "active" | "completed" | "dropped";

export type Enrollment = {
  email: string;
  cohortId: string;
  /** 비어 있으면 기수 기간으로 자동 판단합니다. */
  override?: EnrollmentState;
  enrolledAt: string;
  updatedAt?: string;
};

export type EnrolledCohort = {
  cohortId: string;
  cohort: CohortInfo;
  state: EnrollmentState;
  /** 운영자가 손수 지정한 상태인지 */
  manual: boolean;
  enrolledAt: string;
};

export const STATE_LABEL: Record<EnrollmentState, string> = {
  active: "수강 중",
  completed: "수료",
  dropped: "중도 종료",
};

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf-8");
}

function readAll(): Enrollment[] {
  ensure();
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writeAll(list: Enrollment[]) {
  ensure();
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2), "utf-8");
}

// 예전 구조(members.json 의 cohortId) 로 가입한 사람을 수강 등록으로 옮깁니다.
// 앱이 처음 이 파일을 읽을 때 한 번만 일어납니다.
function migrateIfNeeded(list: Enrollment[]): Enrollment[] {
  let members: Array<{ email?: string; cohortId?: string; joinedAt?: string }> = [];
  try {
    const raw = JSON.parse(fs.readFileSync(MEMBERS_FILE, "utf-8"));
    members = Array.isArray(raw) ? raw : [];
  } catch {
    return list;
  }

  const have = new Set(list.map((e) => `${e.email}|${e.cohortId}`));
  const added: Enrollment[] = [];
  for (const m of members) {
    if (!m.email || !m.cohortId) continue;
    const key = `${m.email}|${m.cohortId}`;
    if (have.has(key)) continue;
    added.push({
      email: m.email,
      cohortId: m.cohortId,
      enrolledAt: m.joinedAt ?? new Date().toISOString(),
    });
    have.add(key);
  }

  if (added.length === 0) return list;
  const next = [...list, ...added];
  writeAll(next);
  return next;
}

function hydrate(e: Enrollment): EnrolledCohort | null {
  const cohort = findCohort(e.cohortId);
  if (!cohort) return null;

  // 손수 지정한 값이 있으면 그것을, 없으면 기수 기간으로 자동 판단합니다.
  const auto: EnrollmentState = cohortPhase(cohort) === "ended" ? "completed" : "active";
  return {
    cohortId: e.cohortId,
    cohort,
    state: e.override ?? auto,
    manual: Boolean(e.override),
    enrolledAt: e.enrolledAt,
  };
}

/** 이 사람이 듣는 기수들. 최근 시작한 기수가 먼저 옵니다. */
export function listFor(email: string): EnrolledCohort[] {
  const key = email.toLowerCase();
  return migrateIfNeeded(readAll())
    .filter((e) => e.email.toLowerCase() === key)
    .map(hydrate)
    .filter((x): x is EnrolledCohort => x !== null)
    .sort((a, b) => b.cohort.startDate.localeCompare(a.cohort.startDate));
}

export function cohortIdsFor(email: string): string[] {
  return listFor(email).map((e) => e.cohortId);
}

export function enroll(email: string, cohortId: string): boolean {
  if (!findCohort(cohortId)) return false;
  const key = email.toLowerCase();
  const list = migrateIfNeeded(readAll());
  if (list.some((e) => e.email.toLowerCase() === key && e.cohortId === cohortId)) return false;
  list.push({ email: key, cohortId, enrolledAt: new Date().toISOString() });
  writeAll(list);
  return true;
}

export function unenroll(email: string, cohortId: string): boolean {
  const key = email.toLowerCase();
  const list = migrateIfNeeded(readAll());
  const next = list.filter((e) => !(e.email.toLowerCase() === key && e.cohortId === cohortId));
  if (next.length === list.length) return false;
  writeAll(next);
  return true;
}

/** state 가 null 이면 자동 판단으로 되돌립니다. */
export function setState(email: string, cohortId: string, state: EnrollmentState | null): boolean {
  const key = email.toLowerCase();
  const list = migrateIfNeeded(readAll());
  const i = list.findIndex((e) => e.email.toLowerCase() === key && e.cohortId === cohortId);
  if (i < 0) return false;
  const next = { ...list[i], updatedAt: new Date().toISOString() };
  if (state) next.override = state;
  else delete next.override;
  list[i] = next;
  writeAll(list);
  return true;
}

/** 회원을 삭제할 때 수강 기록도 같이 지웁니다. */
export function removeAllFor(email: string) {
  const key = email.toLowerCase();
  const list = migrateIfNeeded(readAll());
  const next = list.filter((e) => e.email.toLowerCase() !== key);
  if (next.length !== list.length) writeAll(next);
}
