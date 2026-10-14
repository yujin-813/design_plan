import { readPosts } from "@/lib/posts";
import { listCommentsBy } from "@/lib/comments";
import { readSubmissions } from "@/lib/submissions";
import { listByEmail } from "@/lib/applications";
import { findItem } from "@/lib/content";

// 프로필 "최근 활동" — 글·댓글·과제·프로젝트 지원을 시간순으로 모읍니다.
export type Activity = {
  kind: "post" | "comment" | "chat" | "submission" | "application";
  text: string;
  sub: string;
  href?: string;
  at: string;
};

function snippet(text: string, n = 40) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}

// 댓글이 달린 곳(topicId)을 사람이 읽는 이름과 링크로 바꿉니다.
function describeTopic(topicId: string): { kind: Activity["kind"]; where: string; href?: string } {
  const i = topicId.indexOf(":");
  const type = topicId.slice(0, i);
  const id = topicId.slice(i + 1);
  switch (type) {
    case "post": return { kind: "comment", where: "자유수다 글에 댓글", href: `/community/${id}` };
    case "news": return { kind: "comment", where: "레터·뉴스에 댓글", href: `/news/${id}` };
    case "notice": return { kind: "comment", where: "공지에 댓글", href: `/notices/${id}` };
    case "coursenotice": return { kind: "comment", where: "수업 공지에 댓글", href: `/my-courses/notices/${id}` };
    case "cohort": return { kind: "chat", where: "동기 대화방에 메시지", href: "/my-courses" };
    default: return { kind: "comment", where: "댓글" };
  }
}

export function getRecentActivity(email: string, limit = 6): Activity[] {
  const posts: Activity[] = readPosts()
    .filter((p) => p.authorEmail === email)
    .map((p) => ({ kind: "post", text: "자유수다에 새 글 작성", sub: snippet(p.title), href: `/community/${p.id}`, at: p.createdAt }));

  const comments: Activity[] = listCommentsBy(email).map((c) => {
    const t = describeTopic(c.topicId);
    return { kind: t.kind, text: t.where, sub: snippet(c.text), href: t.href, at: c.createdAt };
  });

  const submissions: Activity[] = readSubmissions()
    .filter((s) => s.submittedByEmail === email)
    .map((s) => ({ kind: "submission", text: "과제 제출", sub: snippet(s.assignment), at: s.submittedAt }));

  const applications: Activity[] = listByEmail(email).map((a) => ({
    kind: "application",
    text: "프로젝트 지원",
    sub: snippet(findItem(a.projectId)?.title ?? "삭제된 프로젝트"),
    href: "/projects",
    at: a.createdAt,
  }));

  return [...posts, ...comments, ...submissions, ...applications]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, limit);
}
