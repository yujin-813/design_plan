// 청년 K-뉴딜 아카데미 기수/커리큘럼 정의.
// 가입할 때 고르는 과정·기수 목록이자, 일정 달력의 원본 데이터입니다.

export type CohortId = string;

export type CohortInfo = {
  id: CohortId;
  course: string;   // 강의명 — 같은 강의의 여러 기수를 묶는 기준
  cohort: string;   // 기수 표기
  label: string;
  org: string;
  period: string;   // 화면에 보여줄 기간 문구
  startDate: string; // YYYY-MM-DD — 수강중/수료 판단에 씁니다
  endDate: string;   // YYYY-MM-DD
  open: boolean;    // 지금 가입받는 기수인지
};

// 지역·학교 이름은 넣지 않고 "K-뉴딜 아카데미 N기"로만 부릅니다.
// 수료한 기수도 가입 화면에서 고를 수 있게 모두 open: true 입니다.
const ORG = "청년 K-뉴딜 아카데미";
const COURSE = "K-뉴딜 아카데미";

export const cohorts: CohortInfo[] = [
  { id: "knewdeal-4", course: COURSE, cohort: "4기", label: "K-뉴딜 아카데미 4기", org: ORG, period: "2026.09.14 ~ 12.10", startDate: "2026-09-14", endDate: "2026-12-10", open: true },
  { id: "knewdeal-3", course: COURSE, cohort: "3기", label: "K-뉴딜 아카데미 3기", org: ORG, period: "2026.09.21 ~ 11.19", startDate: "2026-09-21", endDate: "2026-11-19", open: true },
  // TODO: 1기·2기 기간은 임시값입니다(2026년 8월 시작으로 들었음). 실제 운영 기간으로 바꿔주세요.
  { id: "knewdeal-2", course: COURSE, cohort: "2기", label: "K-뉴딜 아카데미 2기", org: ORG, period: "2026.08 ~ 09", startDate: "2026-08-01", endDate: "2026-09-11", open: true },
  { id: "knewdeal-1", course: COURSE, cohort: "1기", label: "K-뉴딜 아카데미 1기", org: ORG, period: "2026.08 ~ 09", startDate: "2026-08-01", endDate: "2026-09-11", open: true },
];

/** 오늘 기준으로 이 기수가 어느 단계인지 */
export type CohortPhase = "upcoming" | "ongoing" | "ended";

export function cohortPhase(cohort: CohortInfo, today = new Date()): CohortPhase {
  const ymd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  if (ymd < cohort.startDate) return "upcoming";
  if (ymd > cohort.endDate) return "ended";
  return "ongoing";
}

/** 강의명으로 묶은 기수 목록 (필터용) */
export function courseNames(): string[] {
  return [...new Set(cohorts.map((c) => c.course))];
}

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

// 교육 기간에 걸치는 공휴일 (대체공휴일 포함) — 3기·4기 공통
const knewdealHolidays: Record<string, string> = {
  "2026-09-24": "추석 연휴",
  "2026-09-25": "추석",
  "2026-09-26": "추석 연휴",
  "2026-09-27": "추석 연휴",
  "2026-10-03": "개천절",
  "2026-10-05": "대체공휴일",
  "2026-10-09": "한글날",
  "2026-12-25": "성탄절",
};


export type Lesson = {
  date: string; // YYYY-MM-DD
  week: number;
  subject: string;
  track: Track;
  hours: number;
};

export type WeekInfo = { week: number; range: string; theme: string; note?: string };

// 아래 3기·4기 일정은 운영팀 훈련일정표(엑셀)에서 그대로 옮겼습니다.

