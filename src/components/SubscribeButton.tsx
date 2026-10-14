"use client";
import { useEffect, useState } from "react";

export type Kind = "programs" | "events" | "publishers";
export type Store = { programs: string[]; events: string[]; publishers: string[] };

const EMPTY: Store = { programs: [], events: [], publishers: [] };
const CHANGE_EVENT = "arki-subscriptions-change";

// 구독은 서버(계정)에 저장됩니다. 여기 캐시는 화면을 바로 그리기 위한 사본이고,
// 처음 한 번 /api/subscriptions 에서 받아옵니다.
let cache: Store | null = null;
let loading: Promise<void> | null = null;

function announce() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function ensureLoaded() {
  if (cache || loading) return loading ?? Promise.resolve();
  loading = fetch("/api/subscriptions")
    .then((r) => (r.ok ? r.json() : EMPTY))
    .then((s: Partial<Store>) => {
      cache = { ...EMPTY, ...s };
    })
    .catch(() => {
      cache = { ...EMPTY };
    })
    .finally(() => {
      loading = null;
      announce();
    });
  return loading;
}

// 아직 서버 응답 전이면 null 입니다. (빈 화면과 구분하기 위해)
export function getSubscriptions(): Store | null {
  if (typeof window === "undefined") return null;
  if (!cache) {
    ensureLoaded();
    return null;
  }
  return cache;
}

export function isSubscribed(kind: Kind, id: string): boolean {
  return (cache ?? EMPTY)[kind].includes(id);
}

// 로그아웃할 때 다음 사람에게 이전 사람 구독이 보이지 않도록 비웁니다.
export function clearSubscriptionCache() {
  cache = null;
  loading = null;
}

export default function SubscribeButton({ kind, id, label }: { kind: Kind; id: string; label?: string }) {
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const sync = () => {
      if (!cache) return;
      setOn(isSubscribed(kind, id));
      setReady(true);
    };
    sync();
    if (!cache) ensureLoaded();
    window.addEventListener(CHANGE_EVENT, sync);
    return () => window.removeEventListener(CHANGE_EVENT, sync);
  }, [kind, id]);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    // 먼저 화면을 바꿔두고(낙관적), 서버 응답으로 확정합니다.
    const prev = on;
    setOn(!prev);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, id }),
      });
      // 비회원은 구독할 수 없으니 로그인 화면으로 보냅니다.
      if (res.status === 401) {
        setOn(prev);
        window.location.href = "/login";
        return;
      }
      if (!res.ok) throw new Error("failed");
      cache = { ...EMPTY, ...(await res.json()) };
      setOn(isSubscribed(kind, id));
      announce();
    } catch {
      setOn(prev); // 실패하면 되돌립니다.
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return null;

  const defaultLabel = kind === "programs" ? "+ 내 수업에 담기" : "+ 구독";
  const onLabel = kind === "programs" ? "✓ 내 수업" : "✓ 구독 중";

  return (
    <button className={"btn sm" + (on ? " v" : "")} onClick={toggle} disabled={busy} type="button">
      {on ? onLabel : (label ?? defaultLabel)}
    </button>
  );
}
