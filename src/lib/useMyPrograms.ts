"use client";
import { useEffect, useState } from "react";
import { seed } from "@/lib/seed";
import { getSubscriptions } from "@/components/SubscribeButton";

// 내 수업 = 계정에 담아둔 수업. 서버에서 구독 목록을 받아온 뒤에 채워집니다.
// 아직 로딩 중이면 null 을 돌려줘서 "담은 수업이 없음"과 구분합니다.
export function useMyPrograms() {
  const [programs, setPrograms] = useState<typeof seed.programs | null>(null);

  useEffect(() => {
    const load = () => {
      const subs = getSubscriptions();
      if (!subs) return; // 아직 로딩 전 — 응답이 오면 이벤트로 다시 불립니다.
      setPrograms(seed.programs.filter((p) => subs.programs.includes(p.id)));
    };
    load();
    window.addEventListener("arki-subscriptions-change", load);
    return () => window.removeEventListener("arki-subscriptions-change", load);
  }, []);

  return programs;
}
