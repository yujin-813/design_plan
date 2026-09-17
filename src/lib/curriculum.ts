// K-디지털 뉴딜 아카데미 AI 마케팅 과정 기수/커리큘럼 정의.
// 가입할 때 고르는 과정·기수 목록이자, 일정 달력의 원본 데이터입니다.

export type CohortId = "ai-marketing-3";

export type CohortInfo = {
  id: CohortId;
  course: string;
  cohort: string;
  label: string;
  org: string;
  period: string;
  open: boolean; // 지금 가입받는 기수인지
};

export const cohorts: CohortInfo[] = [
  {
    id: "ai-marketing-3",
    course: "AI 마케팅",
    cohort: "3기",
    label: "AI 마케팅 3기",
    org: "K-디지털 뉴딜 아카데미",
    period: "2026.09.21 ~ 11.19",
    open: true,
  },
];

export function findCohort(id: string) {
  return cohorts.find((c) => c.id === id) ?? null;
}

// 담당별로 달력에서 색을 구분합니다.
export type Track = "최재우" | "바이브코딩" | "어도비" | "비교과" | "공통";

export const trackStyle: Record<Track, { color: string; soft: string; label: string }> = {
  최재우: { color: "var(--violet-ink)", soft: "var(--violet-soft)", label: "마케팅 본 수업" },
  바이브코딩: { color: "var(--sky-deep)", soft: "var(--sky-soft)", label: "바이브코딩" },
  어도비: { color: "var(--warm-ink)", soft: "var(--warm-soft)", label: "마케팅 소재 제작" },
  비교과: { color: "var(--muted)", soft: "var(--raise)", label: "비교과" },
  공통: { color: "var(--mint)", soft: "var(--mint-soft)", label: "공통" },
};

// 교육 기간에 걸치는 공휴일 (대체공휴일 포함)
export const holidays: Record<string, string> = {
  "2026-09-24": "추석 연휴",
  "2026-09-25": "추석",
  "2026-09-26": "추석 연휴",
  "2026-09-27": "추석 연휴",
  "2026-10-03": "개천절",
  "2026-10-05": "대체공휴일",
  "2026-10-09": "한글날",
  "2026-12-25": "성탄절",
};

export function holidayName(date: string) {
  return holidays[date] ?? null;
}

export type Lesson = {
  date: string; // YYYY-MM-DD
  week: number;
  subject: string;
  track: Track;
  hours: number;
};

export type WeekInfo = { week: number; range: string; theme: string; note?: string };

export const weeks: WeekInfo[] = [
  { week: 1, range: "9/21 ~ 9/23", theme: "개강", note: "9/24~9/27 추석 연휴" },
  { week: 2, range: "9/28 ~ 10/2", theme: "바이브코딩 · 어도비 착수" },
  { week: 3, range: "10/6 ~ 10/8", theme: "마케팅 본 수업", note: "10/5 대체공휴일, 10/9 한글날" },
  { week: 4, range: "10/12 ~ 10/16", theme: "어도비 집중" },
  { week: 5, range: "10/19 ~ 10/23", theme: "마케팅 본 수업" },
  { week: 6, range: "10/26 ~ 10/30", theme: "마케팅 본 수업" },
  { week: 7, range: "11/2 ~ 11/6", theme: "캡스톤 착수" },
  { week: 8, range: "11/9 ~ 11/13", theme: "프로젝트 중간점검" },
  { week: 9, range: "11/16 ~ 11/19", theme: "파이널 점검 및 수료" },
];

const MARKETING = "AI Marketing Foundation & Digital Marketing Essential (퍼널/STP)";

