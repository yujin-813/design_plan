import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { seed } from "@/lib/seed";
import { SESSION_COOKIE } from "@/lib/auth";

export type PostView = {
  id: number | string;
  author: string;
  color: string;
  cohort: string;
  cat: string;
  ago: string;
  title: string;
  excerpt: string;
  body: string;
  likes: number;
  comments: number;
  views: number;
};

function ago(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3.6e6);
  if (h < 1) return "방금 전";
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  return d === 1 ? "어제" : `${d}일 전`;
}

// 로그인한 사용자의 표시 이름/기수 (없으면 시드)
export async function getProfile() {
  if (cookies().get(SESSION_COOKIE)?.value === "1") return { ...seed.me, signedIn: true };

  const supabase = createClient();
  if (!supabase) return { ...seed.me, signedIn: false };
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ...seed.me, signedIn: false };
  const { data: p } = await supabase
    .from("profiles")
    .select("name, cohort, role")
    .eq("id", auth.user.id)
    .single();
  return {
    name: p?.name || auth.user.email?.split("@")[0] || "회원",
    cohort: p?.cohort || "게스트",
    role: p?.role || "member",
    signedIn: true,
  };
}

// 게시글 목록 (DB → 시드 폴백)
export async function getPosts(): Promise<PostView[]> {
  const supabase = createClient();
  if (!supabase) return seed.posts;
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("id,title,body,views,created_at,categories(name),profiles(name,cohort,avatar_color)")
      .order("created_at", { ascending: false })
      .limit(30);
    if (error || !data || data.length === 0) return seed.posts;
    return data.map((r: any) => ({
      id: r.id,
      author: r.profiles?.name ?? "회원",
      color: r.profiles?.avatar_color ?? "#6a47e0",
      cohort: r.profiles?.cohort ?? "",
      cat: r.categories?.name ?? "자유",
      ago: ago(r.created_at),
      title: r.title,
      excerpt: (r.body ?? "").slice(0, 60),
      body: r.body ?? "",
      likes: 0,
      comments: 0,
      views: r.views ?? 0,
    }));
  } catch {
    return seed.posts;
  }
}

export async function getPost(id: string): Promise<PostView | undefined> {
  const posts = await getPosts();
  return posts.find((p) => String(p.id) === id);
}
