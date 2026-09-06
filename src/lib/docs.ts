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

// 클릭해서 댓글을 달 수 있도록 각 블록 태그에 data-anchor를 미리 심어둡니다.
// (클라이언트에서 나중에 DOM을 조작하면 리렌더 시 innerHTML이 다시 쓰이며 사라질 수 있어
//  문자열 단계에서 아예 박아넣는 방식이 안전합니다.)
export function annotateHtmlForComments(html: string): string {
  let i = 0;
  return html.replace(/<(h1|h2|h3|p|li|img)((?:\s+[^>]*)?)>/gi, (_m, tag, attrs) => {
    const anchor = `b${i++}`;
    return `<${tag}${attrs} data-anchor="${anchor}" class="commentable">`;
  });
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
