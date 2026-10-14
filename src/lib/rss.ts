// AI타임스 RSS에서 최신 기사를 가져옵니다.
// 30분 동안은 Next.js 캐시를 쓰고, 실패하면 빈 목록을 돌려 화면이 깨지지 않게 합니다.
const AITIMES_RSS = "https://www.aitimes.com/rss/allArticle.xml";
const REVALIDATE_SECONDS = 30 * 60;

export type RssArticle = {
  /** AI타임스 기사 번호 (idxno) */
  id: string;
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
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
}

function tag(item: string, name: string) {
  const m = item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : "";
}

// "2026-10-14 11:58:29" 는 한국 시간입니다.
function toIso(pubDate: string) {
  const m = pubDate.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/);
  const d = m ? new Date(`${m[1]}T${m[2]}+09:00`) : new Date(pubDate);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export function parseRss(xml: string): RssArticle[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  return items.flatMap((item) => {
    const link = tag(item, "link");
    const id = link.match(/idxno=(\d+)/)?.[1];
    const title = tag(item, "title");
    if (!id || !title || !/^https:\/\/www\.aitimes\.com\//.test(link)) return [];
    return [{
      id,
      title,
      link,
      summary: tag(item, "description"),
      author: tag(item, "author"),
      publishedAt: toIso(tag(item, "pubDate")),
    }];
  });
}

export async function getAitimesArticles(): Promise<RssArticle[]> {
  try {
    const res = await fetch(AITIMES_RSS, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Mozilla/5.0 (altera community RSS reader)" },
    });
    if (!res.ok) return [];
    return parseRss(await res.text());
  } catch {
    return [];
  }
}
