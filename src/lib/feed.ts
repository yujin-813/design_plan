import { ago, countComments } from "@/lib/comments";
import { listVisible, type Viewer } from "@/lib/content";
import { getAitimesArticles } from "@/lib/rss";

// 레터·뉴스 피드. 운영자가 올린 레터·뉴스(content.json의 letter)와
// AI타임스 RSS 기사를 하나의 목록으로 합쳐 최신순으로 보여줍니다.
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
  /** 상세 본문 — RSS 기사는 매체가 제공한 요약 일부만 보여주고 원문으로 연결합니다 */
  body?: string;
  source: string;
  /** 원문 링크 (http/https만) */
  url?: string;
  ago: string;
  /** 정렬용 ISO 시각 */
  at: string;
  comments: number;
};

function safeUrl(url?: string) {
  return url && /^https?:\/\//i.test(url) ? url : undefined;
}

function clip(text: string, n: number) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}

function firstLine(text: string) {
  return clip(text.split("\n").find((l) => l.trim()) ?? "", 80);
}

export async function getFeed(viewer: Viewer): Promise<FeedItem[]> {
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
      at: c.createdAt,
      comments: countComments(`news:${c.id}`),
    };
  });

  const articles: FeedItem[] = (await getAitimesArticles()).map((a) => {
    const id = `ait-${a.id}`;
    return {
      id,
      cat: "model",
      tk: "뉴스",
      title: a.title,
      summary: clip(a.summary, 80),
      body: clip(a.summary, 200),
      source: a.author ? `AI타임스 · ${a.author}` : "AI타임스",
      url: a.link,
      ago: ago(a.publishedAt),
      at: a.publishedAt,
      comments: countComments(`news:${id}`),
    };
  });

  return [...authored, ...articles].sort((a, b) => b.at.localeCompare(a.at));
}

export async function findFeedItem(id: string, viewer: Viewer): Promise<FeedItem | null> {
  return (await getFeed(viewer)).find((f) => f.id === id) ?? null;
}
