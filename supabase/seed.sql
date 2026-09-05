-- ================================================================
-- 루프 커뮤니티 · 시드 데이터 (선택)
-- schema.sql 실행 후, 데모 데이터를 넣고 싶을 때 실행하세요.
-- (게시글/멘토 등은 author 없이 넣기 위해 예시 텍스트 위주)
-- ================================================================

insert into categories (slug, name) values
  ('notice','공지'), ('qna','실무 Q&A'), ('resource','자료 공유'),
  ('marketing','콘텐츠·마케팅'), ('data','데이터 분석'), ('ai','AI 활용'), ('free','자유')
on conflict (slug) do nothing;

insert into cohorts (name, title, starts_on, ends_on, status, total_weeks, current_week) values
  ('7기','AI 마케팅 부트캠프','2026-07-01','2026-10-30','active',14,11),
  ('8기','AI 마케팅 부트캠프','2026-06-01','2026-09-15','done',14,14),
  ('9기','AI 마케팅 부트캠프','2026-10-01','2027-01-15','recruiting',14,0);

insert into courses (title, module, instructor_name, cover, price, list_price, rating, rating_count, duration, access) values
  ('GA4 완전정복: 이벤트부터 리포트까지','MODULE 03','이서연 멘토','ill-analytics',89000,120000,4.9,126,'8시간','public'),
  ('데이터 마케팅 입문 30분','MODULE 01','유진','ill-content',0,null,4.8,210,'32분','public'),
  ('AI로 광고 소재 10배 빠르게 만들기','MODULE 07','정하영 멘토','ill-ai',69000,null,5.0,74,'4시간','member'),
  ('퍼널·리텐션 대시보드 실전','MODULE 05','박지훈 멘토','ill-funnel',79000,null,4.7,58,'5시간','member'),
  ('콘텐츠 카피라이팅 AI 워크플로우','TEMPLATE','이서연 멘토','ill-content',59000,null,4.9,96,'3시간','member'),
  ('비전공자를 위한 SQL 첫걸음','MODULE 02','정하영 멘토','ill-video',0,null,4.8,180,'45분','public');

insert into assignments (week, title, due_on) values
  (8,'지표 설계 실습','2026-09-08'),
  (9,'광고 성과 통합 분석','2026-09-15'),
  (10,'BigQuery 퍼널 쿼리','2026-09-22'),
  (11,'리텐션 분석 리포트','2026-10-11'),
  (12,'대시보드 설계 과제','2026-10-18');

insert into mentors (name, headline, tags, rating, mentee_count, response_time, available, avatar_color) values
  ('이서연','퍼포먼스 마케팅 리드 · 경력 8년', array['GA4','퍼포먼스 광고','리포트 자동화'], 4.9, 42, '1시간', true, '#6A47E0'),
  ('정하영','데이터 분석가 · 경력 6년', array['SQL·BigQuery','퍼널 분석','대시보드'], 4.8, 31, '2시간', true, '#54C39A'),
  ('박지훈','그로스 마케터 · 경력 5년', array['AI 소재 생성','A/B 테스트','콘텐츠'], 4.7, 26, '당일', false, '#5AA6E8'),
  ('이도라','콘텐츠·브랜드 · 경력 7년', array['카피라이팅','브랜드','SNS'], 5.0, 38, '1시간', true, '#F0996E');

insert into news (category, title, summary, source, published_at) values
  ('model','새 멀티모달 모델 공개 — 이미지·표 이해력 대폭 향상','마케팅 리포트 자동 요약·해석에 바로 활용 가능','AI타임스', now() - interval '2 hours'),
  ('mkt','메타, 생성형 광고 소재 자동화 툴 국내 정식 출시','캠페인 소재를 AI가 변형·A/B까지 자동 생성','디지털데일리', now() - interval '5 hours'),
  ('tool','노코드 자동화 툴에 AI 에이전트 기능 추가','업무 흐름을 말로 지시하면 자동 실행','바이라인', now() - interval '1 day'),
  ('policy','개인정보위, AI 광고 데이터 활용 가이드라인 초안 공개','퍼스트파티 데이터 활용 시 유의점 정리','전자신문', now() - interval '2 days');

insert into events (title, level, price, starts_at, place, color) values
  ('AI 마케팅 쇼케이스','입문 · 무료',0,'2026-10-09 20:00+09','온라인','var(--violet-deep)'),
  ('실전 대시보드 라이브','중급 · 무료',0,'2026-10-15 20:00+09','Zoom','var(--sky-deep)'),
  ('그로스 마케팅 마스터','특강 · 유료',39000,'2026-10-22 20:00+09','현장+온라인','var(--warm-deep)');
