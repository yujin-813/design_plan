"use client";
import { useEffect, useState } from "react";
import { seed } from "@/lib/seed";
import { getSubscriptions } from "@/components/SubscribeButton";

export function useMyPrograms() {
  const [programs, setPrograms] = useState<typeof seed.programs | null>(null);

  useEffect(() => {
    const load = () => {
      const subs = getSubscriptions();
      setPrograms(seed.programs.filter((p) => subs.programs.includes(p.id)));
    };
    load();
    window.addEventListener("arki-subscriptions-change", load);
    return () => window.removeEventListener("arki-subscriptions-change", load);
  }, []);

  return programs;
}