export const lessons: Lesson[] = [
  // 1주차
  { date: "2026-09-21", week: 1, subject: "입교식 및 OT (11:00~18:00) · AI Marketing Foundation", track: "최재우", hours: 6 },
  { date: "2026-09-22", week: 1, subject: MARKETING, track: "최재우", hours: 8 },
  { date: "2026-09-23", week: 1, subject: "비교과", track: "비교과", hours: 8 },

  // 2주차
  { date: "2026-09-28", week: 2, subject: "바이브코딩", track: "바이브코딩", hours: 8 },
  { date: "2026-09-29", week: 2, subject: "바이브코딩", track: "바이브코딩", hours: 8 },
  { date: "2026-09-30", week: 2, subject: "마케팅 소재 제작 ①", track: "어도비", hours: 8 },
  { date: "2026-10-01", week: 2, subject: "마케팅 소재 제작 ②", track: "어도비", hours: 8 },
  { date: "2026-10-02", week: 2, subject: "비교과", track: "비교과", hours: 8 },

  // 3주차
  { date: "2026-10-06", week: 3, subject: MARKETING, track: "최재우", hours: 8 },
  { date: "2026-10-07", week: 3, subject: MARKETING, track: "최재우", hours: 8 },
  { date: "2026-10-08", week: 3, subject: "바이브코딩", track: "바이브코딩", hours: 8 },

  // 4주차
  { date: "2026-10-12", week: 4, subject: "바이브코딩", track: "바이브코딩", hours: 8 },
  { date: "2026-10-13", week: 4, subject: "바이브코딩", track: "바이브코딩", hours: 8 },
  { date: "2026-10-14", week: 4, subject: "마케팅 소재 제작 ③", track: "어도비", hours: 8 },
  { date: "2026-10-15", week: 4, subject: "마케팅 소재 제작 ④", track: "어도비", hours: 8 },
  { date: "2026-10-16", week: 4, subject: "마케팅 소재 제작 ⑤", track: "어도비", hours: 8 },

  // 5주차
  { date: "2026-10-19", week: 5, subject: MARKETING, track: "최재우", hours: 8 },
  { date: "2026-10-20", week: 5, subject: MARKETING, track: "최재우", hours: 8 },
  { date: "2026-10-21", week: 5, subject: "바이브코딩", track: "바이브코딩", hours: 8 },
  { date: "2026-10-22", week: 5, subject: "바이브코딩", track: "바이브코딩", hours: 8 },
  { date: "2026-10-23", week: 5, subject: "바이브코딩", track: "바이브코딩", hours: 8 },

  // 6주차
  { date: "2026-10-26", week: 6, subject: MARKETING, track: "최재우", hours: 8 },
  { date: "2026-10-27", week: 6, subject: MARKETING, track: "최재우", hours: 8 },
  { date: "2026-10-28", week: 6, subject: "바이브코딩", track: "바이브코딩", hours: 8 },
  { date: "2026-10-29", week: 6, subject: "바이브코딩", track: "바이브코딩", hours: 8 },
  { date: "2026-10-30", week: 6, subject: "바이브코딩", track: "바이브코딩", hours: 8 },

  // 7주차
  { date: "2026-11-02", week: 7, subject: "바이브코딩", track: "바이브코딩", hours: 8 },
  { date: "2026-11-03", week: 7, subject: "캡스톤 디자인 프로젝트 컨셉 기획", track: "최재우", hours: 8 },
  { date: "2026-11-04", week: 7, subject: "프로젝트 소재 방향성 제시 및 멘토링", track: "최재우", hours: 8 },
  { date: "2026-11-05", week: 7, subject: "프로젝트", track: "바이브코딩", hours: 8 },
  { date: "2026-11-06", week: 7, subject: "프로젝트", track: "바이브코딩", hours: 8 },

  // 8주차
  { date: "2026-11-09", week: 8, subject: "프로젝트 중간 점검", track: "최재우", hours: 8 },
  { date: "2026-11-10", week: 8, subject: "프로젝트", track: "바이브코딩", hours: 8 },
  { date: "2026-11-11", week: 8, subject: "프로젝트", track: "바이브코딩", hours: 8 },
  { date: "2026-11-12", week: 8, subject: "프로젝트", track: "바이브코딩", hours: 8 },
  { date: "2026-11-13", week: 8, subject: "프로젝트", track: "바이브코딩", hours: 8 },

  // 9주차
  { date: "2026-11-16", week: 9, subject: "프로젝트", track: "바이브코딩", hours: 8 },
  { date: "2026-11-17", week: 9, subject: "프로젝트 파이널 점검", track: "최재우", hours: 8 },
  { date: "2026-11-18", week: 9, subject: "프로젝트 리허설 및 어도비 ACP 시험", track: "공통", hours: 8 },
  { date: "2026-11-19", week: 9, subject: "프로젝트 발표 및 수료식", track: "공통", hours: 8 },
];

export const totalHours = lessons.reduce((s, l) => s + l.hours, 0);

export function weekHours(week: number) {
  return lessons.filter((l) => l.week === week).reduce((s, l) => s + l.hours, 0);
}

export function lessonsByMonth(year: number, month0: number) {
  const prefix = `${year}-${String(month0 + 1).padStart(2, "0")}-`;
  return lessons.filter((l) => l.date.startsWith(prefix));
}
