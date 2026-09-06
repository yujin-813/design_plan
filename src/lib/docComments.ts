import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "doc-comments.json");

export type DocComment = {
  id: string;
  anchor: string | null;
  anchorPreview: string | null;
  parentId: string | null;
  author: string;
  text: string;
  at: string;
  editedAt?: string;
};

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "{}", "utf-8");
}

function readAll(): Record<string, DocComment[]> {
  ensure();
  try {
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    // 예전 데이터({author,text,at}만 있던 것)를 새 스키마로 보정
    const normalized: Record<string, DocComment[]> = {};
    for (const slug of Object.keys(raw)) {
      normalized[slug] = (raw[slug] as any[]).map((c, i) => ({
        id: c.id ?? `legacy-${slug}-${i}`,
        anchor: c.anchor ?? null,
        anchorPreview: c.anchorPreview ?? null,
        parentId: c.parentId ?? null,
        author: c.author,
        text: c.text,
        at: c.at,
        editedAt: c.editedAt,
      }));
    }
    return normalized;
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, DocComment[]>) {
  ensure();
  fs.writeFileSync(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
}

export function getDocComments(slug: string): DocComment[] {
  return readAll()[slug] ?? [];
}

export function addDocComment(slug: string, c: Omit<DocComment, "id">): DocComment {
  const all = readAll();
  const comment: DocComment = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, ...c };
  all[slug] = [...(all[slug] ?? []), comment];
  writeAll(all);
  return comment;
}

export function updateDocComment(slug: string, id: string, text: string): DocComment | null {
  const all = readAll();
  const list = all[slug] ?? [];
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], text, editedAt: new Date().toISOString() };
  all[slug] = list;
  writeAll(all);
  return list[idx];
}

export function deleteDocComment(slug: string, id: string) {
  const all = readAll();
  const list = all[slug] ?? [];
  const toDelete = new Set([id]);
  list.forEach((c) => {
    if (c.parentId === id) toDelete.add(c.id);
  });
  all[slug] = list.filter((c) => !toDelete.has(c.id));
  writeAll(all);
}
