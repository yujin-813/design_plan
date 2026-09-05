import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

export const docs = [
  { slug: "arki-spec", title: "아르키 기획서", desc: "전체 페이지 구조와 기능을 정리한 서비스 기획 문서" },
];

function docPath(slug: string) {
  return path.join(process.cwd(), "src", "content", "docs", `${slug}.html`);
}

export function getDocContent(slug: string): string | null {
  const p = docPath(slug);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, "utf-8");
}

export type DocRevision = { hash: string; date: string; message: string };

export function getDocHistory(slug: string): DocRevision[] {
  const relPath = path.join("src", "content", "docs", `${slug}.html`);
  try {
    const out = execFileSync("git", ["log", "--follow", "--format=%H|%ad|%s", "--date=format:%Y.%m.%d %H:%M", "--", relPath], {
      cwd: process.cwd(),
      encoding: "utf-8",
    });
    return out
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [hash, date, ...rest] = line.split("|");
        return { hash, date, message: rest.join("|") };
      });
  } catch {
    return [];
  }
}

export function getDocRevisionContent(slug: string, hash: string): string | null {
  const relPath = path.join("src", "content", "docs", `${slug}.html`);
  try {
    return execFileSync("git", ["show", `${hash}:${relPath}`], { cwd: process.cwd(), encoding: "utf-8" });
  } catch {
    return null;
  }
}
