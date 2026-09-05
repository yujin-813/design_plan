import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "doc-comments.json");

export type DocComment = { author: string; text: string; at: string };

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "{}", "utf-8");
}

function readAll(): Record<string, DocComment[]> {
  ensure();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return {};
  }
}

export function getDocComments(slug: string): DocComment[] {
  return readAll()[slug] ?? [];
}

export function addDocComment(slug: string, c: DocComment) {
  const all = readAll();
  all[slug] = [...(all[slug] ?? []), c];
  ensure();
  fs.writeFileSync(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
}
