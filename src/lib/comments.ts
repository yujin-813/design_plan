import fs from "fs";
import path from "path";

// 댓글은 서버에 저장합니다. 예전에는 브라우저 localStorage에 있어서
// 내가 쓴 댓글이 다른 사람에게 보이지 않았습니다.
const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "comments.json");

export type StoredComment = {
  id: string;
  topicId: string;
  author: string;
  authorEmail: string;
  cohort: string;
  text: string;
  createdAt: string;
};

// 화면에 보내는 형태 (이메일은 감춥니다)
export type CommentView = {
  id: string;
  author: string;
  cohort: string;
  text: string;
  at: string;
  mine: boolean;
};

// 처음 둘러보는 사람에게도 대화가 오가는 것처럼 보이게 하는 예시 댓글.
// 운영팀이 작성한 것으로 표시되며, 실제 회원 댓글과 섞여 시간순으로 나옵니다.
const SAMPLE: Record<string, Array<{ author: string; cohort: string; text: string; at: string }>> = {
  "news:1": [
    { author: "정하영", cohort: "3기", text: "저희 팀도 이거 리포트에 바로 적용해봤어요, 시간 확실히 줄어드네요.", at: "1시간 전" },
    { author: "박지훈", cohort: "3기", text: "이미지 이해력 얼마나 좋아졌는지 궁금하네요 👀", at: "42분 전" },
  ],
  "news:5": [
    { author: "이서연", cohort: "멘토", text: "리텐션 지표 정리 진짜 깔끔하네요, 스크랩 감사합니다!", at: "2시간 전" },
  ],
  "post:1": [
    { author: "이서연", cohort: "멘토", text: "저도 그 카페 가봤어요! 라떼 진짜 맛있죠 ☕", at: "1시간 전" },
  ],
  "post:2": [
    { author: "박지훈", cohort: "3기", text: "감사합니다! 바로 써볼게요.", at: "3시간 전" },
    { author: "정하영", cohort: "3기", text: "틱톡 시트 항목이 특히 유용하네요.", at: "2시간 전" },
  ],
  "notice:2": [
    { author: "김민재", cohort: "3기", text: "장소 확정 감사합니다! 신청했어요.", at: "1일 전" },
  ],
};

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf-8");
}

function readAll(): StoredComment[] {
  ensure();
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writeAll(list: StoredComment[]) {
  ensure();
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2), "utf-8");
}

export function ago(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  return d === 1 ? "어제" : `${d}일 전`;
}

export function listComments(topicId: string, viewerEmail: string | null): CommentView[] {
  const samples = (SAMPLE[topicId] ?? []).map((c, i) => ({
    id: `sample-${topicId}-${i}`,
    author: c.author,
    cohort: c.cohort,
    text: c.text,
    at: c.at,
    mine: false,
  }));

  const real = readAll()
    .filter((c) => c.topicId === topicId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((c) => ({
      id: c.id,
      author: c.author,
      cohort: c.cohort,
      text: c.text,
      at: ago(c.createdAt),
      mine: viewerEmail ? c.authorEmail === viewerEmail : false,
    }));

  return [...samples, ...real];
}

export function addComment(input: {
  topicId: string;
  author: string;
  authorEmail: string;
  cohort: string;
  text: string;
}): CommentView {
  const c: StoredComment = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    topicId: input.topicId,
    author: input.author,
    authorEmail: input.authorEmail,
    cohort: input.cohort,
    text: input.text,
    createdAt: new Date().toISOString(),
  };
  const all = readAll();
  all.push(c);
  writeAll(all);
  return { id: c.id, author: c.author, cohort: c.cohort, text: c.text, at: "방금 전", mine: true };
}

export function countComments(topicId: string): number {
  return (SAMPLE[topicId]?.length ?? 0) + readAll().filter((c) => c.topicId === topicId).length;
}

/** 이 사람이 쓴 댓글 수 (프로필 표시용) */
export function countCommentsBy(email: string): number {
  return readAll().filter((c) => c.authorEmail === email).length;
}
