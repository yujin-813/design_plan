export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Supabase가 설정되었는지 여부. false면 앱은 시드 데이터로 동작합니다.
export const supabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
