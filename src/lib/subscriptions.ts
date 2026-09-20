import fs from "fs";
import path from "path";

// 구독 정보는 계정(이메일) 단위로 서버에 저장합니다.
// 예전에는 브라우저 localStorage에 있어서 기기를 바꾸면 사라졌습니다.
const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "subscriptions.json");

export type SubKind = "programs" | "events" | "publishers";
export type SubStore = { programs: string[]; events: string[]; publishers: string[] };

export const EMPTY: SubStore = { programs: [], events: [], publishers: [] };

type AllStores = Record<string, SubStore>;

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "{}", "utf-8");
}

function readAll(): AllStores {
  ensure();
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  } catch {
    return {};
  }
}

function writeAll(all: AllStores) {
  ensure();
  fs.writeFileSync(FILE, JSON.stringify(all, null, 2), "utf-8");
}

function normalize(s: Partial<SubStore> | undefined): SubStore {
  return {
    programs: Array.isArray(s?.programs) ? s!.programs : [],
    events: Array.isArray(s?.events) ? s!.events : [],
    publishers: Array.isArray(s?.publishers) ? s!.publishers : [],
  };
}

export function getStore(email: string): SubStore {
  return normalize(readAll()[email.toLowerCase()]);
}

export function toggle(email: string, kind: SubKind, id: string): SubStore {
  const key = email.toLowerCase();
  const all = readAll();
  const store = normalize(all[key]);
  const set = new Set(store[kind]);
  if (set.has(id)) set.delete(id);
  else set.add(id);
  const next = { ...store, [kind]: [...set] };
  all[key] = next;
  writeAll(all);
  return next;
}

// 회원을 삭제할 때 구독 기록도 같이 지웁니다.
export function removeStore(email: string) {
  const all = readAll();
  if (!(email.toLowerCase() in all)) return;
  delete all[email.toLowerCase()];
  writeAll(all);
}