const knewdeal3Weeks: WeekInfo[] = [
  { week: 1, range: "9/21 ~ 9/23", theme: "개강", note: "9/24~9/27 추석 연휴" },
  { week: 2, range: "9/28 ~ 10/2", theme: "바이브코딩 · 어도비 착수" },
  { week: 3, range: "10/6 ~ 10/8", theme: "마케팅 본 수업", note: "10/5 대체공휴일, 10/9 한글날" },
  { week: 4, range: "10/12 ~ 10/16", theme: "어도비 집중" },
  { week: 5, range: "10/19 ~ 10/23", theme: "마케팅 본 수업" },
  { week: 6, range: "10/26 ~ 10/30", theme: "마케팅 본 수업" },
  { week: 7, range: "11/2 ~ 11/6", theme: "캡스톤 착수 (컨셉기획 + 소재 방향성 2일 연속)" },
  { week: 8, range: "11/9 ~ 11/13", theme: "프로젝트 중간점검" },
  { week: 9, range: "11/16 ~ 11/19", theme: "파이널 점검 및 수료" },
];

const knewdeal3Lessons: Lesson[] = [
  // 1주차
  { date: "2026-09-21", week: 1, subject: "입교식 및 OT (11:00~18:00) · AI Marketing Foundation", track: "최재우", hours: 6 },
  { date: "2026-09-22", week: 1, subject: "AI Marketing Foundation & Digital Marketing Essential (퍼널/STP)", track: "최재우", hours: 8 },
  { date: "2026-09-23", week: 1, subject: "비교과", track: "비교과", hours: 8 },
  // 2주차
  { date: "2026-09-28", week: 2, subject: "바이브코딩", track: "바이브코딩", hours: 8 },
  { date: "2026-09-29", week: 2, subject: "바이브코딩", track: "바이브코딩", hours: 8 },
  { date: "2026-09-30", week: 2, subject: "마케팅 소재 제작 ①", track: "어도비", hours: 8 },
  { date: "2026-10-01", week: 2, subject: "마케팅 소재 제작 ②", track: "어도비", hours: 8 },
  { date: "2026-10-02", week: 2, subject: "비교과", track: "비교과", hours: 8 },
  // 3주차
  { date: "2026-10-06", week: 3, subject: "AI Marketing Foundation & Digital Marketing Essential (퍼널/STP)", track: "최재우", hours: 8 },
  { date: "2026-10-07", week: 3, subject: "AI Marketing Foundation & Digital Marketing Essential (퍼널/STP)", track: "최재우", hours: 8 },
  { date: "2026-10-08", week: 3, subject: "바이브코딩", track: "바이브코딩", hours: 8 },
  // 4주차
  { date: "2026-10-12", week: 4, subject: "바이브코딩", track: "바이브코딩", hours: 8 },
  { date: "2026-10-13", week: 4, subject: "바이브코딩", track: "바이브코딩", hours: 8 },
  { date: "2026-10-14", week: 4, subject: "마케팅 소재 제작 ③", track: "어도비", hours: 8 },
  { date: "2026-10-15", week: 4, subject: "마케팅 소재 제작 ④", track: "어도비", hours: 8 },
  { date: "2026-10-16", week: 4, subject: "마케팅 소재 제작 ⑤", track: "어도비", hours: 8 },
  // 5주차
  { date: "2026-10-19", week: 5, subject: "AI Marketing Foundation & Digital Marketing Essential (퍼널/STP)", track: "최재우", hours: 8 },
  { date: "2026-10-20", week: 5, subject: "AI Marketing Foundation & Digital Marketing Essential (퍼널/STP)", track: "최재우", hours: 8 },
  { date: "2026-10-21", week: 5, subject: "바이브코딩", track: "바이브코딩", hours: 8 },
  { date: "2026-10-22", week: 5, subject: "바이브코딩", track: "바이브코딩", hours: 8 },
  { date: "2026-10-23", week: 5, subject: "바이브코딩", track: "바이브코딩", hours: 8 },
  // 6주차
  { date: "2026-10-26", week: 6, subject: "AI Marketing Foundation & Digital Marketing Essential (퍼널/STP)", track: "최재우", hours: 8 },
  { date: "2026-10-27", week: 6, subject: "AI Marketing Foundation & Digital Marketing Essential (퍼널/STP)", track: "최재우", hours: 8 },
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

const knewdeal4Weeks: WeekInfo[] = [
  { week: 1, range: "9/14 ~ 9/18", theme: "바이브코딩 전진배치" },
  { week: 2, range: "9/21 ~ 9/23", theme: "어도비", note: "9/24~9/27 추석 연휴" },
  { week: 3, range: "9/28 ~ 10/2", theme: "어도비 + 마케팅 본 수업 ①" },
  { week: 4, range: "10/6 ~ 10/8", theme: "바이브코딩", note: "10/5 대체공휴일, 10/9 한글날" },
  { week: 5, range: "10/12 ~ 10/16", theme: "마케팅 본 수업 ②" },
  { week: 6, range: "10/19 ~ 10/23", theme: "바이브코딩 집중" },
  { week: 7, range: "10/26 ~ 10/30", theme: "마케팅 본 수업 ③" },
  { week: 8, range: "11/2 ~ 11/6", theme: "바이브코딩 집중" },
  { week: 9, range: "11/9 ~ 11/13", theme: "마케팅 본 수업 ④ (본 수업 마무리)" },
  { week: 10, range: "11/16 ~ 11/20", theme: "프로젝트 기획 + 소재기획 멘토링 2회" },
  { week: 11, range: "11/23 ~ 11/27", theme: "프로젝트 중간점검 1회" },
  { week: 12, range: "11/30 ~ 12/4", theme: "프로젝트 집중" },
  { week: 13, range: "12/7 ~ 12/10", theme: "파이널 점검 1회 및 수료" },
];

const knewdeal4Lessons: Lesson[] = [
  // 1주차
  { date: "2026-09-14", week: 1, subject: "입교식 및 OT (11:00~18:00) · 바이브코딩 오리엔테이션·개발환경 세팅", track: "바이브코딩", hours: 6 },
  { date: "2026-09-15", week: 1, subject: "바이브코딩 - 노코드/AI 개발 기초", track: "바이브코딩", hours: 8 },
  { date: "2026-09-16", week: 1, subject: "바이브코딩 - 프롬프트 기반 앱 구조 설계", track: "바이브코딩", hours: 8 },
  { date: "2026-09-17", week: 1, subject: "바이브코딩 - 랜딩페이지 구축 실습", track: "바이브코딩", hours: 8 },
  { date: "2026-09-18", week: 1, subject: "바이브코딩 - 데이터 연동 기초", track: "바이브코딩", hours: 8 },
  // 2주차
  { date: "2026-09-21", week: 2, subject: "마케팅 소재 제작 ①", track: "어도비", hours: 8 },
  { date: "2026-09-22", week: 2, subject: "마케팅 소재 제작 ②", track: "어도비", hours: 8 },
  { date: "2026-09-23", week: 2, subject: "비교과 - 진로설계 · 조직협업", track: "비교과", hours: 8 },
  // 3주차
  { date: "2026-09-28", week: 3, subject: "마케팅 소재 제작 ③", track: "어도비", hours: 8 },
  { date: "2026-09-29", week: 3, subject: "마케팅 소재 제작 ④", track: "어도비", hours: 8 },
  { date: "2026-09-30", week: 3, subject: "AI Marketing Foundation ①", track: "최재우", hours: 8 },
  { date: "2026-10-01", week: 3, subject: "AI Marketing Foundation ②", track: "최재우", hours: 8 },
  { date: "2026-10-02", week: 3, subject: "마케팅 소재 제작 ⑤", track: "어도비", hours: 8 },
  // 4주차
  { date: "2026-10-06", week: 4, subject: "바이브코딩 - 마케팅 데이터 파이프라인", track: "바이브코딩", hours: 8 },
  { date: "2026-10-07", week: 4, subject: "바이브코딩 - 대시보드 설계 기초", track: "바이브코딩", hours: 8 },
  { date: "2026-10-08", week: 4, subject: "바이브코딩 - 콘텐츠 자동 배포 모듈", track: "바이브코딩", hours: 8 },
  // 5주차
  { date: "2026-10-12", week: 5, subject: "바이브코딩 - GPT API 연동 ①", track: "바이브코딩", hours: 8 },
  { date: "2026-10-13", week: 5, subject: "Digital Marketing Essential (퍼널/STP) ①", track: "최재우", hours: 8 },
  { date: "2026-10-14", week: 5, subject: "Digital Marketing Essential (퍼널/STP) ②", track: "최재우", hours: 8 },
  { date: "2026-10-15", week: 5, subject: "바이브코딩 - GPT API 연동 ②", track: "바이브코딩", hours: 8 },
  { date: "2026-10-16", week: 5, subject: "바이브코딩 - 퍼널 데이터 구조 설계", track: "바이브코딩", hours: 8 },
  // 6주차
  { date: "2026-10-19", week: 6, subject: "바이브코딩 - 자동화 워크플로우 설계", track: "바이브코딩", hours: 8 },
  { date: "2026-10-20", week: 6, subject: "바이브코딩 - 성과 대시보드 구축 ①", track: "바이브코딩", hours: 8 },
  { date: "2026-10-21", week: 6, subject: "바이브코딩 - 성과 대시보드 구축 ②", track: "바이브코딩", hours: 8 },
  { date: "2026-10-22", week: 6, subject: "바이브코딩 - GA4/Amplitude 연동", track: "바이브코딩", hours: 8 },
  { date: "2026-10-23", week: 6, subject: "바이브코딩 - 이벤트 트래킹 설계", track: "바이브코딩", hours: 8 },
  // 7주차
  { date: "2026-10-26", week: 7, subject: "바이브코딩 - 리포팅 자동화", track: "바이브코딩", hours: 8 },
  { date: "2026-10-27", week: 7, subject: "바이브코딩 - API 통합 실습", track: "바이브코딩", hours: 8 },
  { date: "2026-10-28", week: 7, subject: "비교과 - 커뮤니케이션 · 협업 툴", track: "비교과", hours: 8 },
  { date: "2026-10-29", week: 7, subject: "AI Strategy & Insight Lab - AI 리서치", track: "최재우", hours: 8 },
  { date: "2026-10-30", week: 7, subject: "AI Strategy & Insight Lab - 캠페인 전략 기획", track: "최재우", hours: 8 },
  // 8주차
  { date: "2026-11-02", week: 8, subject: "바이브코딩 - 서비스 통합 구축", track: "바이브코딩", hours: 8 },
  { date: "2026-11-03", week: 8, subject: "바이브코딩 - 배포 및 운영 ①", track: "바이브코딩", hours: 8 },
  { date: "2026-11-04", week: 8, subject: "바이브코딩 - 배포 및 운영 ②", track: "바이브코딩", hours: 8 },
  { date: "2026-11-05", week: 8, subject: "바이브코딩 - 실전 문제 해결", track: "바이브코딩", hours: 8 },
  { date: "2026-11-06", week: 8, subject: "바이브코딩 - 프로토타입 설계", track: "바이브코딩", hours: 8 },
  // 9주차
  { date: "2026-11-09", week: 9, subject: "바이브코딩 - 캡스톤 기술 스택 점검", track: "바이브코딩", hours: 8 },
  { date: "2026-11-10", week: 9, subject: "비교과 - 취업역량 · 포트폴리오 특강", track: "비교과", hours: 8 },
  { date: "2026-11-11", week: 9, subject: "그로스 마케팅 실행 - 캠페인 최적화", track: "최재우", hours: 8 },
  { date: "2026-11-12", week: 9, subject: "마케팅 성과 분석 및 인사이트 도출", track: "최재우", hours: 8 },
  { date: "2026-11-13", week: 9, subject: "바이브코딩 - 프로젝트 착수 준비", track: "바이브코딩", hours: 8 },
  // 10주차
  { date: "2026-11-16", week: 10, subject: "프로젝트 실습 (바이브코딩)", track: "바이브코딩", hours: 8 },
  { date: "2026-11-17", week: 10, subject: "프로젝트 실습 (바이브코딩)", track: "바이브코딩", hours: 8 },
  { date: "2026-11-18", week: 10, subject: "프로젝트 실습 (바이브코딩)", track: "바이브코딩", hours: 8 },
  { date: "2026-11-19", week: 10, subject: "프로젝트 컨셉기획", track: "최재우", hours: 8 },
  { date: "2026-11-20", week: 10, subject: "프로젝트 팀구성 및 소재 기획 멘토링", track: "최재우", hours: 8 },
  // 11주차
  { date: "2026-11-23", week: 11, subject: "프로젝트 중간점검", track: "최재우", hours: 8 },
  { date: "2026-11-24", week: 11, subject: "프로젝트 실습 (바이브코딩)", track: "바이브코딩", hours: 8 },
  { date: "2026-11-25", week: 11, subject: "프로젝트 실습 (바이브코딩)", track: "바이브코딩", hours: 8 },
  { date: "2026-11-26", week: 11, subject: "프로젝트 실습 (바이브코딩)", track: "바이브코딩", hours: 8 },
  { date: "2026-11-27", week: 11, subject: "프로젝트 실습 (바이브코딩)", track: "바이브코딩", hours: 8 },
  // 12주차
  { date: "2026-11-30", week: 12, subject: "프로젝트 실습 (바이브코딩)", track: "바이브코딩", hours: 8 },
  { date: "2026-12-01", week: 12, subject: "프로젝트 실습 (바이브코딩)", track: "바이브코딩", hours: 8 },
  { date: "2026-12-02", week: 12, subject: "프로젝트 실습 (바이브코딩)", track: "바이브코딩", hours: 8 },
  { date: "2026-12-03", week: 12, subject: "프로젝트 실습 (바이브코딩)", track: "바이브코딩", hours: 8 },
  { date: "2026-12-04", week: 12, subject: "프로젝트 실습 (바이브코딩)", track: "바이브코딩", hours: 8 },
  // 13주차
  { date: "2026-12-07", week: 13, subject: "프로젝트 파이널 점검", track: "최재우", hours: 8 },
  { date: "2026-12-08", week: 13, subject: "프로젝트 실습 (바이브코딩) - 발표자료 완성", track: "바이브코딩", hours: 8 },
  { date: "2026-12-09", week: 13, subject: "발표 리허설 및 어도비 ACP 시험", track: "공통", hours: 8 },
  { date: "2026-12-10", week: 13, subject: "프로젝트 발표 및 수료식", track: "공통", hours: 8 },
];

// ─── 기수별 커리큘럼 ─────────────────────────────────────────────
// 수업 일정·주차·공휴일은 기수마다 다릅니다. 기수를 새로 열 때는
// cohorts 에 항목을 추가하고 여기에 커리큘럼을 같이 등록하세요.
// 등록하지 않으면 달력이 "아직 등록 전" 안내를 보여줍니다.

export type Curriculum = {
  cohortId: string;
  weeks: WeekInfo[];
  lessons: Lesson[];
  holidays: Record<string, string>;
};

export const curriculumByCohort: Record<string, Curriculum> = {
  "knewdeal-3": { cohortId: "knewdeal-3", weeks: knewdeal3Weeks, lessons: knewdeal3Lessons, holidays: knewdealHolidays },
  "knewdeal-4": { cohortId: "knewdeal-4", weeks: knewdeal4Weeks, lessons: knewdeal4Lessons, holidays: knewdealHolidays },
};

export function getCurriculum(cohortId: string | null | undefined): Curriculum | null {
  if (!cohortId) return null;
  return curriculumByCohort[cohortId] ?? null;
}

export function holidayName(c: Curriculum, date: string) {
  return c.holidays[date] ?? null;
}

export function totalHours(c: Curriculum) {
  return c.lessons.reduce((sum, l) => sum + l.hours, 0);
}

export function weekHours(c: Curriculum, week: number) {
  return c.lessons.filter((l) => l.week === week).reduce((sum, l) => sum + l.hours, 0);
}

export function lessonsByMonth(c: Curriculum, year: number, month0: number) {
  const prefix = `${year}-${String(month0 + 1).padStart(2, "0")}-`;
  return c.lessons.filter((l) => l.date.startsWith(prefix));
}
