"use client";
import { useEffect, useState } from "react";

const KEY = "arki-subscriptions";

type Kind = "programs" | "events" | "publishers";
type Store = { programs: string[]; events: string[]; publishers: string[] };

// 처음 방문한 사용자도 채워진 화면을 보도록 하는 기본 데모 구독 상태.
// localStorage에 아무것도 저장된 적이 없을 때만 적용됩니다.
const DEFAULT_STORE: Store = {
  programs: ["ai-growth-7"],
  events: ["ev1", "ev2"],
  publishers: ["aitimes", "growthhackers"],
};

function readStore(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STORE };
    return { programs: [], events: [], publishers: [], ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STORE };
  }
}

function writeStore(store: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
    window.dispatchEvent(new Event("arki-subscriptions-change"));
  } catch {
    // ignore
  }
}

export function isSubscribed(kind: Kind, id: string): boolean {
  return readStore()[kind].includes(id);
}

export function getSubscriptions(): Store {
  return readStore();
}

export default function SubscribeButton({ kind, id, label }: { kind: Kind; id: string; label?: string }) {
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOn(isSubscribed(kind, id));
    setReady(true);
  }, [kind, id]);

  function toggle() {
    const store = readStore();
    const set = new Set(store[kind]);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    const next = { ...store, [kind]: [...set] };
    writeStore(next);
    setOn(set.has(id));
  }

  if (!ready) return null;

  const defaultLabel = kind === "programs" ? "+ 내 수업에 담기" : "+ 구독";
  const onLabel = kind === "programs" ? "✓ 내 수업" : "✓ 구독 중";

  return (
    <button
      className={"btn sm" + (on ? " v" : "")}
      onClick={toggle}
      type="button"
    >
      {on ? onLabel : (label ?? defaultLabel)}
    </button>
  );
}
