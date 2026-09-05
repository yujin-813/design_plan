-- ================================================================
-- 루프 커뮤니티 · DB 스키마 (Supabase / PostgreSQL)
-- Supabase 프로젝트 > SQL Editor 에 붙여넣고 실행하세요.
-- ================================================================

-- 프로필 (auth.users 와 1:1)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  cohort text,                       -- 예: '7기'
  role text not null default 'member', -- member | mentor | admin
  avatar_color text default '#6A47E0',
  bio text,
  created_at timestamptz not null default now()
);

-- 기수
create table if not exists cohorts (
  id bigint generated always as identity primary key,
  name text not null,                -- '7기'
  title text,                        -- 'AI 마케팅 부트캠프'
  starts_on date,
  ends_on date,
  status text not null default 'active', -- recruiting | active | done
  total_weeks int default 14,
  current_week int default 1
);

-- 게시판 카테고리
create table if not exists categories (
  id bigint generated always as identity primary key,
  slug text unique not null,         -- 'qna' | 'resource' | 'marketing' ...
  name text not null                 -- '실무 Q&A'
);

-- 게시글
create table if not exists posts (
  id bigint generated always as identity primary key,
  author_id uuid references profiles(id) on delete set null,
  category_id bigint references categories(id),
  title text not null,
  body text,
  views int not null default 0,
  created_at timestamptz not null default now()
);

-- 댓글
create table if not exists comments (
  id bigint generated always as identity primary key,
  post_id bigint references posts(id) on delete cascade,
  author_id uuid references profiles(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

-- 강의 (스토어 + 내 강의)
create table if not exists courses (
  id bigint generated always as identity primary key,
  title text not null,
  module text,                       -- 'MODULE 03 · 광고분석'
  instructor_id uuid references profiles(id),
  instructor_name text,
  cover text default 'ill-analytics',-- 일러스트 클래스 or 이미지 URL
  price int not null default 0,       -- 0 = 무료 (원 단위)
  list_price int,                     -- 정가(할인 표시용)
  rating numeric(2,1) default 4.8,
  rating_count int default 0,
  duration text,                      -- '8시간'
  access text not null default 'public' -- public | member (수료 등급)
);

-- 수강 진행
create table if not exists enrollments (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id) on delete cascade,
  course_id bigint references courses(id) on delete cascade,
  lessons_done int default 0,
  lessons_total int default 10,
  unique(user_id, course_id)
);

-- 과제
create table if not exists assignments (
  id bigint generated always as identity primary key,
  cohort_id bigint references cohorts(id),
  week int not null,
  title text not null,
  due_on date
);

-- 과제 제출
create table if not exists submissions (
  id bigint generated always as identity primary key,
  assignment_id bigint references assignments(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  status text not null default 'todo', -- todo | submitted | graded
  score int,
  feedback text,
  submitted_at timestamptz,
  unique(assignment_id, user_id)
);

-- 멘토
create table if not exists mentors (
  id bigint generated always as identity primary key,
  profile_id uuid references profiles(id),
  name text not null,
  headline text,                     -- '퍼포먼스 마케팅 리드 · 경력 8년'
  tags text[] default '{}',
  rating numeric(2,1) default 4.8,
  mentee_count int default 0,
  response_time text,                -- '1시간'
  available boolean default true,
  avatar_color text default '#6A47E0'
);

-- AI 뉴스
create table if not exists news (
  id bigint generated always as identity primary key,
  category text not null default 'tool', -- model | tool | mkt | policy
  title text not null,
  summary text,
  source text,
  published_at timestamptz not null default now()
);

-- 이벤트 (웨비나/특강)
create table if not exists events (
  id bigint generated always as identity primary key,
  title text not null,
  level text,                        -- '입문 · 무료'
  price int default 0,
  starts_at timestamptz,
  place text,                        -- '온라인' | 'Zoom'
  color text default 'var(--violet-deep)'
);

-- ================================================================
-- RLS (Row Level Security)
-- ================================================================
alter table profiles      enable row level security;
alter table posts         enable row level security;
alter table comments      enable row level security;
alter table submissions   enable row level security;
alter table enrollments   enable row level security;

-- 읽기 공개 테이블 (RLS 없이 anon 읽기 허용)
alter table cohorts      enable row level security;
alter table categories   enable row level security;
alter table courses      enable row level security;
alter table assignments  enable row level security;
alter table mentors      enable row level security;
alter table news         enable row level security;
alter table events       enable row level security;

-- 공개 읽기 정책
do $$
declare t text;
begin
  foreach t in array array['cohorts','categories','courses','assignments','mentors','news','events','profiles','posts','comments']
  loop
    execute format('drop policy if exists "read_all_%1$s" on %1$s;', t);
    execute format('create policy "read_all_%1$s" on %1$s for select using (true);', t);
  end loop;
end $$;

-- 프로필: 본인만 수정/삽입
drop policy if exists "profiles_self_write" on profiles;
create policy "profiles_self_write" on profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles_self_update" on profiles;
create policy "profiles_self_update" on profiles for update using (auth.uid() = id);

-- 게시글/댓글: 로그인 사용자가 작성, 본인만 수정/삭제
drop policy if exists "posts_insert" on posts;
create policy "posts_insert" on posts for insert with check (auth.uid() = author_id);
drop policy if exists "posts_update" on posts;
create policy "posts_update" on posts for update using (auth.uid() = author_id);
drop policy if exists "comments_insert" on comments;
create policy "comments_insert" on comments for insert with check (auth.uid() = author_id);

-- 제출/수강: 본인 것만
drop policy if exists "submissions_own" on submissions;
create policy "submissions_own" on submissions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "enrollments_own" on enrollments;
create policy "enrollments_own" on enrollments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 신규 가입 시 프로필 자동 생성
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)));
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
