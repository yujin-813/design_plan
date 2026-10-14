import { findPublisher, type Publisher } from "@/lib/publishers";

// 매체 RSS에서 최신 기사를 가져옵니다.
// 30분 동안은 Next.js 캐시를 쓰고, 실패하면 빈 목록을 돌려 화면이 깨지지 않게 합니다.
const REVALIDATE_SECONDS = 30 * 60;

export type RssArticle = {
  /** 매체 안에서 기사를 구분하는 값 (기사 번호 또는 링크 해시) */
  id: string;
  publisherId: string;
  publisherName: string;
  title: string;
  link: string;
  summary: string;
  author: string;
  /** ISO 시각 */
  publishedAt: string;
};

function decode(text: string) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;|&#8217;|&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8230;|&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(item: string, name: string) {
  const m = item.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : "";
}

// 국내 매체 CMS는 "2026-10-14 11:58:29"(한국 시간)로, 워드프레스는 RFC 822 형식으로 줍니다.
function toIso(pubDate: string) {
  const m = pubDate.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/);
  const d = m ? new Date(`${m[1]}T${m[2]}+09:00`) : new Date(pubDate);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

// 링크로 안정적인 짧은 id를 만듭니다. (기사 번호가 없는 매체용)
function hash(text: string) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

export function parseRss(xml: string, pub: Publisher): RssArticle[] {
  const host = new URL(pub.rss).hostname.replace(/^(www|rss)\./, "");
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/g) ?? [];
  return items.flatMap((item) => {
    const link = tag(item, "link");
    const title = tag(item, "title");
    let linkHost = "";
    try {
      linkHost = new URL(link).hostname;
    } catch {
      return [];
    }
    // 그 매체 도메인의 http(s) 링크만 받습니다.
    if (!title || !/^https?:\/\//.test(link) || !linkHost.endsWith(host)) return [];
    const id = link.match(/idxno=(\d+)/)?.[1] ?? hash(link);
    return [{
      id,
      publisherId: pub.id,
      publisherName: pub.name,
      title,
      link,
      summary: tag(item, "description"),
      author: tag(item, "author") || tag(item, "dc:creator"),
      publishedAt: toIso(tag(item, "pubDate")),
    }];
  });
}

export async function getArticles(publisherId: string): Promise<RssArticle[]> {
  const pub = findPublisher(publisherId);
  if (!pub) return [];
  try {
    const res = await fetch(pub.rss, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Mozilla/5.0 (altera community RSS reader)" },
    });
    if (!res.ok) return [];
    return parseRss(await res.text(), pub);
  } catch {
    return [];
  }
}

/** 레터·뉴스 피드에 쓰는 AI타임스 기사 */
export function getAitimesArticles() {
  return getArticles("aitimes");
}

/**
 * 여러 매체 기사를 한꺼번에 받아 최신순으로.
 * 기사를 많이 내는 매체가 목록을 덮지 않도록 매체마다 최근 perPublisher개까지만 씁니다.
 */
export async function getArticlesFor(publisherIds: string[], perPublisher = 10): Promise<RssArticle[]> {
  const lists = await Promise.all(publisherIds.map(getArticles));
  return lists
    .flatMap((list) => list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, perPublisher))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
