import fs from "fs";
import path from "path";

// 이벤트 신청. 이벤트 하나에 한 사람이 한 번만 신청합니다.
const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "event-signups.json");

export type EventSignup = { eventId: string; email: string; name: string; cohortLabel: string; createdAt: string };

function readAll(): EventSignup[] {
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writeAll(list: EventSignup[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2), "utf-8");
}

export function signedUpEventIds(email: string): string[] {
  return readAll().filter((s) => s.email === email).map((s) => s.eventId);
}

export function countByEvent(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const s of readAll()) counts[s.eventId] = (counts[s.eventId] ?? 0) + 1;
  return counts;
}

/** 신청과 취소를 오갑니다. 신청된 상태가 되면 true */
export function toggleSignup(input: Omit<EventSignup, "createdAt">): boolean {
  const all = readAll();
  const i = all.findIndex((s) => s.eventId === input.eventId && s.email === input.email);
  if (i >= 0) {
    all.splice(i, 1);
    writeAll(all);
    return false;
  }
  all.push({ ...input, createdAt: new Date().toISOString() });
  writeAll(all);
  return true;
}
