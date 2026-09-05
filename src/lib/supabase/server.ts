import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON_KEY, supabaseEnabled } from "./config";

// 서버 컴포넌트/route 에서 쓰는 Supabase 클라이언트.
// Supabase 미설정 시 null 을 반환하고, 호출부는 시드 데이터로 폴백합니다.
export function createClient() {
  if (!supabaseEnabled) return null;
  const cookieStore = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // 서버 컴포넌트에서 set 호출 시 무시 (미들웨어에서 갱신)
        }
      },
    },
  });
}
