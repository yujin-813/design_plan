import fs from "fs";
import path from "path";

// 회원이 쓴 자유수다 글. 작성자는 서버가 세션에서 채웁니다.
const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "posts.json");

export type StoredPost = {
  id: string;
  author: string;
  authorEmail: string;
  cohort: string;
  color: string;
  cat: string;
  title: string;
  body: string;
  createdAt: string;
  views: number;
  likes: number;
};

// 이름에서 아바타 색을 정해 같은 사람은 늘 같은 색이 되게 합니다.
const PALETTE = ["#3E9C7D", "#E8834E", "#6a47e0", "#2f7fd4", "#c2456b", "#1f9b9b"];

export function colorFor(key: string) {
  let n = 0;
  for (const ch of key) n = (n + ch.charCodeAt(0)) % 997;
  return PALETTE[n % PALETTE.length];
}

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf-8");
}

export function readPosts(): StoredPost[] {
  ensure();
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writePosts(list: StoredPost[]) {
  ensure();
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2), "utf-8");
}

export function addPost(input: {
  author: string;
  authorEmail: string;
  cohort: string;
  cat: string;
  title: string;
  body: string;
}): StoredPost {
  const post: StoredPost = {
    id: `p${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    author: input.author,
    authorEmail: input.authorEmail,
    cohort: input.cohort,
    color: colorFor(input.authorEmail),
    cat: input.cat,
    title: input.title,
    body: input.body,
    createdAt: new Date().toISOString(),
    views: 0,
    likes: 0,
  };
  const all = readPosts();
  all.unshift(post);
  writePosts(all);
  return post;
}
