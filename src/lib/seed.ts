// 시드(데모) 데이터 — Supabase가 설정되지 않아도 앱이 이 데이터로 렌더됩니다.

// 수업방(room) 안에 들어가는 것들. 공지가 없는 과정도 있어서
// 빈 배열에 타입을 붙여줘야 화면에서 타입이 갈라지지 않습니다.
export type RoomNotice = { id: string; title: string; date: string; body: string };
export type RoomMaterial = { title: string; date: string };
export type RoomAssignment = { title: string; due: string };
export type SeedEvent = { id: string; title: string; type: string; level: string; price: string; date: string; color: string; image?: string };

export const seed = {
  me: { name: "유진", cohort: "7기", role: "member" },

  posts: [
    { id: 1, author: "운영팀", color: "#3E9C7D", cohort: "운영팀", cat: "잡담", ago: "방금 전",
      title: "날이 갑자기 많이 추워졌네요, 다들 점심 뭐 드셨어요?",
      excerpt: "알테라에 오신 걸 환영해요! 가볍게 인사 남겨 주세요…",
      body: "알테라에 오신 걸 환영해요!\n\n오늘 아침에 나오는데 바람이 꽤 차더라고요. 이럴 땐 따뜻한 국물이 생각나네요. 저는 점심으로 순두부찌개 먹었어요.\n\n다들 점심 뭐 드셨는지, 요즘 어떻게 지내는지 댓글로 가볍게 인사 남겨 주세요. 감기 조심하세요!",
      likes: 0, comments: 0, views: 0 },
  ],

  categories: ["전체", "잡담", "질문", "정보공유", "구인구직", "축하해요", "자유"],

  eventTypes: ["전체", "온라인", "오프라인", "온·오프라인", "특강"] as const,

  events: [
    { id: "ev-data-ai", title: "AI 시대의 데이터 분석", type: "온라인", level: "무료", price: "신청하기", date: "11.05(목) 20:00 · Zoom", color: "var(--sky-deep)" },
  ] as SeedEvent[],

  noticeCategories: ["전체", "운영 공지", "커뮤니티 활동", "시스템"] as const,

  notices: [
    { id: 1, category: "운영 공지", pinned: true, title: "알테라 커뮤니티 이용 가이드 — 처음이라면 꼭 읽어주세요", date: "10.14", by: "운영팀",
      body: "알테라는 청년 K-뉴딜 아카데미 수강생과 수료생이 모여 AI 마케팅 이야기를 나누는 커뮤니티예요. 처음 오셨다면 아래 내용을 확인해 주세요.\n\n■ 가입하기\n1. 로그인 화면에서 '수강생 가입'을 눌러주세요.\n2. 내가 들은(듣고 있는) 기수를 고르세요. 예) K-뉴딜 아카데미 3기\n3. 이름은 수강 신청한 실명 그대로 입력해 주세요. 운영팀이 수강생 명단과 대조해 승인해 드려요.\n4. 승인 전에도 홈·공지사항·이벤트·자유수다·레터·뉴스는 읽을 수 있어요. 글쓰기와 댓글은 승인 후에 열립니다.\n\n■ 이렇게 이용해요\n- 레터·뉴스: 운영팀이 골라 온 AI 마케팅 소식과 레터예요. 읽고 생각을 댓글로 나눠 주세요.\n- 자유수다: 기수 상관없이 편하게 이야기하는 곳이에요. 질문, 정보 공유, 축하 모두 환영해요.\n- 이벤트: 특강·모임을 신청하고, 구독해 두면 홈 '챙겨야 할 일정'에 모여요.\n- 내 수업: 수강 중인 기수의 공지·자료·과제·일정을 확인하고 과제를 제출해요. 같은 기수 동기 대화방도 여기 있어요.\n- 프로젝트: 운영팀이 연결하는 외부 프로젝트예요. 관심 있으면 지원해 주세요. 운영팀은 기수와 제출한 과제를 함께 봐요.\n- 프로필: 내가 쓴 글·댓글 수, 최근 활동, 제출한 과제 결과물을 볼 수 있어요.\n\n■ 수료한 뒤에는\n- 수업 공지·자료·과제 공간은 닫히고, 기수 동기 대화방은 계속 남아요.\n- 제출했던 과제는 프로필에 남아서 프로젝트에 지원할 때 포트폴리오가 돼요.\n\n■ 함께 지켜주세요\n- 광고성 글이나 무분별한 홍보는 삼가 주세요.\n- 서로 존중하는 말투를 써 주세요.\n- 채용·구인 글은 자유수다 '구인구직' 카테고리로 올려 주세요.\n- 신고가 쌓인 글은 안내 없이 내려갈 수 있어요.\n\n궁금한 점은 자유수다에 남겨 주시면 운영팀이나 다른 멤버가 답해 드려요." },
  ],

  mentors: [
    { name: "이서연", color: "#3E9C7D", headline: "퍼포먼스 마케팅 리드 · 경력 8년", tags: ["GA4", "퍼포먼스 광고", "리포트 자동화"], rating: "4.9", mentee: "42", resp: "1시간", available: true },
    { name: "정하영", color: "#5BA6E8", headline: "데이터 분석가 · 경력 6년", tags: ["SQL·BigQuery", "퍼널 분석", "대시보드"], rating: "4.8", mentee: "31", resp: "2시간", available: true },
    { name: "박지훈", color: "#8C72EE", headline: "그로스 마케터 · 경력 5년", tags: ["AI 소재 생성", "A/B 테스트", "콘텐츠"], rating: "4.7", mentee: "26", resp: "당일", available: false },
    { name: "이도라", color: "#E8834E", headline: "콘텐츠·브랜드 · 경력 7년", tags: ["카피라이팅", "브랜드", "SNS"], rating: "5.0", mentee: "38", resp: "1시간", available: true },
  ],

  programStatuses: ["전체", "모집 중", "진행 중", "수료", "오픈 예정"] as const,

  programs: [
    {
      id: "ai-growth-7", kind: "정규", status: "진행 중", title: "AI 그로스마케팅 7기", format: "온라인 · 8주",
      schedule: "09.01 ~ 10.26 · 매주 월·목 20:00", price: "₩350,000", students: 32,
      summary: "AI 도구로 그로스 루프를 설계하고 실제 캠페인 데이터로 실험하는 8주 과정입니다.",
      curriculum: ["1~2주차 · 그로스 프레임워크와 지표 설계", "3~4주차 · AI 소재 생성 & 캠페인 셋업", "5~6주차 · 데이터 분석과 실험 설계", "7~8주차 · 팀 프로젝트 & 데모데이"],
      color: "var(--violet-deep)",
      room: {
        notices: [
          { id: "ai-growth-7-n1", title: "6주차 실습 전 GA4 계정 초대 링크 확인해주세요", date: "10.05",
            body: "6주차 실습 전 아래 이메일로 GA4 계정 초대를 보내드렸습니다.\n\n실습 시작 전까지 계정 초대 수락 부탁드리며, 안 보이시는 분은 스팸함도 확인해주세요. 문제가 있으면 자유수다에 남겨주시면 빠르게 도와드릴게요." },
          { id: "ai-growth-7-n2", title: "데모데이 발표 순서 안내드립니다", date: "10.02",
            body: "8주차 데모데이 발표 순서를 추첨을 통해 정했습니다.\n\n1조 → 2조 → 3조 → 4조 순으로 진행하며, 각 조당 발표 8분 + Q&A 5분입니다. 발표 자료는 발표 전날 자정까지 자료실에 업로드해주세요." },
        ],
        materials: [{ title: "5주차 · 실험 설계 템플릿.xlsx", date: "09.28" }, { title: "4주차 · AI 소재 프롬프트 모음", date: "09.21" }],
        assignments: [{ title: "6주차 과제 · A/B 테스트 결과 리포트", due: "마감 10.12" }, { title: "5주차 과제 · 퍼널 개선안", due: "제출 완료 · 채점중" }],
      },
      alumni: {
        jobs: [{ title: "그로스 마케터 채용 (시리즈B 스타트업)", date: "10.01" }],
        nextSessions: [{ title: "AI 그로스마케팅 8기 모집 예정", date: "12월 중" }],
      },
    },
    {
      id: "ai-ads-workshop", kind: "정규", status: "모집 중", title: "AI 광고 소재 실전 워크숍", format: "온라인 · 4주",
      schedule: "10.20 ~ 11.10 · 매주 화 20:00", price: "₩120,000", students: 0,
      summary: "AI로 광고 카피·이미지를 대량 생성하고 성과 데이터로 골라내는 법을 4주간 실습합니다.",
      curriculum: ["1주차 · 생성형 AI 소재 브리프 작성법", "2주차 · 이미지·카피 배치 생성 워크플로우", "3주차 · A/B 테스트 설계와 지표 해석", "4주차 · 실제 캠페인에 적용해보기"],
      color: "var(--sky-deep)",
      room: { notices: [] as RoomNotice[], materials: [] as RoomMaterial[], assignments: [] as RoomAssignment[] },
      alumni: { jobs: [], nextSessions: [] },
    },
    {
      id: "growth-data-5", kind: "정규", status: "수료", title: "그로스 데이터 분석 부트캠프 5기", format: "오프라인 · 6주",
      schedule: "2026.06 수료 · 강남 라운지", price: "₩280,000", students: 24,
      summary: "GA4·BigQuery로 퍼널을 직접 설계하고 리텐션까지 추적한 실전 데이터 분석 과정입니다.",
      curriculum: ["1주차 · GA4 이벤트 설계", "2주차 · BigQuery 기초 쿼리", "3~4주차 · 퍼널·리텐션 대시보드 제작", "5~6주차 · 팀 프로젝트 & 발표"],
      color: "var(--warm-deep)",
      room: {
        notices: [
          { id: "growth-data-5-n1", title: "수료증은 마이페이지에서 다운로드할 수 있어요", date: "06.20",
            body: "그로스 데이터 분석 부트캠프 5기 수료를 축하드립니다!\n\n수료증은 프로필 > 수료 내역에서 PDF로 다운로드하실 수 있습니다. 출력이 필요하신 분은 고해상도 원본도 함께 제공됩니다." },
        ],
        materials: [{ title: "전체 강의자료 아카이브.zip", date: "06.15" }],
        assignments: [{ title: "최종 프로젝트 · 팀 대시보드", due: "제출 완료 · 우수상" }],
      },
      alumni: {
        jobs: [{ title: "데이터 마케터 채용 (이커머스)", date: "09.20" }, { title: "그로스 애널리스트 채용 (핀테크)", date: "09.02" }],
        nextSessions: [{ title: "6기 모집 시작", date: "11.03" }, { title: "5기 동문 오프라인 밋업", date: "10.09" }],
      },
    },
    {
      id: "content-writing", kind: "정규", status: "오픈 예정", title: "콘텐츠 마케팅 라이팅 클래스", format: "온라인 · 2주",
      schedule: "12월 중 오픈 예정", price: "미정", students: 0,
      summary: "브랜드 톤앤매너를 잡고 SNS·뉴스레터 카피를 빠르게 뽑아내는 라이팅 스킬을 다룹니다.",
      curriculum: ["세부 커리큘럼 공개 예정입니다."],
      color: "var(--violet-2)",
      room: { notices: [] as RoomNotice[], materials: [] as RoomMaterial[], assignments: [] as RoomAssignment[] },
      alumni: { jobs: [], nextSessions: [] },
    },
    {
      id: "ga4-oneday", kind: "특별", status: "모집 중", title: "하루만에 끝내는 GA4 세팅 특강", format: "오프라인 · 1일",
      schedule: "10.18(토) 10:00~17:00 · 강남 라운지", price: "₩59,000", students: 0,
      summary: "이벤트 설계부터 리포트 확인까지, 하루 만에 GA4 세팅을 끝내는 초압축 워크숍입니다.",
      curriculum: ["오전 · GA4 계정·속성·이벤트 설계", "오후 · 전환 설정과 리포트 실습"],
      color: "var(--warm-deep)",
      room: { notices: [] as RoomNotice[], materials: [] as RoomMaterial[], assignments: [] as RoomAssignment[] },
      alumni: { jobs: [], nextSessions: [] },
    },
    {
      id: "copywriting-twoday", kind: "특별", status: "모집 중", title: "이틀 완성 AI 카피라이팅 캠프", format: "온라인 · 2일",
      schedule: "10.25(토)~10.26(일) 19:00~21:00 · Zoom", price: "₩89,000", students: 0,
      summary: "AI로 카피 초안을 뽑고 다듬는 법을 이틀 동안 집중적으로 실습합니다.",
      curriculum: ["1일차 · AI 카피 브리프·초안 생성", "2일차 · 톤 다듬기와 A/B 테스트 카피 뽑기"],
      color: "var(--sky-deep)",
      room: { notices: [] as RoomNotice[], materials: [] as RoomMaterial[], assignments: [] as RoomAssignment[] },
      alumni: { jobs: [], nextSessions: [] },
    },
  ],
};
export type Seed = typeof seed;
