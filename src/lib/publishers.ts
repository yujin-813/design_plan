// 구독할 수 있는 매체와 RSS 주소. 스크랩은 구독한 매체의 RSS 기사만 모아 보여줍니다.
// (클라이언트 화면에서도 쓰므로 Node 전용 모듈을 가져오지 마세요.)
export type Publisher = {
  id: string;
  name: string;
  desc: string;
  category: "뉴스" | "마케팅" | "매거진";
  rss: string;
};

export const publishers: Publisher[] = [
  { id: "aitimes", name: "AI타임스", desc: "국내 AI 전문 매체. 업계 소식을 빠르게 전해요.", category: "뉴스", rss: "https://www.aitimes.com/rss/allArticle.xml" },
  { id: "bloter", name: "블로터", desc: "IT·테크 산업 뉴스", category: "뉴스", rss: "https://www.bloter.net/rss/allArticle.xml" },
  { id: "byline", name: "바이라인네트워크", desc: "테크·스타트업을 깊이 있게 다루는 매체", category: "매거진", rss: "https://byline.network/feed" },
  { id: "madtimes", name: "매드타임스", desc: "광고·마케팅 업계 소식", category: "마케팅", rss: "https://www.madtimes.co.kr/rss/allArticle.xml" },
  { id: "mobiinside", name: "모비인사이드", desc: "마케팅·스타트업 실무 인사이트 칼럼", category: "마케팅", rss: "https://www.mobiinside.co.kr/feed/" },
  { id: "the-pr", name: "더피알", desc: "PR·커뮤니케이션·브랜드 전문지", category: "마케팅", rss: "https://www.the-pr.co.kr/rss/allArticle.xml" },
  { id: "brandbrief", name: "브랜드브리프", desc: "브랜드·캠페인·크리에이티브 소식", category: "마케팅", rss: "https://www.brandbrief.co.kr/rss/allArticle.xml" },
];

export function findPublisher(id: string) {
  return publishers.find((p) => p.id === id) ?? null;
}
