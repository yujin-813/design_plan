const READ_KEY = "arki-reads";
const COMMENTS_KEY = "arki-comments";

export type Comment = { author: string; text: string; at: string };

// 데모용 기본 댓글 — 처음 방문해도 대화가 오가는 것처럼 보이도록.
const DEFAULT_COMMENTS: Record<string, Comment[]> = {
  "news:1": [
    { author: "정하영", text: "저희 팀도 이거 리포트에 바로 적용해봤어요, 시간 확실히 줄어드네요.", at: "1시간 전" },
    { author: "박지훈", text: "이미지 이해력 얼마나 좋아졌는지 궁금하네요 👀", at: "42분 전" },
  ],
  "news:5": [
    { author: "이서연", text: "리텐션 지표 정리 진짜 깔끔하네요, 스크랩 감사합니다!", at: "2시간 전" },
  ],
  "post:1": [
    { author: "이서연", text: "저도 그 카페 가봤어요! 라떼 진짜 맛있죠 ☕", at: "1시간 전" },
  ],
  "post:2": [
    { author: "박지훈", text: "감사합니다! 바로 써볼게요.", at: "3시간 전" },
    { author: "정하영", text: "틱톡 시트 항목이 특히 유용하네요.", at: "2시간 전" },
  ],
  "notice:2": [
    { author: "김민재", text: "장소 확정 감사합니다! 신청했어요.", at: "1일 전" },
  ],
};

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function isRead(topicId: string): boolean {
  return readJSON<string[]>(READ_KEY, []).includes(topicId);
}

export function markRead(topicId: string) {
  try {
    const ids = new Set(readJSON<string[]>(READ_KEY, []));
    if (ids.has(topicId)) return;
    ids.add(topicId);
    localStorage.setItem(READ_KEY, JSON.stringify([...ids]));
    window.dispatchEvent(new Event("arki-interaction-change"));
  } catch {
    // ignore
  }
}

export function getComments(topicId: string): Comment[] {
  const defaults = DEFAULT_COMMENTS[topicId] || [];
  const all = readJSON<Record<string, Comment[]>>(COMMENTS_KEY, {});
  return [...defaults, ...(all[topicId] || [])];
}

export function addComment(topicId: string, c: Comment) {
  try {
    const all = readJSON<Record<string, Comment[]>>(COMMENTS_KEY, {});
    all[topicId] = [...(all[topicId] || []), c];
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event("arki-interaction-change"));
  } catch {
    // ignore
  }
}
