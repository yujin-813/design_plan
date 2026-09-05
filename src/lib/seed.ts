// 시드(데모) 데이터 — Supabase가 설정되지 않아도 앱이 이 데이터로 렌더됩니다.
export const seed = {
  me: { name: "유진", cohort: "7기", role: "member" },

  posts: [
    { id: 1, author: "김민재", color: "#3E9C7D", cohort: "7기", cat: "잡담", ago: "2시간 전",
      title: "다들 점심 뭐 드셨어요 ㅎㅎ 오늘 회사 근처에 새로 생긴 카페 갔는데",
      excerpt: "라떼가 진짜 맛있어서 공유하고 싶어서 글 남겨요…",
      body: "오늘 회사 근처에 새로 생긴 카페를 갔는데 라떼가 진짜 맛있더라고요.\n\n원두도 직접 로스팅한다고 하고, 자리도 넓어서 노트북 들고 일하기 좋았어요. 혹시 강남 쪽 자주 다니시는 분들 있으면 한번 가보세요. 다음에 스터디 모임 장소로도 괜찮을 것 같아요!",
      likes: 24, comments: 11, views: 142 },
    { id: 2, author: "이서연", color: "#E8834E", cohort: "멘토", cat: "정보공유", ago: "5시간 전",
      title: "[공유] 광고 성과 리포트 자동화 시트 v2 무료로 풀어요",
      excerpt: "메타·구글·틱톡을 한 시트에서 보도록 업데이트했어요, 필요하신 분 댓글 남겨주세요…",
      body: "메타·구글·틱톡 광고 성과를 한 시트에서 자동으로 모아볼 수 있게 업데이트했어요.\n\n- API 연동 없이 CSV 붙여넣기만 하면 자동 정리\n- 채널별 CPA·ROAS 비교 대시보드 포함\n- 주간/월간 리포트 템플릿 추가\n\n필요하신 분은 댓글로 이메일 남겨주시면 링크 드릴게요. 피드백도 환영입니다!",
      likes: 58, comments: 9, views: 388 },
    { id: 3, author: "정하영", color: "#5BA6E8", cohort: "6기", cat: "질문", ago: "어제",
      title: "혹시 프리랜서로 전향하신 선배님들 계신가요? 조언 구합니다",
      excerpt: "지금 다니는 회사랑 병행하다가 완전 독립할지 고민 중이에요…",
      body: "지금 다니는 회사랑 병행하면서 사이드로 프리랜서 프로젝트를 몇 개 진행 중인데, 완전히 독립할지 고민이 많습니다.\n\n특히 궁금한 부분은:\n1. 계약 단가를 어떻게 책정하셨는지\n2. 첫 고객은 어떻게 구하셨는지\n3. 4대보험이나 세금 처리는 어떻게 하시는지\n\n비슷한 고민 해보신 선배님들 계시면 댓글로 편하게 조언 부탁드려요!",
      likes: 18, comments: 15, views: 210 },
    { id: 4, author: "박지훈", color: "#8C72EE", cohort: "8기", cat: "축하해요", ago: "2일 전",
      title: "저 드디어 이직 성공했습니다 🎉 다 여기서 배운 덕분이에요",
      excerpt: "면접에서 포트폴리오 얘기했는데 반응이 좋았어요, 감사합니다…",
      body: "드디어 이직에 성공했습니다! 그로스 마케터로 시리즈B 스타트업에 합류하게 됐어요.\n\n면접에서 여기서 진행했던 AI 소재 생성 프로젝트랑 A/B 테스트 사례를 포트폴리오로 정리해서 보여드렸는데 반응이 정말 좋았습니다. 특히 실험 설계 과정을 구체적으로 설명한 게 도움이 많이 된 것 같아요.\n\n같이 스터디하고 피드백 주셨던 분들 모두 감사드립니다. 저도 이제 후배 기수들 도와드릴게요!",
      likes: 41, comments: 12, views: 512 },
  ],

  categories: ["전체", "잡담", "질문", "정보공유", "구인구직", "축하해요", "자유"],

  news: [
    { id: 1, cat: "model", tk: "모델", title: "새 멀티모달 모델 공개 — 이미지·표 이해력 대폭 향상", summary: "마케팅 리포트 자동 요약·해석에 바로 활용",
      body: "새로 공개된 멀티모달 모델이 이미지와 표 데이터 이해력에서 큰 폭으로 향상됐다. 복잡한 대시보드 스크린샷이나 엑셀 표를 그대로 붙여넣어도 핵심 지표를 정확히 추출해 요약해준다.\n\n마케터 입장에서는 매주 반복하던 리포트 요약·해석 작업을 크게 줄일 수 있을 것으로 기대된다. 업계에서는 특히 광고 성과 리포트, A/B 테스트 결과표 해석에 바로 적용 가능하다는 평가가 나온다.", source: "AI타임스", ago: "2시간 전" },
    { id: 2, cat: "mkt", tk: "마케팅", title: "메타, 생성형 광고 소재 자동화 툴 국내 정식 출시", summary: "캠페인 소재를 AI가 변형·A/B까지 자동 생성",
      body: "메타가 생성형 AI 기반 광고 소재 자동화 도구를 국내에 정식 출시했다. 기존 소재를 업로드하면 AI가 카피와 이미지를 자동으로 여러 버전으로 변형하고, 성과 데이터를 바탕으로 A/B 테스트까지 자동 진행한다.\n\n국내 대행사들은 소재 제작 리드타임이 크게 단축될 것으로 보고 있으며, 중소형 광고주들의 진입 장벽도 낮아질 전망이다.", source: "디지털데일리", ago: "5시간 전" },
    { id: 3, cat: "tool", tk: "툴", title: "노코드 자동화 툴에 AI 에이전트 기능 추가", summary: "업무 흐름을 말로 지시하면 자동 실행",
      body: "주요 노코드 자동화 플랫폼들이 잇따라 AI 에이전트 기능을 추가하고 있다. 사용자가 자연어로 '매주 월요일 아침에 지난주 광고 성과를 슬랙으로 보내줘' 같은 지시를 내리면, AI가 필요한 워크플로우를 스스로 구성해 실행한다.\n\n코딩 지식이 없는 마케터도 복잡한 업무 자동화를 직접 구축할 수 있게 되면서, 실무 생산성 도구로서의 활용도가 빠르게 확산되고 있다.", source: "바이라인", ago: "어제" },
    { id: 4, cat: "policy", tk: "정책", title: "개인정보위, AI 광고 데이터 활용 가이드라인 초안 공개", summary: "퍼스트파티 데이터 활용 시 유의점 정리",
      body: "개인정보보호위원회가 AI를 활용한 광고 데이터 처리에 관한 가이드라인 초안을 공개했다. 특히 퍼스트파티 데이터를 AI 학습에 활용할 때 이용자 동의 범위를 명확히 할 것을 강조했다.\n\n업계는 세부 시행 기준이 확정되기 전까지 관련 데이터 처리 프로세스를 점검해둘 필요가 있다는 반응이다.", source: "전자신문", ago: "2일 전" },
    { id: 5, cat: "mkt", tk: "마케팅", title: "그로스 마케터가 꼭 알아야 할 리텐션 지표 7가지", summary: "코호트 분석부터 실전 적용까지 총정리",
      body: "그로스 마케터라면 반드시 챙겨야 할 리텐션 지표 7가지를 정리했다.\n\n1. D1/D7/D30 리텐션\n2. 코호트별 리텐션 커브\n3. 활성 사용자 대비 이탈률\n4. 재구매 주기\n5. 세션당 체류시간 변화\n6. 기능별 재사용률\n7. NPS와 리텐션의 상관관계\n\n단순히 숫자를 트래킹하는 것을 넘어, 각 지표가 실제 액션으로 이어지도록 코호트 분석과 함께 보는 것이 핵심이다.", source: "그로스해커", ago: "3시간 전" },
    { id: 6, cat: "model", tk: "모델", title: "AI 매거진 10월호 — 생성형 AI 마케팅 활용 특집", summary: "국내외 캠페인 사례 12건 심층 분석",
      body: "이번 호에서는 국내외 브랜드가 생성형 AI를 실제 캠페인에 어떻게 활용했는지 12개 사례를 심층 분석했다.\n\n소재 생성부터 개인화 타겟팅, 챗봇 기반 CRM까지 다양한 활용 사례가 소개되며, 각 사례별 투입 비용 대비 성과(ROI)도 함께 정리했다. 특히 중소 브랜드가 적은 예산으로도 생성형 AI를 활용해 성과를 낸 사례가 눈에 띈다.", source: "AI 매거진", ago: "어제" },
  ],

  publishers: [
    { id: "aitimes", name: "AI타임스", desc: "국내 최대 AI 전문 매체. 속보 중심.", category: "뉴스" },
    { id: "digitaldaily", name: "디지털데일리", desc: "IT·디지털 산업 전문지", category: "뉴스" },
    { id: "byline", name: "바이라인", desc: "테크·스타트업 소식 큐레이션", category: "매거진" },
    { id: "etnews", name: "전자신문", desc: "전자·IT 산업 전문지", category: "뉴스" },
    { id: "growthhackers", name: "그로스해커", desc: "그로스 마케팅 인사이트 매거진", category: "매거진" },
    { id: "aimagazine", name: "AI 매거진", desc: "AI 트렌드·활용 사례 월간지", category: "매거진" },
  ],

  eventTypes: ["전체", "온라인", "오프라인", "온·오프라인", "특강"] as const,

  events: [
    { id: "ev1", title: "가을맞이 오프라인 밋업", type: "오프라인", level: "친목", price: "신청하기", date: "10.09(목) 19:00 · 강남 라운지", color: "var(--violet-deep)", image: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?auto=format&fit=crop&w=800&q=70" },
    { id: "ev2", title: "실전 대시보드 라이브 Q&A", type: "온라인", level: "무료", price: "신청하기", date: "10.15(수) 20:00 · Zoom", color: "var(--sky-deep)", image: "https://images.unsplash.com/photo-1760346547318-7e309662467d?auto=format&fit=crop&w=800&q=70" },
    { id: "ev3", title: "선배 기수 초청 커리어 토크", type: "온·오프라인", level: "무료", price: "신청하기", date: "10.22(수) 20:00 · 현장+온라인", color: "var(--warm-deep)", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=70" },
    { id: "ev4", title: "AI 카피라이팅 3시간 완성 특강", type: "특강", level: "유료", price: "₩29,000 신청", date: "10.28(수) 19:00 · Zoom", color: "var(--violet-2)", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=70" },
  ],

  noticeCategories: ["전체", "운영 공지", "커뮤니티 활동", "시스템"] as const,

  notices: [
    { id: 1, category: "운영 공지", pinned: true, title: "아르키 커뮤니티 이용 가이드 — 처음이라면 꼭 읽어주세요", date: "09.01", by: "운영팀",
      body: "아르키에 오신 것을 환영합니다! 처음 오셨다면 아래 내용을 꼭 확인해주세요.\n\n1. 프로필에서 기수·관심 분야를 등록해주세요.\n2. 자유수다에서 자기소개 글을 남겨보세요.\n3. 관심있는 교육 프로그램이나 이벤트는 '내 수업'에 담아두면 놓치지 않아요.\n4. 커뮤니티 이용 매너를 꼭 지켜주세요 (아래 공지 참고).\n\n궁금한 점은 언제든 자유수다에 남겨주시면 운영팀이나 다른 멤버들이 답변해드립니다." },
    { id: 2, category: "커뮤니티 활동", pinned: true, title: "10월 오프라인 밋업 장소가 강남 라운지로 확정됐어요", date: "09.28", by: "운영팀",
      body: "많은 분들이 기다려주신 10월 오프라인 밋업 장소가 강남 라운지로 확정됐습니다.\n\n일시: 10.09(목) 19:00\n장소: 강남 라운지 (강남역 3번 출구 도보 5분)\n\n가벼운 다과와 함께 기수 상관없이 자유롭게 네트워킹하는 자리입니다. 이벤트 페이지에서 신청해주세요!" },
    { id: 3, category: "시스템", pinned: false, title: "프로필 사진 업로드 기능이 추가됐습니다", date: "09.20", by: "운영팀",
      body: "요청이 많았던 프로필 사진 업로드 기능을 추가했습니다. 프로필 편집에서 바로 등록하실 수 있어요.\n\n기본 이니셜 아바타가 싫으셨던 분들은 지금 바로 등록해보세요!" },
    { id: 4, category: "운영 공지", pinned: false, title: "커뮤니티 이용 매너 관련 안내드립니다", date: "09.12", by: "운영팀",
      body: "쾌적한 커뮤니티를 위해 아래 사항을 안내드립니다.\n\n- 광고성 글, 무분별한 홍보는 삼가주세요.\n- 서로 존중하는 언어를 사용해주세요.\n- 채용·구인 정보는 #구인구직 태그를 꼭 붙여주세요.\n\n신고가 누적되는 경우 별도 안내 없이 게시글이 삭제될 수 있습니다." },
    { id: 5, category: "커뮤니티 활동", pinned: false, title: "10월 멘토링 신청 기간 안내 (~10.05)", date: "09.05", by: "운영팀",
      body: "10월 멘토링 프로그램 신청을 10.05(월)까지 받습니다.\n\n멘토링 신청 페이지에서 관심 분야에 맞는 멘토를 선택해 매칭 신청을 남겨주세요. 매칭 결과는 신청 마감 후 3일 이내에 개별 안내드립니다." },
    { id: 6, category: "시스템", pinned: false, title: "야간 서버 점검 안내 (10.03 02:00~04:00)", date: "09.30", by: "운영팀",
      body: "보다 안정적인 서비스 제공을 위해 아래 시간에 서버 점검이 진행됩니다.\n\n일시: 10.03(토) 02:00 ~ 04:00\n영향: 점검 시간 동안 일시적으로 접속이 어려울 수 있습니다.\n\n이용에 불편을 드려 죄송합니다." },
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
      room: { notices: [], materials: [], assignments: [] },
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
      room: { notices: [], materials: [], assignments: [] },
      alumni: { jobs: [], nextSessions: [] },
    },
    {
      id: "ga4-oneday", kind: "특별", status: "모집 중", title: "하루만에 끝내는 GA4 세팅 특강", format: "오프라인 · 1일",
      schedule: "10.18(토) 10:00~17:00 · 강남 라운지", price: "₩59,000", students: 0,
      summary: "이벤트 설계부터 리포트 확인까지, 하루 만에 GA4 세팅을 끝내는 초압축 워크숍입니다.",
      curriculum: ["오전 · GA4 계정·속성·이벤트 설계", "오후 · 전환 설정과 리포트 실습"],
      color: "var(--warm-deep)",
      room: { notices: [], materials: [], assignments: [] },
      alumni: { jobs: [], nextSessions: [] },
    },
    {
      id: "copywriting-twoday", kind: "특별", status: "모집 중", title: "이틀 완성 AI 카피라이팅 캠프", format: "온라인 · 2일",
      schedule: "10.25(토)~10.26(일) 19:00~21:00 · Zoom", price: "₩89,000", students: 0,
      summary: "AI로 카피 초안을 뽑고 다듬는 법을 이틀 동안 집중적으로 실습합니다.",
      curriculum: ["1일차 · AI 카피 브리프·초안 생성", "2일차 · 톤 다듬기와 A/B 테스트 카피 뽑기"],
      color: "var(--sky-deep)",
      room: { notices: [], materials: [], assignments: [] },
      alumni: { jobs: [], nextSessions: [] },
    },
  ],
};
export type Seed = typeof seed;
