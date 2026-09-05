# 루프 커뮤니티 (가칭)

AI 마케팅 교육 수료생 커뮤니티 — 자체 웹 플랫폼 **1단계 MVP**.
Next.js(App Router) + TypeScript + Supabase. **Supabase 없이도 시드 데이터로 바로 실행**됩니다.

## 화면
홈 · AI 뉴스 · 커뮤니티 이벤트 · 내 기수 활동 · 과제 제출 · 스터디 게시글(커뮤니티) · 강의 스토어 · 내 강의 · 선생님 매칭 · 프로필 · 로그인/회원가입

## 바로 실행 (데모 모드)
```bash
npm install
npm run dev
# http://localhost:3000
```
Supabase를 아직 안 붙여도 모든 화면이 시드 데이터로 뜹니다.
로그인 화면에서 아무 값이나 넣고 "로그인"하면 홈으로 들어갑니다.

## 실제 DB 붙이기 (Supabase)
1. https://supabase.com 에서 프로젝트 생성
2. **SQL Editor**에 `supabase/schema.sql` 붙여넣고 실행 (테이블 + RLS + 가입 트리거)
3. 데모 데이터가 필요하면 `supabase/seed.sql`도 실행
4. 프로젝트 **Settings > API**에서 URL·anon key 복사 → `.env.local` 생성:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
5. `npm run dev` 재시작 → 회원가입/로그인, 게시글 작성이 **실제로 저장**됩니다.

## 배포 (Vercel)
1. 이 폴더를 GitHub에 올리고 Vercel에서 Import
2. Environment Variables에 위 두 값 추가
3. Deploy

## 지금 실제로 연결된 것 / 남은 것
- ✅ 인증(회원가입·로그인, 가입 시 프로필 자동 생성)
- ✅ 커뮤니티 글쓰기 → posts 테이블 저장·목록 표시 (RLS 적용)
- ✅ 프로필/기수 표시가 로그인 사용자와 연동
- ⏳ 나머지 화면(강의·과제·멘토·뉴스·이벤트)은 스키마·시드까지 준비됨 →
  `src/lib/data.ts`의 `getPosts` 패턴을 복사해 각 테이블을 읽어오면 DB 연동 완료
- ⏳ 결제(토스페이먼츠/포트원), 영상 스트리밍(Mux/Vimeo)은 2단계

## 구조
```
src/
  app/
    (app)/            # 로그인 후 화면 (사이드바 레이아웃)
      page.tsx        # 홈
      community/  assignments/  store/  courses/
      cohort/  mentors/  news/  events/  profile/
      layout.tsx      # AppShell + 프로필 로드
    login/  signup/   # 인증
    globals.css       # 디자인 시스템(디자인 토큰 + 컴포넌트 + 플랫 일러스트)
    layout.tsx
  components/
    AppShell.tsx      # 사이드바 메뉴 + 상단바 + 모바일 토글 + 다크모드
    NewPostForm.tsx   # 글쓰기 폼(Supabase insert)
  lib/
    seed.ts           # 시드(데모) 데이터
    data.ts           # DB→시드 폴백 데이터 레이어
    supabase/         # 클라이언트/서버 Supabase + 설정
supabase/
  schema.sql          # 테이블 + RLS + 트리거
  seed.sql            # 데모 데이터
```

## 색·이미지
- 그라데이션 없이 단색 + 플랫 SVG 일러스트(`globals.css`의 `.ill-*`)로 카드 커버를 그립니다.
- 실제 사진을 쓰려면 `.ill-*` 대신 `<img>` 또는 `background-image: url(...)`로 교체하세요.
