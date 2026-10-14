import fs from "fs";
import path from "path";

// 운영자가 직접 작성하는 콘텐츠(공지·자료·과제·이벤트·레터·프로젝트)를 한 파일에 모아둡니다.
// 예전에는 전부 seed.ts 코드에 박혀 있어서 개발자만 바꿀 수 있었습니다.
const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "content.json");

export type ContentKind = "notice" | "material" | "assignment" | "event" | "letter" | "project";

// 누구에게 보일지. 전체 공개이거나, 특정 기수 전용입니다.
export type Scope = { type: "all" } | { type: "cohort"; cohortId: string };

export type ContentItem = {
  id: string;
  kind: ContentKind;
  scope: Scope;
  title: string;
  body: string;
  /** 공지 분류 (notice 전용) */
  category?: string;
  /** 상단 고정 (notice 전용) */
  pinned?: boolean;
  /** 과제 마감일·이벤트 일시 등 화면에 그대로 보여줄 문구 */
  dueLabel?: string;
  /** 자료 링크(material) · 원문 링크(letter) */
  url?: string;
  /** 출처 — 레터·매체 이름 (letter 전용) */
  source?: string;
  /** 지원 마감 (project 전용) */
  closed?: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
};

export const CONTENT_KINDS: ContentKind[] = ["notice", "material", "assignment", "event", "letter", "project"];

export const KIND_LABEL: Record<ContentKind, string> = {
  notice: "공지",
  material: "자료",
  assignment: "과제",
  event: "이벤트",
  letter: "레터·뉴스",
  project: "프로젝트",
};

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf-8");
}

function readAll(): ContentItem[] {
  ensure();
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writeAll(list: ContentItem[]) {
  ensure();
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2), "utf-8");
}

/** 운영자용 — 범위 상관없이 전부, 최신순 */
export function listAll(kind?: ContentKind): ContentItem[] {
  const all = readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return kind ? all.filter((c) => c.kind === kind) : all;
}

/**
 * 콘텐츠를 볼 사람. 듣는 기수가 여러 개일 수 있습니다.
 * activeCohortIds 는 지금 수강 중인 기수 — 없으면 cohortIds 를 그대로 씁니다.
 */
export type Viewer = { role: string; cohortIds: string[]; activeCohortIds?: string[] };

/** 수업 공간 콘텐츠. 수료하면 그 기수 전용 항목은 닫힙니다. */
const CLASS_KINDS: ContentKind[] = ["notice", "material", "assignment"];

/** 이 사람에게 보여도 되는가 */
export function canSee(item: ContentItem, viewer: Viewer) {
  if (viewer.role === "admin") return true;
  if (item.scope.type === "all") return true;
  const ids = CLASS_KINDS.includes(item.kind) ? viewer.activeCohortIds ?? viewer.cohortIds : viewer.cohortIds;
  return ids.includes(item.scope.cohortId);
}

/** 수강생용 — 전체 공개 + 내 기수 것만, 최신순 */
export function listVisible(kind: ContentKind, viewer: Viewer): ContentItem[] {
  return readAll()
    .filter((c) => c.kind === kind && canSee(c, viewer))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** 특정 기수 전용이면 기수 id, 전체 공개면 null */
export function cohortIdOf(scope: Scope): string | null {
  return scope.type === "cohort" ? scope.cohortId : null;
}

export function findItem(id: string): ContentItem | null {
  return readAll().find((c) => c.id === id) ?? null;
}

export function createItem(
  input: Omit<ContentItem, "id" | "createdAt" | "updatedAt">
): ContentItem {
  const item: ContentItem = {
    ...input,
    id: `c${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const all = readAll();
  all.unshift(item);
  writeAll(all);
  return item;
}

export function updateItem(
  id: string,
  patch: Partial<Omit<ContentItem, "id" | "kind" | "createdBy" | "createdAt">>
): ContentItem | null {
  const all = readAll();
  const i = all.findIndex((c) => c.id === id);
  if (i < 0) return null;
  all[i] = { ...all[i], ...patch, updatedAt: new Date().toISOString() };
  writeAll(all);
  return all[i];
}

export function deleteItem(id: string): boolean {
  const all = readAll();
  const next = all.filter((c) => c.id !== id);
  if (next.length === all.length) return false;
  writeAll(next);
  return true;
}

/** "2026-09-21T..." → "09.21" (기존 시드 데이터 표기와 맞춥니다) */
export function shortDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}
