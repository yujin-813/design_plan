"use client";
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, supabaseEnabled } from "./config";

// 클라이언트 컴포넌트(로그인/회원가입/글쓰기)에서 쓰는 Supabase 클라이언트.
// 미설정 시 null 을 반환합니다.
export function createClient() {
  if (!supabaseEnabled) return null;
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export { supabaseEnabled };
