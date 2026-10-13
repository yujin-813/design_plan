import { seed } from "@/lib/seed";
import { ago, countComments } from "@/lib/comments";
import { listVisible, type Viewer } from "@/lib/content";

// 레터·뉴스 피드. 운영자가 올린 레터·뉴스(content.json의 letter)와
// 큐레이션 시드 뉴스를 하나의 목록으로 합칩니다.
export type FeedItem = {
  id: string;
  /** 태그 색 (globals.css의 tk-*) */
  cat: string;
  /** 태그 문구 */
  tk: string;
  title: string;
  /** 목록에 보여줄 한 줄 */
  summary: string;
  /** 운영자 코멘트 — 운영자가 올린 글에만 있습니다 */
  comment?: string;
  /** 상세 본문 — 시드 뉴스에만 있습니다 */
  body?: string;
  source: string;
  /** 원문 링크 (http/https만) */
  url?: string;
  ago: string;
  comments: number;
};

function safeUrl(url?: string) {
  return url && /^https?:\/\//i.test(url) ? url : undefined;
}

function firstLine(text: string) {
  const line = text.split("\n").find((l) => l.trim()) ?? "";
  return line.length > 80 ? line.slice(0, 80) + "…" : line;
}

export function getFeed(viewer: Viewer): FeedItem[] {
  const authored: FeedItem[] = listVisible("letter", viewer).map((c) => {
    const isLetter = c.category !== "뉴스";
    return {
      id: c.id,
      cat: isLetter ? "letter" : "mkt",
      tk: isLetter ? "레터" : "뉴스",
      title: c.title,
      summary: firstLine(c.body),
      comment: c.body,
      source: c.source || "운영팀",
      url: safeUrl(c.url),
      ago: ago(c.createdAt),
      comments: countComments(`news:${c.id}`),
    };
  });

  const curated: FeedItem[] = seed.news.map((n) => ({
    id: String(n.id),
    cat: n.cat,
    tk: n.tk,
    title: n.title,
    summary: n.summary,
    body: n.body,
    source: n.source,
    ago: n.ago,
    comments: countComments(`news:${n.id}`),
  }));

  return [...authored, ...curated];
}

export function findFeedItem(id: string, viewer: Viewer): FeedItem | null {
  return getFeed(viewer).find((f) => f.id === id) ?? null;
}
