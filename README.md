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

## 문서(기획서) — `/docs`

기획서를 Claude 계정 없이도 볼 수 있고, 댓글·버전 기록까지 되는 자체 페이지로 넣었습니다.

- **내용**: `src/content/docs/<slug>.html` (순수 HTML 조각, 스타일은 `globals.css`의 `.doc-content`가 담당)
- **버전 기록**: 별도 DB 없이 **git 커밋 이력**을 그대로 씁니다 (`/docs/[slug]/history`). 문서를 고치고 `git commit`하면 그게 새 버전이 됩니다.
  ```bash
  # 예: 기획서 내용을 고친 뒤
  git add src/content/docs/arki-spec.html
  git commit -m "기획서: OO 섹션 내용 업데이트"
  ```
- **댓글**: `data/doc-comments.json`에 저장됩니다 (서버 파일 기반이라 브라우저와 무관하게 모든 방문자가 같은 댓글을 봄).

### ⚠️ 배포 시 꼭 알아야 할 것 (파일 기반 저장의 한계)
댓글(`data/doc-comments.json`)과 과제 제출 파일(`public/uploads/`)은 **서버 로컬 디스크**에 씁니다. 이 방식은:
- ✅ 일반 Node 서버(VPS, Railway, Render, Fly.io, Docker 등 `npm run build && npm start`로 계속 떠있는 서버)에서는 정상 작동하고 재시작해도 유지됩니다.
- ❌ **Vercel/Netlify 같은 서버리스 배포에서는 파일 쓰기가 요청마다 초기화되거나 읽기 전용이라 댓글·업로드가 저장되지 않습니다.** 서브도메인에 배포할 계획이라면 서버리스가 아닌 방식(예: VPS에 직접 배포하거나 Railway/Render 같은 "항상 켜져 있는" 호스팅)을 쓰세요.
- 정말 서버리스로 가야 한다면, `data/doc-comments.json`·`public/uploads`를 Supabase(이미 연동 준비돼 있음)나 S3 같은 외부 저장소로 옮기는 작업이 추가로 필요합니다.

### 서브도메인 연결 (예: docs.내도메인.com)
1. 이 저장소를 GitHub에 push
2. Railway/Render 등에서 이 저장소를 배포 (Node 앱으로, `npm run build` → `npm start`)
3. 호스팅 서비스의 "Custom Domain" 설정에서 원하는 서브도메인 입력
4. 도메인 등록업체(가비아, 후이즈 등) DNS에 안내받은 CNAME 레코드 추가
5. 전파 후 서브도메인으로 접속하면 끝 (이 부분은 계정 정보가 필요해서 직접 실행은 어렵고, 여기까지 안내만 가능합니다)

## 색·이미지
- 그라데이션 없이 단색 + 플랫 SVG 일러스트(`globals.css`의 `.ill-*`)로 카드 커버를 그립니다.
- 실제 사진을 쓰려면 `.ill-*` 대신 `<img>` 또는 `background-image: url(...)`로 교체하세요.
