// 읽음 표시는 개인적인 흔적이라 브라우저(localStorage)에 남겨둡니다.
// 댓글은 서버(data/comments.json)로 옮겼습니다 — @/lib/comments 참고.
const READ_KEY = "arki-reads";

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
